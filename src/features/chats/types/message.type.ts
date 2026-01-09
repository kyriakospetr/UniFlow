import { ConversationResponse } from "./conversation.type.js";

type SenderInfo = {
  id: string;
  username: string;
};

export type MessageResponse = {
  id: string;
  content: string;
  createdAt: Date;
  conversationId: string;
  senderId: string;
  sender: SenderInfo; 
};

export type SendMessageResponse = {
  message: MessageResponse;
  conversation: ConversationResponse;
};