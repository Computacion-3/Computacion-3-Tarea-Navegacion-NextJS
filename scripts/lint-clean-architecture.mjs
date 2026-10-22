#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const featuresDir = path.join(projectRoot, 'src', 'features');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const violations = [];
const warnings = [];

/**
 * Recursively find all typescript/javascript files in a directory
 */
function getSourceFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getSourceFiles(fullPath));
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract all imported modules and their line numbers from a file content
 */
function extractImports(content) {
  const lines = content.split('\n');
  const imports = [];

  // Regex patterns for static and dynamic imports
  const staticImportRegex = /from\s+['"]([^'"]+)['"]/g;
  const sideEffectImportRegex = /^import\s+['"]([^'"]+)['"]/g;
  const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Ignore single-line comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

    let match;
    while ((match = staticImportRegex.exec(line)) !== null) {
      imports.push({ source: match[1], line: lineNum, rawLine: line });
    }
    while ((match = sideEffectImportRegex.exec(line)) !== null) {
      imports.push({ source: match[1], line: lineNum, rawLine: line });
    }
    while ((match = dynamicImportRegex.exec(line)) !== null) {
      imports.push({ source: match[1], line: lineNum, rawLine: line });
    }
    while ((match = requireRegex.exec(line)) !== null) {
      imports.push({ source: match[1], line: lineNum, rawLine: line });
    }
  });

  return imports;
}

/**
 * Normalize import source to check architectural layer
 */
