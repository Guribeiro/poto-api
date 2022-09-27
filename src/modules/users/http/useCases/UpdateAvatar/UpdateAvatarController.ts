import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateAvatarUseCase from './UpdateAvatarUseCase';

class UpdateAvatarController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;

      const { filename } = request.file as Express.Multer.File;

      const updateAvatar = container.resolve(UpdateAvatarUseCase);

      const user = await updateAvatar.execute({
        user_id: id,
        avatar: filename,
      });

      console.log(user);

      return response.status(200).json(user);
    } catch (error) {
      const err = error as Error;
      console.log({ error });
      return response.status(400).json({ error: err.message });
    }
  }
}

export default UpdateAvatarController;
