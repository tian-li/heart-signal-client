import {Injectable} from '@angular/core';
import {SocketService} from './socket.service';
import {Store} from '@ngrx/store';
import {
  listPreviousMessages,
  playerMessageApprovedByHostCommand,
  playerMessageApprovedByHostEvent,
  playerMessageCommand,
  playerMessageDisapprovedByHostCommand,
  playerMessageDisapprovedByHostEvent,
  playerMessageEvent,
  publishPendingMessagesEvent,
  systemMessageApprovedByHostCommand,
  systemMessagedEvent,
  systemMessageDisapprovedByHostCommand
} from '../store/message';
import {PlayerMessage} from '../shared/player-message';
import {SystemMessage} from '../shared/system-message';
import {v4 as uuidv4} from 'uuid';
import {BehaviorSubject} from 'rxjs';


@Injectable()
export class MessageService {

  currentRound$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  canSendPlayerMessage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private socketService: SocketService,
    private store: Store
  ) {

    this.socketService.socket.on('listPreviousMessages', ({messages}) => {
      this.store.dispatch(listPreviousMessages({messages}));
    });

    // 玩家短信
    this.socketService.socket.on('playerMessage', (message) => {
      this.store.dispatch(playerMessageEvent({payload: message}));
    });

    this.socketService.socket.on('playerMessageApprovedByHost', (message) => {
      this.store.dispatch(playerMessageApprovedByHostEvent({payload: message}));
    });

    this.socketService.socket.on('playerMessageDisapprovedByHost', (message) => {
      this.store.dispatch(playerMessageDisapprovedByHostEvent({payload: message}));
    });

    this.socketService.socket.on('publishPendingMessages', (messages) => {
      this.store.dispatch(publishPendingMessagesEvent({payload: messages}));
    });

    // 有人要以玩家加入
    this.socketService.socket.on('attemptToJoinAsPlayer', ({id, username, userRole, roomNumber}) => {
      const message: SystemMessage = {
        id: uuidv4(),
        type: 'systemMessage',
        content: `${username} 想要作为玩家加入游戏`,
        timestamp: new Date().valueOf(),
        actionRequired: true,
        approvalStatus: 'pending',
        payload: {id, username, userRole, roomNumber}
      };

      this.store.dispatch(systemMessagedEvent({payload: message}));
    });

    // 短信轮次
    this.socketService.socket.on('startNewRound', (roundIndex) => {
      this.currentRound$.next(roundIndex);
      this.canSendPlayerMessage$.next(true);
    });

    this.socketService.socket.on('endCurrentRound', () => {
      this.canSendPlayerMessage$.next(false);
    });
  }

  startNewRound() {
    this.socketService.socket.emit(
      'startNewRound',
      {roomNumber: this.socketService.getRoomNumber()}
    );
  }

  endCurrentRound() {
    this.socketService.socket.emit('endCurrentRound', {roomNumber: this.socketService.getRoomNumber()});
  }

  // 玩家消息
  playerSendMessageToHost(message: PlayerMessage) {
    this.socketService.socket.emit('playerMessage', {
      message,
      roomNumber: this.socketService.getRoomNumber(),
    });
    this.store.dispatch(playerMessageCommand({payload: message}));
  }

  hostApprovePlayerMessage(message: PlayerMessage) {
    this.socketService.socket.emit('playerMessageApprovedByHost', {
      message: {...message, approvalStatus: 'approved'},
      roomNumber: this.socketService.getRoomNumber(),
    });
    this.store.dispatch(playerMessageApprovedByHostCommand({payload: message}));

  }

  hostDisapprovePlayerMessage(message: PlayerMessage) {
    this.socketService.socket.emit('playerMessageDisapprovedByHost', {
      message: {...message, approvalStatus: 'disapproved'},
      roomNumber: this.socketService.getRoomNumber(),
    });
    this.store.dispatch(playerMessageDisapprovedByHostCommand({payload: message}));
  }


  // 批准以玩家加入
  approveAttemptToJoinAsPlayer(message: SystemMessage) {
    this.socketService.socket.emit('approveAttemptToJoinAsPlayer', {
      user: message.payload,
      roomNumber: this.socketService.getRoomNumber(),
    });
    this.store.dispatch(systemMessageApprovedByHostCommand({payload: message}));

  }

  disapproveAttemptToJoinAsPlayer(message: SystemMessage) {
    this.socketService.socket.emit('disapproveAttemptToJoinAsPlayer', {
      user: message.payload,
      roomNumber: this.socketService.getRoomNumber(),
    });
    this.store.dispatch(systemMessageApprovedByHostCommand({payload: message}));

  }

  hostPublishAllMessages() {
    this.socketService.socket.emit('publishPendingMessages', this.socketService.getRoomNumber());
  }
}