function resolveLayerFromImport(importPath, currentFilePath) {
  // Check framework imports
  if (importPath === 'react' || importPath.startsWith('react/')) return 'react';
  if (importPath === 'next' || importPath.startsWith('next/')) return 'next';
  if (importPath === '@reduxjs/toolkit' || importPath === 'react-redux') return 'redux';

  // Check alias @/ or relative imports
  let resolvedPath = importPath;
  if (importPath.startsWith('@/')) {
    resolvedPath = path.join(projectRoot, importPath.replace(/^@\//, ''));
  } else if (importPath.startsWith('.')) {
    resolvedPath = path.resolve(path.dirname(currentFilePath), importPath);
  }

  // Identify layer in resolved path
  const normalized = resolvedPath.replace(/\\/g, '/');
  if (normalized.includes('/domain/')) return 'domain';
  if (normalized.includes('/infrastructure/')) return 'infrastructure';
  if (normalized.includes('/presentation/')) return 'presentation';
  if (normalized.includes('/di/')) return 'di';
  if (normalized.includes('/app/')) return 'app';
  if (normalized.includes('/src/store/')) return 'store';

  return 'other';
}

/**
 * Audit a single file against Clean Architecture rules
 */
function auditFile(filePath) {
  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf-8');
  const imports = extractImports(content);

  const isDomain = relativePath.includes('/domain/');
  const isInfra = relativePath.includes('/infrastructure/');
  const isDi = relativePath.includes('/di/');
  const isPresentation = relativePath.includes('/presentation/');
  const isComponent = relativePath.includes('/presentation/components/');
  const isSlice = relativePath.includes('/presentation/slices/');
  const isHook = relativePath.includes('/presentation/hooks/');

  for (const imp of imports) {
    const targetLayer = resolveLayerFromImport(imp.source, filePath);

    // 1. DOMAIN RULES
    if (isDomain) {
      if (['infrastructure', 'presentation', 'di', 'app', 'store'].includes(targetLayer)) {
        violations.push({
          file: relativePath,
          line: imp.line,
          rule: 'DOMAIN_PURITY',
          message: `Domain layer cannot import from '${targetLayer}' layer ('${imp.source}'). Domain must be 100% pure TypeScript.`,
        });
      }
      if (['react', 'next', 'redux'].includes(targetLayer)) {
        violations.push({
          file: relativePath,
          line: imp.line,
          rule: 'DOMAIN_FRAMEWORK_INDEPENDENCE',
          message: `Domain layer cannot import from framework '${imp.source}'. Domain entities and use cases must not depend on UI or state libraries.`,
        });
      }
    }

    // 2. INFRASTRUCTURE RULES
    if (isInfra) {
      if (['presentation', 'di', 'app'].includes(targetLayer)) {
        violations.push({
          file: relativePath,
          line: imp.line,
          rule: 'INFRASTRUCTURE_BOUNDARY',
          message: `Infrastructure layer cannot depend on presentation or UI elements ('${imp.source}').`,
        });
      }
      if (['react', 'redux'].includes(targetLayer)) {
        violations.push({
          file: relativePath,
          line: imp.line,
          rule: 'INFRASTRUCTURE_FRAMEWORK_INDEPENDENCE',
          message: `Infrastructure layer cannot import React or Redux ('${imp.source}'). Data sources and repositories must remain UI-agnostic.`,
        });
      }
    }

    // 3. DI CONTAINER RULES
    if (isDi) {
      if (['presentation', 'app'].includes(targetLayer)) {
        violations.push({
          file: relativePath,
          line: imp.line,
          rule: 'DI_CONTAINER_PURITY',
          message: `DI container cannot import presentation components or App Router pages ('${imp.source}').`,
        });
      }
    }

    // 4. PRESENTATION COMPONENTS RULES (Dumb / Presentational UI)
    if (isComponent) {
      // Components must not import Redux dispatch/selectors directly
      if (imp.source.includes('/store/hooks') || imp.source.includes('@reduxjs/toolkit') || imp.source === 'react-redux') {
        violations.push({
          file: relativePath,
          line: imp.line,
          rule: 'COMPONENT_REDUX_ISOLATION',
          message: `Presentation components must not import Redux hooks or store directly ('${imp.source}'). Use the feature facade hook in 'presentation/hooks/' instead.`,
        });
      }
      // Components must not bypass DI/UseCases to reach infrastructure directly
      if (targetLayer === 'infrastructure') {
        violations.push({
          file: relativePath,
          line: imp.line,
          rule: 'COMPONENT_INFRASTRUCTURE_BYPASS',
          message: `Presentation components cannot import infrastructure directly ('${imp.source}'). Data must flow through the facade hook.`,
        });
      }
    }

    // 5. PRESENTATION SLICES RULES
    if (isSlice) {
      if (targetLayer === 'infrastructure') {
        violations.push({
          file: relativePath,
          line: imp.line,
          rule: 'SLICE_INFRASTRUCTURE_BYPASS',
          message: `Redux slices and thunks must not import concrete infrastructure directly ('${imp.source}'). Thunks must call Use Cases from the DI container.`,
        });
      }
    }
  }
}

/**
 * Audit directory structure of features
 */
function auditFeatureStructure(featureName, featurePath) {
  const expectedDirs = [
    'domain/entities',
    'domain/repositories',
    'domain/usecases',
    'infrastructure/datasources',
    'infrastructure/dtos',
    'infrastructure/mappers',
    'infrastructure/repositories',
    'presentation/components',
    'presentation/hooks',
    'presentation/slices',
    'presentation/viewmodels',
    'di',
  ];

  for (const relDir of expectedDirs) {
    const fullDirPath = path.join(featurePath, relDir);
    if (!fs.existsSync(fullDirPath)) {
      warnings.push({
        feature: featureName,
        message: `Missing standard clean architecture directory: 'src/features/${featureName}/${relDir}'`,
      });
    }
  }
}

/**
 * Main execution
 */
function run() {
  console.log(`\n${colors.bold}${colors.cyan}=== Clean Architecture Linter & Auditor ===${colors.reset}\n`);

  if (!fs.existsSync(featuresDir)) {
    console.log(`${colors.yellow}No 'src/features' directory found at ${featuresDir}.${colors.reset}`);
    process.exit(0);
  }

  const features = fs
    .readdirSync(featuresDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  if (features.length === 0) {
    console.log(`${colors.yellow}No feature modules found inside 'src/features'.${colors.reset}`);
    process.exit(0);
  }

  console.log(`${colors.blue}Auditing features:${colors.reset} ${features.join(', ')}\n`);

  let scannedFilesCount = 0;

  for (const feature of features) {
    const featurePath = path.join(featuresDir, feature);
    auditFeatureStructure(feature, featurePath);

    const files = getSourceFiles(featurePath);
    scannedFilesCount += files.length;
    for (const file of files) {
      auditFile(file);
    }
  }

  console.log(`${colors.gray}Scanned ${scannedFilesCount} source files across ${features.length} feature(s).${colors.reset}\n`);

  if (warnings.length > 0) {
    console.log(`${colors.yellow}${colors.bold}Structure Warnings (${warnings.length}):${colors.reset}`);
    for (const w of warnings) {
      console.log(`  ${colors.yellow}[WARN]${colors.reset} [${w.feature}] ${w.message}`);
    }
    console.log();
  }

  if (violations.length > 0) {
    console.log(`${colors.red}${colors.bold}Architectural Violations Found (${violations.length}):${colors.reset}\n`);
    for (const v of violations) {
      console.log(`  ${colors.red}[FAIL]${colors.reset} ${colors.bold}${v.file}:${v.line}${colors.reset}`);
      console.log(`         Rule: ${colors.cyan}${v.rule}${colors.reset}`);
      console.log(`         ${v.message}\n`);
    }

    console.log(`${colors.red}${colors.bold}Audit failed with ${violations.length} violation(s).${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}Audit PASSED! All Clean Architecture layer boundaries are respected.${colors.reset}\n`);
    process.exit(0);
  }
}

run();
