import { Router } from 'express';

import usersRouter from '../../../modules/users/http/routes';
import postsRouter from '../../../modules/posts/http/routes';
import profileRouter from '../../../modules/users/http/routes/profile.routes';
import sessionsRouter from '../../../modules/users/http/routes/sessions.routes';

const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);
routes.use('/users', usersRouter);
routes.use('/posts', postsRouter);

export default routes;
