import { ChatMessage } from "./chat-message.model";
import { User } from "./user.model";

export interface Conversation {
  id: string; // Guid
  isGroup: boolean;
  groupName?: string;

  // The raw participants list
  participants: User[];

  // Optional: We might not load full history in the list for performance, 
  // but the model supports it.
  messages: ChatMessage[];

  lastActivity: Date;
  lastMessagePreview: string;
  lastMessageSenderId?: string;
}
