import ISignDTO from '../dtos/ISignDTO';

interface IJsonWebTokenProvider {
  sign: (data: ISignDTO) => string;
}

export default IJsonWebTokenProvider;
