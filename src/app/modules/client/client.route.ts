import express, { NextFunction, Request, Response } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ClientValidation } from './client.validation';
import { ClientController } from './client.controller';

const router = express.Router();

router.patch(
  '/update-client/:id',
  fileUploadHandler(),
  auth(USER_ROLES.CLIENT),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = ClientValidation.ClientSchema.parse(JSON.parse(req.body.data));
    }
    return ClientController.updateClientProfile(req, res, next);
  }
);

router.get('/get-all-client', ClientController.getAllUsers);

export const ClientRoutes = router;