export interface SystemMessage {
  id: string;
  type: 'systemMessage';
  content: string;
  timestamp: number;
  actionRequired: boolean;
  approvalStatus: 'approved' | 'disapproved' | 'pending',
  payload?: any
}
