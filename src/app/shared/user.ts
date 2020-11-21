export interface User {
  id: string;
  username: string;
  userRole: 'player' | 'observer' | 'host';
  roomNumber: string;
  connected: boolean;
  messageStatus?: 'notStarted' | 'waiting' | 'sent' | 'approved' | 'disapproved';
}
