export interface PlayerMessage {
  id: string;

  fromName: string;
  toName: string;

  timestamp: number;
  type: 'playerMessage';

  content: string;
  approvalStatus: 'approved' | 'disapproved' | 'pending';
  published: boolean;

  roundIndex: number;
}
