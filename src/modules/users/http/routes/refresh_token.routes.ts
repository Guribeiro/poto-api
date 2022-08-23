import { Router } from 'express';
import RefreshTokenController from '../useCases/RefreshToken/RefreshTokenController';

const refreshTokenController = new RefreshTokenController();

const refreshTokenRoutes = Router();

refreshTokenRoutes.post('/', refreshTokenController.handle);

export default refreshTokenRoutes;
