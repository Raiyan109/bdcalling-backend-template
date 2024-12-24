import { model, Schema } from 'mongoose';
import { IInformativeVideo } from './informativeVideo.interface';

const informationVideoSchema = new Schema<IInformativeVideo>(
  {
    video: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

informationVideoSchema.pre('save', async function (next) {
  const isExist = await InformativeVideo.findOne({ title: this.title });
  if (isExist) {
    throw new Error('Title already exist!');
  }
  next();
});

export const InformativeVideo = model<IInformativeVideo>(
  'InformativeVideo',
  informationVideoSchema
);
