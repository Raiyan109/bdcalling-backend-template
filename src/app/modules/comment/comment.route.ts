import express from 'express';
import { CommentController } from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-comment',
  auth(USER_ROLES.DRIVER),
  CommentController.createCommentToDB
);

router.get(
  '/get-comment/:id',
  auth(USER_ROLES.DRIVER),
  CommentController.getSingleComment
);

router.get(
  '/get-all-comment/:id',
  auth(USER_ROLES.DRIVER),
  CommentController.getAllComment
);

export const CommentRoutes = router;
