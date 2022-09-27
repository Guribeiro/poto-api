import { Router } from 'express';
import refreshTokenRoutes from './refresh_token.routes';

import CheckEmailAvailableController from '../useCases/CheckEmailAvailable/CheckEmailAvailableController';
import CheckUsernameAvailableController from '../useCases/CheckUsernameAvailable/CheckUsernameAvailableController';
import AuthenticateUserController from '../useCases/AuthenticateUser/AuthenticateUserController';

const authenticateUserController = new AuthenticateUserController();
const checkEmailAvailableController = new CheckEmailAvailableController();
const checkUsernameAvailableController = new CheckUsernameAvailableController();

const sessionsRouter = Router();

sessionsRouter.use('/refresh_token', refreshTokenRoutes);

sessionsRouter.post('/valid_email', checkEmailAvailableController.handle);
sessionsRouter.post('/valid_username', checkUsernameAvailableController.handle);

sessionsRouter.post('/', authenticateUserController.handle);

export default sessionsRouter;
