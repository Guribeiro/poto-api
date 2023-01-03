import { JwtPayload, sign, verify } from 'jsonwebtoken';
import ISignDTO from '../dtos/ISignDTO';
import IJsonWebTokenProvider from '../models/IJsonWebTokenProvider';

class JsonWebTokenProvider implements IJsonWebTokenProvider {
  public sign({ payload, options, secret }: ISignDTO): string {
    const token = sign(payload, secret, options);

    return token;
  }

  public verify(token: string, secretOrPublicKey: string): string | JwtPayload {
    return verify(token, secretOrPublicKey);
  }
}

export default JsonWebTokenProvider;
