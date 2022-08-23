import { Router } from 'express';
import CreateUserController from '../useCases/CreateUser/CreateUserController';

const createUserController = new CreateUserController();

const usersRouter = Router();

usersRouter.post('/', createUserController.handle);

export default usersRouter;