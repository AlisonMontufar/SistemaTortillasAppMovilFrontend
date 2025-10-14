export default class User {
  constructor(Username, RoleId, Token, ExpiresAt) {
    this.Username = Username;
    this.RoleId = RoleId;
    this.Token = Token;
    this.ExpiresAt = ExpiresAt;
  }
}
