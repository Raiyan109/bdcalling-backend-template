import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { ReviewRoutes } from '../app/modules/review/review.route';
import { SettingRoutes } from '../app/modules/setting/setting.route';
import { WishlistRoutes } from '../app/modules/wishList/wishList.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';
import { DriverRoutes } from '../app/modules/driver/driver.route';
import { ClientRoutes } from '../app/modules/client/client.route';
import { ArticleRoutes } from '../app/modules/article/article.route';
import { InformativeVideoRoutes } from '../app/modules/informativeVideo/informativeVideo.route';
import { DeliveryTimeRoutes } from '../app/modules/deliveryTime/deliveryTime.route';
import { UserSuspentionRoutes } from '../app/modules/userSuspention/userSuspention.route';
import { OrderReqRoutes } from '../app/modules/orderReq/orderReq.route';
import { TypeRoutes } from '../app/modules/orderType/orderType.route';
import { DeliveryCofirmationRoutes } from '../app/modules/deliveryCofirmation/deliveryCofirmation.route';
import { PushNotificationRoutes } from '../app/modules/pushNotification/pushNotification.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/faq', route: FaqRoutes },
  { path: '/category', route: CategoryRoutes },
  { path: '/review', route: ReviewRoutes },
  { path: '/setting', route: SettingRoutes },
  { path: '/wishList', route: WishlistRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/driver', route: DriverRoutes },
  { path: '/client', route: ClientRoutes },
  { path: '/article', route: ArticleRoutes },
  { path: '/informative-video', route: InformativeVideoRoutes },
  { path: '/delivery-time', route: DeliveryTimeRoutes },
  { path: '/user-suspention', route: UserSuspentionRoutes },
  { path: '/order', route: OrderReqRoutes },
  { path: '/order-type', route: TypeRoutes },
  { path: '/delivery-confirmation', route: DeliveryCofirmationRoutes },
  { path: '/push-notification', route: PushNotificationRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
