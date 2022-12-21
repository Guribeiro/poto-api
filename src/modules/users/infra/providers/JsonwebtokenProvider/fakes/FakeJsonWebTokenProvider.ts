import { Secret, VerifyOptions, Jwt } from 'jsonwebtoken';
import ISignDTO from '../dtos/ISignDTO';
import IJsonWebTokenProvider from '../models/IJsonWebTokenProvider';

class FakeJsonWebTokenProvider implements IJsonWebTokenProvider {
  public sign(data: ISignDTO): string {
    return 'token';
  }
}

export default FakeJsonWebTokenProvider;
