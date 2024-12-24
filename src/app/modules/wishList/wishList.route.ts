import express from 'express';
import { WishListController } from './wishList.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/add/:id',
  auth(USER_ROLES.CLIENT),
  WishListController.createWishListToDB
);
router.delete(
  '/remove/:id',
  auth(USER_ROLES.CLIENT),
  WishListController.removeWishListToDB
);

router.get('/', auth(USER_ROLES.CLIENT), WishListController.getAllWishListToDB);
router.get(
  '/get-my-wishlist',
  auth(USER_ROLES.CLIENT),
  WishListController.getmyWishList
);

export const WishlistRoutes = router;
