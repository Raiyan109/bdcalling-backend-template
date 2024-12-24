import express, { NextFunction, Request, Response } from 'express';
import { ArticleController } from './article.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ArticleValidation } from './article.validation';

const router = express.Router();

router.post(
  '/create-article',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = ArticleValidation.ArticleSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return ArticleController.createArticle(req, res, next);
  }
);

router.get('/get-all-article', ArticleController.getAllArticle);

router.get('/get-all-article/:id', ArticleController.getSingleArticle);

router.patch(
  '/update-article/:id',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = ArticleValidation.ArticleSchemaUpdated.parse(
        JSON.parse(req.body.data)
      );
    }
    return ArticleController.updatedArticle(req, res, next);
  }
);

router.delete(
  '/delete-article/:id',
  auth(USER_ROLES.ADMIN),
  ArticleController.deleteArticle
);

export const ArticleRoutes = router;
