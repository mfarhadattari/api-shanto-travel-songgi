export interface IRegisterUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IUpdateProfile {
  username?: string;
  email?: string;
  avatar?: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IForgetPassword {
  email: string;
}

export interface IResetPassword {
  email: string;
  token: string;
  password: string;
}
