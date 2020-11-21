import {Component, OnInit, ViewChild} from '@angular/core';
import {SocketService} from '../../services/socket.service';
import {User} from '../../shared/user';
import {select, Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {Message} from '../../shared/message';
import {selectAllMessagesByTime} from '../../store/message';
import {FormControl} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {map} from 'rxjs/operators';
import {v4 as uuidv4} from 'uuid';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {PlayerMessage} from "../../shared/player-message";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @ViewChild('scrollViewport') scrollViewport: CdkVirtualScrollViewport;

  messages: Message[] = [];
  usersInRoom: User[] = [];
  playersInRoom: User[] = [];
  observersInRoom: User[] = [];
  otherPlayers: User[] = [];
  playerDisplayedColumns = ['username', 'connected', 'messageStatus'];
  observersDisplayedColumns = ['username', 'connected'];
  socket;

  messageFormControl;
  toUserControl;
  extraMessageUserControl;
  isFormValid: boolean;

  user: User;
  roomNumber;
  currentRound;
  canSendPlayerMessage;
  disapprovedMessageId;

  userRoleDisplay = '';

  usersNotSendMessage = [];

  hasPendingApprovalMessage;

  constructor(
    private socketService: SocketService,
    private messageService: MessageService,
    private store: Store
  ) {
  }

  useMockData() {
    this.user = {
      username: '1',
      userRole: 'host',
      roomNumber: '1',
      id: 'M8bmlezxCyL6z5uSAAAf',
      connected: true,
    };

    this.messages = [
      {
        id: '09c8d442-ba02-4f9a-8f47-c7ca43b10d87',
        fromName: '1',
        toName: '2',
        content: 'hi 2',
        timestamp: 1605585624931,
        published: false,
        approvalStatus: 'disapproved',
        type: 'playerMessage',
        roundIndex: 1,
      },
      {
        id: '09c8d442-ba02-4f9a-8f47-c7ca43b10d87',
        fromName: '1',
        toName: '2',
        content: 'hi 2',
        timestamp: 1605585624931,
        published: false,
        approvalStatus: 'approved',
        type: 'playerMessage',
        roundIndex: 2,
      },

      {
        id: 'vdf234143234',
        fromName: '1',
        toName: '2',
        content: 'hi 2',
        timestamp: 1605585624931,
        published: false,
        approvalStatus: 'approved',
        type: 'playerMessage',
        roundIndex: 3,
      },
      {
        id: 'asd123123',
        content: '阿里看得见我缺个人北纬科技房东不哦IP参与ISO阿哥，千万人委屈，恩情请问，去恩情，问去，问去，问去，问，且，前二废弃物的请问，，圈请问去',
        timestamp: 1605585624931,
        approvalStatus: 'pending',
        type: 'systemMessage',
        actionRequired: true,
      },
    ];

    this.observersInRoom = [
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },
      {
        id: 'toId',
        username: '目标',
        userRole: 'observer',
        roomNumber: '123',
        connected: true,
      },

    ];

    this.playersInRoom = this.observersInRoom;
  }

  useRealData() {
    this.user = this.socketService.user;

    if (this.user.userRole === 'player') {
      this.userRoleDisplay = '玩家'
    }

    if (this.user.userRole === 'observer') {
      this.userRoleDisplay = '观众'
    }

    this.roomNumber = this.socketService.getRoomNumber();

    this.socketService.currentRound$.subscribe(currentRound => {
      this.currentRound = currentRound;
    });

    this.socketService.canSendPlayerMessage$.subscribe(canSendPlayerMessage => {
      this.canSendPlayerMessage = canSendPlayerMessage;
    });

    this.store.pipe(
      select(selectAllMessagesByTime),
      map(messages => {
        if (this.user.userRole === 'host') {
          return messages;
        } else {
          return messages.filter(message => message.type === 'playerMessage');
        }
      }),
    ).subscribe((messages) => {
      this.messages = messages;

      this.hasPendingApprovalMessage = this.messages.some(m => m.approvalStatus === 'pending');

      if (this.canSendPlayerMessage) {
        this.findUsersNotSendMessage();
      }


    });

    this.socketService.usersInRoom$.subscribe((users) => {
      this.usersInRoom = users;
      this.observersInRoom = users.filter(user => user.userRole === 'observer');
      this.playersInRoom = users.filter(user => user.userRole === 'player');
      this.otherPlayers = this.playersInRoom.filter(user => user.username !== this.user.username);
    });
  }

  findUsersNotSendMessage() {
    this.usersNotSendMessage = [];
    const usersSentMessage = this.messages.filter((m: Message) => {
      return m.type === 'playerMessage' && m.roundIndex === this.currentRound
    }).map((m: PlayerMessage) => {
      return m.fromName
    });

    this.playersInRoom.forEach(p => {
      if (!usersSentMessage.find(u => u === p.username)) {
        this.usersNotSendMessage.push(p.username)
      }
    });
  }

  ngOnInit(): void {
    this.socket = this.socketService.socket;

    // this.useMockData();
    this.useRealData();

    this.messageFormControl = new FormControl();
    this.toUserControl = new FormControl();
    this.extraMessageUserControl = new FormControl();

    combineLatest([
      this.messageFormControl.valueChanges,
      this.toUserControl.valueChanges
    ]).subscribe(([message, toId]) => {
      this.isFormValid = !!message && !!toId;
    });
  }

  disapprove(message: Message) {
    if (message.type === 'playerMessage') {
      this.messageService.hostDisapprovePlayerMessage({...message, approvalStatus: 'disapproved'});
    } else {
      this.messageService.disapproveAttemptToJoin({...message, approvalStatus: 'disapproved'});
    }
  }

  approve(message: Message) {
    if (message.type === 'playerMessage') {
      this.messageService.hostApprovePlayerMessage({...message, approvalStatus: 'approved'});
    } else {
      this.messageService.approveAttemptToJoin({...message, approvalStatus: 'approved'});
    }
  }

  publish() {
    this.messageService.hostPublishAllMessages();
  }

  edit(message) {
    this.messageFormControl.setValue(message.content);
    this.toUserControl.setValue(message.toName);
    this.disapprovedMessageId = message.id;
    // this.socketService.canSendPlayerMessage$.next(true);
  }


  sendMessage() {
    const toUser = this.usersInRoom.find(u => u.username === this.toUserControl.value);

    const message: Message = {
      id: this.disapprovedMessageId || uuidv4(),

      fromName: this.user.username,
      toName: toUser.username,

      content: this.messageFormControl.value.trim(),
      timestamp: new Date().valueOf(),
      published: false,
      approvalStatus: 'pending',
      type: 'playerMessage',
      roundIndex: this.currentRound
    };

    this.messageService.playerSendMessageToHost(message);
    this.socketService.canSendPlayerMessage$.next(false);
    this.messageFormControl.reset();
    this.toUserControl.reset();
    this.disapprovedMessageId = undefined;
  }

  startNewRound() {
    this.messageService.startNewRound();
  }

  endCurrentRound() {
    this.messageService.endCurrentRound();
  }

  trackByFn(index: number, item): number {
    return item.id;
  }

  checkOnline() {
    this.socketService.socket.emit('sendAlert', ({message: '检查在线'}));
  }

  messageStatusDisplay(messageStatus: string) {
    switch (messageStatus) {
      case 'notStarted':
        return '未开始';
      case 'waiting':
        return '未发送';
      case 'sent':
        return '待审核';
      case 'approved':
        return '已通过';
      case 'disapproved':
        return '已拒绝';

    }
  }

  giveExtraMessage() {
    this.socketService.socket.emit('extraMessage', {
      username: this.extraMessageUserControl.value,
      roomNumber: this.roomNumber
    });
  }

}
