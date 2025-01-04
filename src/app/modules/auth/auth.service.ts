import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import {
  IAuthResetPassword,
  IChangePassword,
  ILoginData,
  IVerifyEmail,
} from '../../../types/auth';
import cryptoToken from '../../../util/cryptoToken';
import generateOTP from '../../../util/generateOTP';
import { User } from '../user/user.model';
import { ResetToken } from '../resetToken/resetToken.model';
// import { sendNotifications } from '../../../helpers/notificationHelper';

import { startSession } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import { log } from 'winston';

//login
const loginUserFromDB = async (payload: ILoginData) => {
  const { email, password } = payload;

  if (!password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is required');
  }

  const isExistUser = await User.findOne({ email }).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check verified and status
  if (!isExistUser.verified) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please verify your account, then try to login again'
    );
  }

  //check user status
  if (isExistUser.status === 'deleted') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You don’t have permission to access this content.It looks like your account has been deactivated.'
    );
  }

  //check match password
  if (
    password &&
    !(await User.isMatchPassword(password, isExistUser.password))
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
  }

  //create token
  const accessToken = jwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
    config.jwt.jwt_secret as Secret,
    '7d'
  );

  //create token
  const refreshToken = jwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
    config.jwt.jwtRefreshSecret as Secret,
    '15d'
  );

  return { accessToken, refreshToken };
};

const loginUserSocial = async (payload: ILoginData) => {
  const { email, appId, role, type, fcmToken } = payload;

  if (type === 'social') {
    const session = await startSession();
    let user: any | null;

    try {
      session.startTransaction();

      // Check if user already exists
      user = await User.findOne({ email });

      if (!user) {
        // Create user
        const [newUser] = await User.create(
          [
            {
              appId,
              fcmToken,
              role,
              email,
              verified: true,
            },
          ],
          { session }
        );

        if (!newUser) {
          throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Failed to create user'
          );
        }

        user = newUser;

        // Create related entity based on role
        // if (role === USER_ROLES.CLIENT) {
        //   await Client.create(
        //     [
        //       {
        //         userId: user._id,
        //         email: user.email,
        //         status: 'active',
        //         firstName: '', // Placeholder
        //         lastName: '', // Placeholder
        //         address: '', // Placeholder
        //         image: '', // Placeholder
        //         phone: '', // Placeholder
        //       },
        //     ],
        //     { session }
        //   );
        // } else if (role === USER_ROLES.DRIVER) {
        //   await Driver.create(
        //     [
        //       {
        //         userId: user._id,
        //         email: user.email,
        //         status: 'active',
        //         firstName: '', // Placeholder
        //         lastName: '', // Placeholder
        //         address: '', // Placeholder
        //         image: '', // Placeholder
        //         phone: '', // Placeholder
        //         licenseNumber: '', // Placeholder
        //         vehicleDetails: '', // Placeholder
        //       },
        //     ],
        //     { session }
        //   );
        // }
      }

      // Commit transaction
      await session.commitTransaction();

      // Generate tokens
      const accessToken = jwtHelper.createToken(
        { id: user._id, role: user.role, email: user.email },
        config.jwt.jwt_secret as Secret,
        '7d'
      );

      const refreshToken = jwtHelper.createToken(
        { id: user._id, role: user.role, email: user.email },
        config.jwt.jwtRefreshSecret as Secret,
        '15d'
      );

      return { accessToken, refreshToken };
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      // End session
      await session.endSession();
    }
  }

  throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid login type');
};

const forgetPasswordToDB = async (email: string) => {
  const isExistUser = await User.isExistUserByEmail(email);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    email: isExistUser.email,
  };
  const forgetPassword = emailTemplate.resetPassword(value);
  emailHelper.sendEmail(forgetPassword);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate({ email }, { $set: { authentication } });
};

//verify email
const verifyEmailToDB = async (payload: IVerifyEmail) => {
  const { email, oneTimeCode } = payload;
  const isExistUser = await User.findOne({ email }).select('+authentication');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give the otp, check your email we send a code'
    );
  }

  if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You provided wrong otp');
  }

  const date = new Date();
  if (date > isExistUser.authentication?.expireAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Otp already expired, Please try again'
    );
  }

  let message;
  let data;

  if (!isExistUser.verified) {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      { verified: true, authentication: { oneTimeCode: null, expireAt: null } }
    );
    message =
      'Your email has been successfully verified. Your account is now fully activated.';
  } else {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      {
        authentication: {
          isResetPassword: true,
          oneTimeCode: null,
          expireAt: null,
        },
      }
    );

    //create token ;
    const createToken = cryptoToken();
    await ResetToken.create({
      user: isExistUser._id,
      token: createToken,
      expireAt: new Date(Date.now() + 5 * 60000),
    });
    message =
      'Verification Successful: Please securely store and utilize this code for reset password';
    data = createToken;
  }
  return { data, message };
};

