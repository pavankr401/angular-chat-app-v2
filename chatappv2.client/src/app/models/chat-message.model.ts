export interface ChatMessage {
  id?: string;          // Optional for new messages
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: Date;     // Backend sends this
  type: MessageType;
}

export enum MessageType {
  Text = 0,
  Image = 1,
  File = 2
}
