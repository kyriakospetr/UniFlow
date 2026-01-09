import { ConversationType } from "../../../../generated/prisma/enums.js";

type ParticipantInfo = {
  id: string;
  username: string;
};

export type ConversationResponse = {
  id: string;
  type: ConversationType;
  name?: string | null;
  lastMessageContent?: string | null; // Πρόσθεσέ το για το preview στο inbox
  lastMessageAt?: Date | null;       // Αυτό αντικαθιστά ή συμπληρώνει το updatedAt
  participants: ParticipantInfo[];
};