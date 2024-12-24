import express, { NextFunction, Request, Response } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { DeliveryConfirmationValidation } from './deliveryCofirmation.validation';
import { DeliveryCofirmationController } from './deliveryCofirmation.controller';

const router = express.Router();

router.post(
  '/create-delivery-confirmation',
  fileUploadHandler(),
  auth(USER_ROLES.DRIVER),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body =
        DeliveryConfirmationValidation.deliveryConfirmationSchema.parse(
          JSON.parse(req.body.data)
        );
    }
    return DeliveryCofirmationController.createDeliveryCofirmation(
      req,
      res,
      next
    );
  }
);

router.get(
  '/get-all-delivery-confirmation',
  auth(USER_ROLES.DRIVER),
  DeliveryCofirmationController.getDeliveryHistory
);

export const DeliveryCofirmationRoutes = router;
