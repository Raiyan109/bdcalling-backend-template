import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserSuspentionController } from './userSuspention.controller';
const router = express.Router();

router.post(
  '/suspend-user',
  auth(USER_ROLES.ADMIN),
  UserSuspentionController.suspendUserController
);

router.post(
  '/reactivate-user',
  auth(USER_ROLES.ADMIN),
  UserSuspentionController.ReactivateUsers
);

router.get(
  '/get-suspended-users/:id',
  auth(USER_ROLES.ADMIN),
  UserSuspentionController.getAllSuspendedUsers
);

router.get(
  '/get-suspended-users',
  auth(USER_ROLES.ADMIN),
  UserSuspentionController.getSuspendedUsers
);

router.post(
  '/user-active/:id',
  auth(USER_ROLES.ADMIN),
  UserSuspentionController.ActiveUser
);

export const UserSuspentionRoutes = router;
