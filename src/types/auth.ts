export type IVerifyEmail = {
  email: string;
  oneTimeCode: number;
};

// export type ILoginData = {
//   email: string;
//   password: string;
// };

export type ILoginData = {
  email: string;
  password: string;
  appId: string;
  fcmToken: string;
  role: string;
  type: string;
};

export type IAuthResetPassword = {
  newPassword: string;
  confirmPassword: string;
};

export type IChangePassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
