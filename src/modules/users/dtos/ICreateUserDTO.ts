export default interface ICreateUserDTO {
  full_name: string;
  email: string;
  password: string;
  address: {
    cep: string;
    city: string;
    country: string;
    district: string;
    state: string;
    street: string;
    complement?: string;
  };
}