//forget password
const resetPasswordToDB = async (
  token: string,
  payload: IAuthResetPassword
) => {
  const { newPassword, confirmPassword } = payload;
  //isExist token
  const isExistToken = await ResetToken.isExistToken(token);
  if (!isExistToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
  }

  //user permission check
  const isExistUser = await User.findById(isExistToken.user).select(
    '+authentication'
  );
  if (!isExistUser?.authentication?.isResetPassword) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "You don't have permission to change the password. Please click again to 'Forgot Password'"
    );
  }

  //validity check
  const isValid = await ResetToken.isExpireToken(token);
  if (!isValid) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Token expired, Please click again to the forget password'
    );
  }

  //check password
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "New password and Confirm password doesn't match!"
    );
  }

  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
    authentication: {
      isResetPassword: false,
    },
  };

  await User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
    new: true,
  });
};

const changePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword
) => {
  const { currentPassword, newPassword, confirmPassword } = payload;
  const isExistUser = await User.findById(user.id).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //current password match
  if (
    currentPassword &&
    !(await User.isMatchPassword(currentPassword, isExistUser.password))
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
  }

  //newPassword and current password
  if (currentPassword === newPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give different password from current password'
    );
  }
  //new password and confirm password check
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password and Confirm password doesn't matched"
    );
  }

  //hash password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
  };
  await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });

  const value = {
    receiver: isExistUser._id,
    text: 'Your password changed successfully',
  };

  if (isExistUser) {
    // sendNotifications(value);
  }
};

const deleteAccountToDB = async (user: JwtPayload) => {
  const result = await User.findByIdAndDelete(user?.id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No User found');
  }

  return result;
};

const newAccessTokenToUser = async (token: string) => {
  // Check if the token is provided
  if (!token) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Token is required!');
  }

  const verifyUser = jwtHelper.verifyToken(
    token,
    config.jwt.jwtRefreshSecret as Secret
  );

  const isExistUser = await User.findById(verifyUser?.id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized access');
  }

  //create token
  const accessToken = jwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as string
  );

  return { accessToken };
};

// const resendVerificationEmailToDB = async (email: string) => {
//   // Find the user by ID
//   const existingUser: any = await User.findOne({ email: email }).lean();

//   if (!existingUser) {
//     throw new ApiError(
//       StatusCodes.NOT_FOUND,
//       'User with this email does not exist!'
//     );
//   }

//   if (existingUser?.isVerified) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'User is already verified!');
//   }

//   console.log(existingUser);

//   // Generate OTP and prepare email
//   const otp = generateOTP();
//   const emailValues = {
//     name: existingUser.firstName,
//     otp,
//     email: existingUser.email,
//   };
//   const accountEmailTemplate = emailTemplate.createAccount(emailValues);
//   emailHelper.sendEmail(accountEmailTemplate);

//   // Update user with authentication details
//   const authentication = {
//     oneTimeCode: otp,
//     expireAt: new Date(Date.now() + 3 * 60000),
//   };

//   await User.findOneAndUpdate(
//     { email: email },
//     { $set: { authentication } },
//     { new: true }
//   );
// };

const resendVerificationEmailToDB = async (email: string) => {
  // Find the user and associated data using aggregation
  const existingUser = await User.aggregate([
    {
      $match: { email }, // Match by email
    },
    {
      $lookup: {
        from: 'clients', // Assuming the Client collection is named 'clients'
        localField: '_id',
        foreignField: 'userId',
        as: 'clientData',
      },
    },
    {
      $lookup: {
        from: 'drivers', // Assuming the Driver collection is named 'drivers'
        localField: '_id',
        foreignField: 'userId',
        as: 'driverData',
      },
    },
    {
      $project: {
        firstName: {
          $ifNull: [
            { $arrayElemAt: ['$clientData.firstName', 0] },
            { $arrayElemAt: ['$driverData.firstName', 0] },
          ],
        },
        isVerified: 1,
        userType: 1,
      },
    },
  ]);

  // Validate if user exists
  if (!existingUser.length) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'User with this email does not exist!'
    );
  }

  const user = existingUser[0];

  // Check if user is already verified
  if (user.isVerified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User is already verified!');
  }

  // Generate OTP and prepare email
  const otp = generateOTP();
  const emailValues = {
    name: user.firstName || 'User', // Default to 'User' if no name is found
    otp,
    email,
  };

  const accountEmailTemplate = emailTemplate.createAccount(emailValues);
  emailHelper.sendEmail(accountEmailTemplate);

  // Update user with authentication details
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000), // OTP expires in 3 minutes
  };

  await User.findOneAndUpdate(
    { email },
    { $set: { authentication } },
    { new: true }
  );
};

export const AuthService = {
  verifyEmailToDB,
  loginUserFromDB,
  forgetPasswordToDB,
  resetPasswordToDB,
  changePasswordToDB,
  deleteAccountToDB,
  newAccessTokenToUser,
  resendVerificationEmailToDB,
  loginUserSocial,
};
