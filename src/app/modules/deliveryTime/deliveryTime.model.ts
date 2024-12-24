import { model, Schema } from 'mongoose';
import { IDeliveryTime } from './deliveryTime.interface';

const ScheduleSchema = new Schema<IDeliveryTime>({
  day: {
    type: String,
    required: true,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isOff: { type: Boolean, default: false },
});

export const Schedule = model<IDeliveryTime>('Schedule', ScheduleSchema);
