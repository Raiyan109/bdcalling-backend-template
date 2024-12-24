import express from 'express';
import { PushNotificationController } from './pushNotification.controller';

const router = express.Router();

router.post('/send', PushNotificationController.sendNotification);

export const PushNotificationRoutes = router;
