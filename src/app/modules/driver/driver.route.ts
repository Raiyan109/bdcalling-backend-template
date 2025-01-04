import express, { NextFunction, Request, Response } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { DriverValidation } from './driver.validation';
import { DriverController } from './driver.controller';

const router = express.Router();

router.patch(
    '/update-driver/:id',
    fileUploadHandler(),
    auth(USER_ROLES.DRIVER),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = DriverValidation.DriverSchema.parse(JSON.parse(req.body.data));
        }
        return DriverController.updateDriverProfile(req, res, next);
    }
);

router.get('/get-all-driver', DriverController.getAllUsers);

export const DriverRoutes = router;