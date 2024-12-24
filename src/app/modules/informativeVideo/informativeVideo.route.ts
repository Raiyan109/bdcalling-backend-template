import express, { NextFunction, Request, Response } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { InformativeVideoValidation } from './informativeVideo.validation';
import { InformativeVideoController } from './informativeVideo.controller';

const router = express.Router();

router.post(
  '/create',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = InformativeVideoValidation.createInformativeVideoSchema.parse(
      JSON.parse(req.body.data)
    );
    return InformativeVideoController.createInformativeVideoIntoDb(
      req,
      res,
      next
    );
  }
);

router.patch(
  '/update/:id',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = InformativeVideoValidation.updatedInformativeVideoSchema.parse(
      JSON.parse(req.body.data)
    );
    return InformativeVideoController.updateInformationVideo(req, res, next);
  }
);

router.get(
  '/get-all-informative-video',
  InformativeVideoController.getAllInformativeVideo
);
router.get('/:id', InformativeVideoController.getSingleInformativeVideo);

router.delete(
  '/delete/:id',
  auth(USER_ROLES.ADMIN),
  InformativeVideoController.deleteInformativeVideo
);

export const InformativeVideoRoutes = router;
