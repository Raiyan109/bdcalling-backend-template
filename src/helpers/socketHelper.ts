import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';
import { User } from '../app/modules/user/user.model';
import { log } from 'winston';

export const getRecieverSocketId = (recieverId: string): string | undefined => {
  return userSocketMap[recieverId];
};

// Map to track users and their socket IDs
const onlineUsers = new Map();
const userSocketMap: { [key: string]: string } = {};

const socket = (io: Server) => {
  io.on('connection', socket => {
    logger.info(colors.blue('A user connected'));

    const userId = socket.handshake.query.userId as string | undefined;
    if (userId && userId !== 'undefined') {
      userSocketMap[userId] = socket.id;
    }

    // io.emit() is used to send events to all the connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
    // io.emit('testmessage', 'test from socketHelper')
    console.log(userSocketMap, 'userSocketMap');

    // // Handle user login and associate their socket ID
    // socket.on('login', async ({ userId }) => {

    //   try {
    //     const user = await User.findById(userId);
    //     if (user) {
    //       onlineUsers.set(userId, socket.id);
    //       console.log(`${user.email} is online.`);
    //     } else {
    //       console.error('User not found');
    //     }
    //   } catch (err) {
    //     console.error('Error during login:', err);
    //   }
    // });


    // Handle joining a room
    // socket.on('joinRoom', ({ username, room }) => {
    //   socket.join(room); // Join the specified room
    //   logger.info(colors.green(`${username} joined room ${room}`));

    //   // Notify others in the room
    //   socket.to(room).emit('notify', `${username} has joined the room.`);
    // });

    // // Handle sending messages
    // socket.on('sendMessage', ({ message, room }) => {
    //   logger.info(colors.cyan(`Message in room ${room}: ${message}`));

    //   // Broadcast message to the room
    //   socket.emit('recieveMessage', message);
    // });

    //disconnect
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
      if (userId && userId !== 'undefined') {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
      }
    });
  });
};

export const socketHelper = { socket };
