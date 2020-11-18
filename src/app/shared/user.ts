export interface User {
  id: string;
  username: string;
  userRole: 'player' | 'observer' | 'host';
  roomNumber: string;
}
