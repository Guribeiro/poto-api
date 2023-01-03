import { JwtPayload, sign, verify } from 'jsonwebtoken';
import ISignDTO from '../dtos/ISignDTO';
import IJsonWebTokenProvider from '../models/IJsonWebTokenProvider';

class FakeJsonWebTokenProvider implements IJsonWebTokenProvider {
  public sign({ payload, options, secret }: ISignDTO): string {
    return sign(payload, secret, options);
  }

  public verify(token: string, secretOrPublicKey: string): string | JwtPayload {
    return verify(token, secretOrPublicKey);
  }
}

export default FakeJsonWebTokenProvider;
