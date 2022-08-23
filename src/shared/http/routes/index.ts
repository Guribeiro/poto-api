import {Router} from 'express';
import usersRouter from '../../../modules/users/http/routes';

const routes = Router();

routes.use('/users',  usersRouter);


export default routes;