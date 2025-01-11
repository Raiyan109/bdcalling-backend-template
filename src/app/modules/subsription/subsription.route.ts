import express, { NextFunction, Request, Response } from 'express';
import { SubscriptionControllers } from './subsription.controller';


const router = express.Router();

router.post('/subscribe', SubscriptionControllers.createSubscription);

export const SubscriptionRoutes = router;