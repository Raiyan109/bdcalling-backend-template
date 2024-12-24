import express from 'express';
import auth from '../../middlewares/auth';
import { DeliveryTimeController } from './deliveryTime.controller';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import ScheduleValidationSchema from './deliveryTime.validation';

const router = express.Router();

router.post(
  '/set-schedule',
  auth(USER_ROLES.ADMIN),
  validateRequest(ScheduleValidationSchema),
  DeliveryTimeController.setSchedule
);

router.post(
  '/day-off',
  auth(USER_ROLES.ADMIN),
  DeliveryTimeController.setDayOff
);

router.post(
  '/remove-day-off',
  auth(USER_ROLES.ADMIN),
  DeliveryTimeController.removeDayOff
);

router.get('/get-schedule', DeliveryTimeController.getSchedule);

export const DeliveryTimeRoutes = router;
