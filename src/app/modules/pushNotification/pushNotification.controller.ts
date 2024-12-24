import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PushNotificationService } from './pushNotification.service';

const sendNotification = catchAsync(async (req, res) => {
  const result = await PushNotificationService.sendNotifications(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Notification sent successfully',
    data: result,
  });
});

export const PushNotificationController = {
  sendNotification,
};
