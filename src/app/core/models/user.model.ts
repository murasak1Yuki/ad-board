import { UserInfoModel } from '@models/user-info.model';

export class User {
  constructor(
    public email: string,
    public id: string,
    public userInfo: UserInfoModel,
    public refreshToken: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
