import { z } from 'zod';

const ScheduleValidationSchema = z.object({
  body: z.object({
    day: z.enum([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]),
    startTime: z
      .string()
      .regex(
        /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
        'Start time must be in the format hh:mm AM/PM'
      ),
    endTime: z
      .string()
      .regex(
        /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
        'End time must be in the format hh:mm AM/PM'
      ),
    isOff: z.boolean(),
  }),
});

export default ScheduleValidationSchema;
