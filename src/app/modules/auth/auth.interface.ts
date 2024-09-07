export interface IRegisterUser {
  username: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IUpdateUser {
  username?: string;
  email?: string;
}
