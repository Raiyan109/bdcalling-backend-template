import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { MessageController } from './message.controller';


const router = express.Router();

router.post('/send-message/:id', auth(USER_ROLES.CLIENT), MessageController.sendMessage);

router.get('/get-all-messages',
  auth(USER_ROLES.CLIENT), MessageController.getAllMessages);

export const MessageRoutes = router;