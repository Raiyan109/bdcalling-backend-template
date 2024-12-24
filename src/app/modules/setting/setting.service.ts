import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IAboutUs, IPrivacy, ITerms } from './setting.interface';
import { Privacy, TermsAndCondition, About } from './setting.model';

const createTermsAndCondition = async (payload: Partial<ITerms>) => {
  try {
    const existingTerm = await TermsAndCondition.findOne();

    if (existingTerm) {
      Object.assign(existingTerm, payload);
      const updatedTerm = await existingTerm.save();
      return updatedTerm;
    } else {
      const newTerm = await TermsAndCondition.create(payload);
      return newTerm;
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Unable to create or update terms and condition.'
    );
  }
};

const getTermsAndCondition = async () => {
  const term = await TermsAndCondition.findOne();
  if (!term) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Terms and condition not found.');
  }
  return term;
};

const createReturnPolicy = async (payload: Partial<IPrivacy>) => {
  try {
    const existingTerm = await Privacy.findOne();

    if (existingTerm) {
      Object.assign(existingTerm, payload);
      const updatedTerm = await existingTerm.save();
      return updatedTerm;
    } else {
      const newTerm = await Privacy.create(payload);
      return newTerm;
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Unable to create or update return Privacy.'
    );
  }
};

const getReturnPolicy = async () => {
  const term = await Privacy.findOne();

  if (!term) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Privacy policy not found.');
  }

  return term;
};

// about us
const createAboutUs = async (payload: Partial<IAboutUs>) => {
  try {
    const existingTerm = await About.findOne();

    if (existingTerm) {
      Object.assign(existingTerm, payload);
      const updatedTerm = await existingTerm.save();
      return updatedTerm;
    } else {
      const newTerm = await About.create(payload);
      return newTerm;
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Unable to create or update return About us.'
    );
  }
};

const getAboutUs = async () => {
  const term = await About.findOne();

  if (!term) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'About us not found.');
  }

  return term;
};

export const SettingService = {
  createTermsAndCondition,
  createReturnPolicy,
  getTermsAndCondition,
  getReturnPolicy,
  createAboutUs,
  getAboutUs,
};
