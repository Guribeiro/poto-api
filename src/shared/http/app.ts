import 'reflect-metadata';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';

import cors from 'cors';
import uploadConfig from '../../config/upload';
import routes from './routes';
import AppError from '../errors/AppError';

import '../container';

const app = express();

app.use(cors());

app.use(express.json({ limit: '200mb' }));

app.use('/files/posts', express.static(uploadConfig.posts.directory));
app.use('/files/avatars', express.static(uploadConfig.avatars.directory));

app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    console.log(err);
    return response.status(500).json({
      message: `Internal server error - ${err.message}`,
    });
  },
);

export { app };
