import express from 'express';
import { SettingController } from './setting.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-terms',
  auth(USER_ROLES.ADMIN),
  SettingController.createTermsAndCondition
);
router.get('/get-terms', SettingController.getTermsAndCondition);

router.post(
  '/create-pricy',
  auth(USER_ROLES.ADMIN),
  SettingController.createReturnPolicy
);

router.get('/get-pricy', SettingController.getReturnPolicy);

// about us
router.post(
  '/create-about-us',
  auth(USER_ROLES.ADMIN),
  SettingController.createAboutUS
);

router.get('/get-about-us', SettingController.getAboutUs);

export const SettingRoutes = router;
