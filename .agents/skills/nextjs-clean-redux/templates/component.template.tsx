'use client';

import { {{EntityName}}ItemViewModel } from '../viewmodels/{{entity-slug}}.viewmodel';

interface {{EntityName}}CardProps {
    item: {{EntityName}}ItemViewModel;
}

export function {{EntityName}}Card({ item }: {{EntityName}}CardProps) {
    return (
        <article className="card bg-base-100 border border-base-200 shadow-sm hover:shadow transition-shadow">
            <div className="card-body p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="card-title text-base font-semibold">{item.title}</h3>
                    <span className={`badge ${item.isRecent ? 'badge-primary' : 'badge-ghost'} badge-sm`}>
                        {item.badgeText}
                    </span>
                </div>
                <p className="text-sm opacity-80">{item.descriptionText}</p>
                <div className="card-actions justify-end pt-2">
                    <span className="text-xs opacity-50">{item.formattedDate}</span>
                </div>
            </div>
        </article>
    );
}
