import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { OrderTypeValidation } from './orderType.validation';
import { OrderTypeController } from './orderType.controller';

const router = express.Router();

router.post(
  '/create-order-type',
  auth(USER_ROLES.ADMIN),
  validateRequest(OrderTypeValidation.createOrderTypeSchema),
  OrderTypeController.createOrderTypeToDb
);

export const TypeRoutes = router;
