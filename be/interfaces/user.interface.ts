export interface ILogin {
  username: string;
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
