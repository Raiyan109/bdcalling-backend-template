// import { INotification } from '../app/modules/notification/notification.interface';
// import { Notification } from '../app/modules/notification/notification.model';
// import { USER_ROLES } from '../enums/user';

// export const sendNotifications = async (data: any): Promise<INotification> => {
//   const result = await Notification.create(data);

//   //@ts-ignore
//   const socketIo = global.io;

//   if (
//     data?.type === USER_ROLES.ADMIN ||
//     data?.type === USER_ROLES.CLIENT ||
//     data?.type === USER_ROLES.DRIVER
//   ) {
//     // Emit based on the user role
//     socketIo.emit(`get-notification::${data?.type}`, result);
//   } else {
//     // Emit based on the receiver
//     socketIo.emit(`get-notification::${data?.receiver}`, result);
//   }

//   return result;
// };
