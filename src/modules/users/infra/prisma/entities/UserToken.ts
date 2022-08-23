class UserToken {
  refresh_token: string;

  user_id: string;

  expires_date: Date;

  constructor({refresh_token, user_id, expires_date}: UserToken){
    this.refresh_token = refresh_token;
    this.user_id = user_id;
    this.expires_date = expires_date
  }
}

export default UserToken;