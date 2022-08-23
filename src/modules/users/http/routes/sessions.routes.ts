import { Router } from 'express';
import refreshTokenRoutes from './refresh_token.routes';

import AuthenticateUserController from '../useCases/AuthenticateUser/AuthenticateUserController';

const authenticateUserController = new AuthenticateUserController();

const sessionsRouter = Router();

sessionsRouter.use('/refresh_token', refreshTokenRoutes)
sessionsRouter.post('/', authenticateUserController.handle);

export default sessionsRouter;