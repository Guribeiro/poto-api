import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';
import uploadConfig from '../../config/upload';
import '../container';
import AppError from '../errors/AppError';

const port = 3333;

const app = express();

app.use(cors());

app.use(express.json());

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

    return response.status(500).json({
      message: `Internal server error - ${err.message}`,
    });
  },
);

app.listen(port, () => console.log(`server is running on port ${port}`));
