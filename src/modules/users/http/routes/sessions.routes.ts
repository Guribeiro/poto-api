import { Router } from 'express';
import AuthenticateUserController from '../useCases/AuthenticateUser/AuthenticateUserController';

const authenticateUserController = new AuthenticateUserController();

const sessionsRouter = Router();

sessionsRouter.post('/', authenticateUserController.handle);

export default sessionsRouter;