import {Secret, SignOptions} from 'jsonwebtoken';

export default interface ISignDTO {
  payload: string | object | Buffer,
  secret: Secret,
  options: SignOptions,
}
