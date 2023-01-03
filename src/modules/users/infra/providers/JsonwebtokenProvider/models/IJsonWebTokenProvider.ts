import ISignDTO from '../dtos/ISignDTO';
import { JwtPayload } from 'jsonwebtoken';

interface IJsonWebTokenProvider {
  sign: (data: ISignDTO) => string;
  verify: (token: string, secretOrPublicKey: string) => string | JwtPayload;
}

export default IJsonWebTokenProvider;
