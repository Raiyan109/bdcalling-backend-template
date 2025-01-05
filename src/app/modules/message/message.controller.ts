import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';

import sendResponse from '../../../shared/sendResponse';
import { ClientService } from './message.service';
import { Conversation } from '../conversation/conversation.model';
import { Message } from './message.model';
import { getRecieverSocketId } from '../../../helpers/socketHelper';
import { Server } from 'socket.io';

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { message } = req.body
  const { id: recieverId } = req.params as { id: string };
  const senderId = req.user.id as string;
  //@ts-ignore
  const socketIo = global.io

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, recieverId] }
  })

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, recieverId]
    })
  }

  const newMessage = new Message({
    senderId,
    recieverId,
    message
  })

  if (newMessage) {
    conversation.messages.push(newMessage._id)
  }

  await conversation.save()
  await newMessage.save()

  await Promise.all([conversation.save(), newMessage.save()])

  // SOCKET IO Functionality will go here
  const recieverSocketId = getRecieverSocketId(recieverId)

  if (recieverSocketId) {
    // Used to send events to specific client
    //@ts-ignore
    socketIo.to(recieverSocketId).emit('newMessage', newMessage)
  }

  // const result = await ClientService.getAllUsers(req.query);
  // const user = req.user;
  // console.log(user._id, 'user from message controller');

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Client retrived successfully',
    data: newMessage,
  });
});


const getAllMessages = catchAsync(async (req: Request, res: Response) => {
  // const result = await ClientService.getAllUsers(req.query);
  const user = req.user;
  console.log(user.id, 'user from message controller');

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Client retrived successfully',
    // data: result,
  });
});

export const MessageController = {
  getAllMessages,
  sendMessage
};