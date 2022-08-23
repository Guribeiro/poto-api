import {Router} from 'express';

import usersRouter from '../../../modules/users/http/routes';
import sessionsRouter from '../../../modules/users/http/routes/sessions.routes';

const routes = Router();

routes.use('/users',  usersRouter);
routes.use('/sessions', sessionsRouter);


export default routes;