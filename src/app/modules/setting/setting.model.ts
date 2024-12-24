import { model, Schema } from 'mongoose';
import { IAboutUs, IPrivacy, ITerms } from './setting.interface';

// terms and condition
const termSchema = new Schema<ITerms>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TermsAndCondition = model<ITerms>('TermsAndCondition', termSchema);

// return Pricy
const returnSchema = new Schema<IPrivacy>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Privacy = model<IPrivacy>('Privacy', returnSchema);

// return About
const AboutSchema = new Schema<IAboutUs>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const About = model<IAboutUs>('About', AboutSchema);
