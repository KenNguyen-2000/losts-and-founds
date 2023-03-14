export interface ILogin {
  email: string;
  password: string;
}

export interface IChangePassword {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface IUpdateProfile {
  userId: string;
  password?: string;
  phoneNumber?: string;
  name?: string;
  avatarUrl?: string;
  dob?: Date;
}
export interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
