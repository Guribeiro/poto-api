import { Request, Response, NextFunction, request } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '../../../../shared/errors/AppError';
import auth from '../../../../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new AppError('JTW is missing', 401);
  }

  const [, token] = authorization.split(' ');

  const { secret } = auth.jwt;

  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    throw new AppError('invalid JWT token', 401);
  }
}
