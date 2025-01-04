import mongoose from 'mongoose';
import { IConversation } from './conversation.interface';



const ConversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: [],
    }]
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);