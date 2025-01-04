import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { startSession } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import unlinkFile from '../../../shared/unlinkFile';
import { IClient } from '../client/client.interface';
import { Client } from '../client/client.model';
import { Driver } from '../driver/driver.model';

const createClientToDB = async (payload: Partial<IUser & IClient>) => {
  // const createClientToDB = async (payload: Partial<IUser>) => {
  const session = await startSession();

  try {
    session.startTransaction();

    // Validate required fields
    if (!payload.email) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Please provide email');
    }

    const isEmail = await User.findOne({ email: payload.email });
    if (isEmail) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist');
    }

    // Create user first
    const userPayload = {
      email: payload.email,
      password: payload.password,
      role: USER_ROLES.CLIENT, // Initially set role as CLIENT
    };

    // Create user
    const [user] = await User.create([userPayload], { session });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    // Create client and set userId to the created user's _id
    const clientPayload = {
      ...payload,
      userId: user._id, // Set the user's _id as the client userId
    };

    const [client] = await Client.create([clientPayload], {
      session,
    });

    if (!client) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create client');
    }

    // Update the user's client reference
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { client: client._id } },
      { session, new: true }
    );

    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found for update');
    }

    // Generate OTP and prepare email
    const otp = generateOTP();
    const emailValues = {
      name: client.firstName,
      email: user.email,
      otp: otp,
    };
    const accountEmailTemplate = emailTemplate.createAccount(emailValues);
    emailHelper.sendEmail(accountEmailTemplate);

    // Update user with authentication details
    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 3 * 60000),
    };

    const updatedAuthenticationUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { authentication } },
      { session, new: true }
    );

    if (!updatedAuthenticationUser) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'User not found for authentication update'
      );
    }

    // Commit transaction
    await session.commitTransaction();

    return updatedAuthenticationUser;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    // Ensure session ends regardless of success or failure
    await session.endSession();
  }
};
// const createDriverToDB = async (payload: Partial<IUser & IClient>) => {
const createDriverToDB = async (payload: Partial<IUser>) => {
  const session = await startSession();

  try {
    session.startTransaction();

    // Validate required fields
    if (!payload.email) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Please provide email');
    }

    const isEmail = await User.findOne({ email: payload.email });
    if (isEmail) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist');
    }

    // Create user first
    const userPayload = {
      email: payload.email,
      password: payload.password,
      role: USER_ROLES.DRIVER, // Initially set role as CLIENT
    };

    // Create user
    const [user] = await User.create([userPayload], { session });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    // Create client and set userId to the created user's _id
    const clientPayload = {
      ...payload,
      userId: user._id, // Set the user's _id as the client userId
    };

    const [driver] = await Driver.create([clientPayload], {
      session,
    });

    if (!driver) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create driver');
    }

    // // Update the user's client reference
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { driver: driver._id } },
      { session, new: true }
    );

    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found for update');
    }

    // // Generate OTP and prepare email
    const otp = generateOTP();
    const emailValues = {
      name: driver.firstName,
      email: user.email,
      otp: otp,
    };
    const accountEmailTemplate = emailTemplate.createAccount(emailValues);
    emailHelper.sendEmail(accountEmailTemplate);

    // Update user with authentication details
    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 3 * 60000),
    };

    const updatedAuthenticationUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { authentication } },
      { session, new: true }
    );

    if (!updatedAuthenticationUser) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'User not found for authentication update'
      );
    }

    // Commit transaction
    await session.commitTransaction();

    return updatedAuthenticationUser;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    // Ensure session ends regardless of success or failure
    await session.endSession();
  }
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.findById(id).populate('driver client');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
  }

  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

//user suspend

export const UserService = {
  getUserProfileFromDB,
  createDriverToDB,
  updateProfileToDB,
  getSingleUser,
  createClientToDB,
};
