import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

import uploadConfig from '../../../config/upload';

const { posts } = uploadConfig;

const upload = multer(posts);

function uploadFile(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const upload = multer().single('photo');

  upload(request, response, function (error) {
    if (error instanceof multer.MulterError) {
      console.log(error);
      return response.status(400).json({ error: error.message });
    } else if (error) {
      console.log(error);
      return response.status(500);
    }

    next();
  });
}

export default uploadFile;
