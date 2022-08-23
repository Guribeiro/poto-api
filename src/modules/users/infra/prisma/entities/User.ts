class User {
  full_name: string;

  email: string;

  password: string;

  constructor({full_name, email, password}: User){
    this.full_name = full_name;
    this.email = email;
    this.password = password
  }
}

export default User;