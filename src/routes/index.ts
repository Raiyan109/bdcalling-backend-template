import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ClientRoutes } from '../app/modules/client/client.route';
import { MessageRoutes } from '../app/modules/message/message.route';
import { ConversationRoutes } from '../app/modules/conversation/conversation.route';
import { SubscriptionRoutes } from '../app/modules/subsription/subsription.route';


const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/client', route: ClientRoutes },
  { path: '/message', route: MessageRoutes },
  { path: '/conversation', route: ConversationRoutes },
  { path: '/subscription', route: SubscriptionRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
