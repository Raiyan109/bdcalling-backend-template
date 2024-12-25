import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  role: USER_ROLES;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password: string;
  status: 'active' | 'suspended' | 'deleted';
  verified: boolean;
  phone: string;
  image: string;

  appId?: string;
  fcmToken?: string;
  isSuspended: boolean;
  suspensionEndDate?: Date;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
