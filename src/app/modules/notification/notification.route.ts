import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { NotificationController } from './notification.controller';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.CLIENT),
  NotificationController.getNotificationToDb
);

router.patch(
  '/',
  auth(USER_ROLES.CLIENT),
  NotificationController.readNotification
);

router.get(
  '/admin',
  auth(USER_ROLES.ADMIN),
  NotificationController.adminNotificationFromDB
);

router.patch(
  '/admin',
  auth(USER_ROLES.ADMIN),
  NotificationController.adminReadNotification
);

//driver
router.get(
  '/driver',
  auth(USER_ROLES.DRIVER),
  NotificationController.getNotificationFromDriver
);

//client
router.get(
  '/client',
  auth(USER_ROLES.CLIENT),
  NotificationController.getNotificationFromClient
);

router.delete(
  '/delete-all',
  auth(USER_ROLES.ADMIN),
  NotificationController.deleteAllNotifications
);

export const NotificationRoutes = router;
