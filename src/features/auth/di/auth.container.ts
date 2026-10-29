import { AuthMockDatasource } from '../infrastructure/datasources/auth-mock-datasource';
import { AuthRepositoryImpl } from '../infrastructure/repositories/auth.repository.impl';
import { RegisterUserUseCase } from '../domain/usecases/register-user.usecase';
import { LoginUserUseCase } from '../domain/usecases/login-user.usecase';
import { LogoutUserUseCase } from '../domain/usecases/logout-user.usecase';
import { GetCurrentUserUseCase } from '../domain/usecases/get-current-user.usecase';

const datasource = new AuthMockDatasource();

const authRepository = new AuthRepositoryImpl(datasource);

export const authContainer = {
    registerUser: new RegisterUserUseCase(authRepository),
    loginUser: new LoginUserUseCase(authRepository),
    logoutUser: new LogoutUserUseCase(authRepository),
    getCurrentUser: new GetCurrentUserUseCase(authRepository),
};

export type AuthContainer = typeof authContainer;
