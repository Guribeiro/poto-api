export default interface ICreateUserDTO {
  full_name: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
}

export interface ICreateUserAddress {
  cep: string;
  city: string;
  country: string;
  district: string;
  state: string;
  street: string;
  complement?: string;
}
