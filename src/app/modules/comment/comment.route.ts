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

// IP_ADDRESS=192.168.12.206
// DATABASE_URL=mongodb+srv://mon-Cposomt:ubdCLReA7qKOSPDM@cluster0.afkplob.mongodb.net/Mon-Cposomt?retryWrites=true&w=majority&appName=Cluster0

// NODE_ENV=development

// PORT=5050

// BCRYPT_SALT_ROUNDS=12

// STRIPE_SECRET_KEY=sk_test_51M5x5eLMVhw2FMhm0yY0cz9zgcE6dzaNfqYCfi9MinGXNPqzUpBbIbbCWvzemLlWntdhdweHgSRIczVvjP99WAAX00dokc4QEO

// STRIPE_WEBHOOK_SECRET=whsec_7f3ce01ea07c54f562100042b9ab62ce925d41e82a22790a0af2ddcc1f7af218

// # //jwt
// JWT_SECRET=topSecReat578$3
// JWT_EXPIRE_IN=7d
// JWT_REFRESH_SECRET=topSecReat569@
// JWT_REFRESH_EXPIRE_IN=15d

// # //mail

// EMAIL_FROM=rifatkhan5567790@gmail.com
// EMAIL_USER=rifatkhan5567790@gmail.com
// EMAIL_PORT=587
// EMAIL_HOST=smtp.gmail.com
// EMAIL_PASS=mmeu cyuw svwz icbz
// # masha

// # super-admin
// ADMIN_EMAIL=admin@gmail.com
// ADMIN_PASSWORD=12345678

// # firebase admin config

// FIREBASE_TYPE=service_account
// FIREBASE_PROJECT_ID=push-notification-33a33
// FIREBASE_PRIVATE_KEY_ID=6e20b7898b7c5f66bb48fd3f3d1c7f86ecb4012e
// FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0HRqrLDnsAhI5\\nHCjKIjbls1jWZpnAVqkk9ZF1nLPxm1pDbYirZga+8rmzZM4U/Khkf38IiAsXNH+K\\ntM6V79hEXDB4ZcUahO5FRys4CnOsU9HiKoCC0LOmHxg+gyGWWzV47GOHxaOZ0avF\\nBjBVe8h3vFfHkupB7xCdxtDKK58qL2cRPilAojxAerrp1LwMlnqWgtZxpYIA7UXa\\n3A4PKKnWzY/IueDxxvwKUOvchqqvfL6DeTBB0XBziH5DYjfc9dshVri+OykGd1qm\\nXohGUzxYfM4+t/LWhEwe9tW8N+K0PkV1/DnnHYONO63KLDU1CdNfiLu7WiQYoAp8\\nnaQbKiMTAgMBAAECggEAQvRwxgIOVCQe9xj3NtEKPFBz7Vu9uyjb/u/Ez4ZdxCp+\\nnwM4Y5LtXg1oJ/6It3eG97kHlbnQ+aLb6Mm25DkBWcQ1hoQ6hdW1p45BzDbickTE\\niIFJPZfsuIvlnNNtaHHmilnB1CaN3y/43SikThrSVmRu8zMznygKMsTGN+mIZQsS\\nbeceL5lzgTvNP8yjZ6XXd6aJK4c1pcw2+hDDHriYsTLv8supSmCAbyrdXDR6f8ci\\n8q/G2DsZJjmuUrza0fkTfatIivjRz5bK1M+R23bV0dMAPfFBpRI587xyHePD10kq\\n/o0F6KxRuS2X02kLNfoMldOVvZbfiyX7M6yA9joq6QKBgQDwF+cfj8nSo/vZi3Bz\\npMWXtQrEVD87WseX0WscMsE8GpeRSXs48BbpqbkYSISof8X4KhzzjGtKHAZoIBvK\\n..."
// FIREBASE_CLIENT_EMAIL=firebase-adminsdk-aioyu@push-notification-33a33.iam.gserviceaccount.com
// FIREBASE_CLIENT_ID=101396711164378880725
// FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
// FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
// FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
// FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-aioyu%40push-notification-33a33.iam.gserviceaccount.com
// FIREBASE_UNIVERSE_DOMAIN=googleapis.com
