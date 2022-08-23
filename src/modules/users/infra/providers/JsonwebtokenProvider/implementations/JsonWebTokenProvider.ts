import {sign} from 'jsonwebtoken';
import ISignDTO from "../dtos/ISignDTO";
import IJsonWebTokenProvider from "../models/IJsonWebTokenProvider";

class JsonWebTokenProvider implements IJsonWebTokenProvider {

  public sign({payload, options, secret}: ISignDTO): string {
    const token = sign(payload, secret, options);

    return token;
  }
}


export default JsonWebTokenProvider;
