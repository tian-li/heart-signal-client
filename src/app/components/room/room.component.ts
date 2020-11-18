import {Component, OnInit, ViewChild} from '@angular/core';
import {SocketService} from '../../services/socket.service';
import {User} from '../../shared/user';
import {select, Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {Message} from '../../shared/message';
import {selectAllMessagesByTime} from '../../store/message';
import {FormControl} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {map, tap} from 'rxjs/operators';
import {v4 as uuidv4} from 'uuid';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @ViewChild('scrollViewport') scrollViewport: CdkVirtualScrollViewport;

  messages: Message[];
  usersInRoom: User[];

  messageFormControl;
  toIdControl;
  isFormValid: boolean;

  user: User;
  roomNumber;
  currentRound;
  canSendPlayerMessage;
  disapprovedMessageId;

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
      id: 'M8bmlezxCyL6z5uSAAAf'
    };

    this.messages = [
      {
        id: '09c8d442-ba02-4f9a-8f47-c7ca43b10d87',
        fromId: 'M8bmlezxCyL6z5uSAAAf',
        toId: 'toId',
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
        fromId: 'M8bmlezxCyL6z5uSAAAf',
        toId: 'toId',
        fromName: '1',
        toName: '2',
        content: 'hi 2',
        timestamp: 1605585624931,
        published: false,
        approvalStatus: 'approved',
        type: 'playerMessage',
        roundIndex: 1,
      },
      {
        id: 'asd123123',
        content: '阿里看得见我缺个人北纬科技房东不哦IP参与ISO阿哥，千万人委屈，恩情请问，去恩情，问去，问去，问去，问，且，前二废弃物的请问，，圈请问去',
        timestamp: 1605585624931,
        approvalStatus: 'pending',
        type: 'systemMessage',
        actionRequired: true,
      },
      {
        id: 'vdf234143234',
        fromId: 'KXi8nZ85LQHH7zTnAAB4',
        toId: 'toId',
        fromName: '1',
        toName: '2',
        content: 'hi 2',
        timestamp: 1605585624931,
        published: false,
        approvalStatus: 'approved',
        type: 'playerMessage',
        roundIndex: 2,
      }
    ];

    this.usersInRoom = [
      {
        id: 'toId',
        username: '目标',
        userRole: 'host',
        roomNumber: '123'
      }
    ];
  }

  useRealData() {
    this.user = this.socketService.user;
    this.roomNumber = this.socketService.getRoomNumber();

    this.messageService.currentRound$.subscribe(currentRound => {
      this.currentRound = currentRound;
    });

    this.messageService.canSendPlayerMessage$.subscribe(canSendPlayerMessage => {
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
      if (!!this.scrollViewport) {
        this.scrollViewport.scrollToIndex(this.messages.length - 1);

      }
    });

    this.socketService.usersInRoom$.pipe(
      map(users => {
        return users.filter(user => user.userRole === 'player' && user.id !== this.socketService.user.id);
      })
    ).subscribe((users) => {
      this.usersInRoom = users;
    });
  }

  ngOnInit(): void {

    // this.useMockData();
    this.useRealData();

    this.messageFormControl = new FormControl();
    this.toIdControl = new FormControl();

    combineLatest([
      this.messageFormControl.valueChanges,
      this.toIdControl.valueChanges
    ]).subscribe(([message, toId]) => {
      this.isFormValid = !!message && !!toId;
    });
  }

  disapprove(message: Message) {
    if (message.type === 'playerMessage') {
      this.messageService.hostDisapprovePlayerMessage({...message, approvalStatus: 'disapproved'});
    } else {
      this.messageService.disapproveAttemptToJoinAsPlayer({...message, approvalStatus: 'disapproved'});
    }
  }

  approve(message: Message) {
    if (message.type === 'playerMessage') {
      this.messageService.hostApprovePlayerMessage({...message, approvalStatus: 'approved'});
    } else {
      this.messageService.approveAttemptToJoinAsPlayer({...message, approvalStatus: 'approved'});
    }
  }

  publish() {
    this.messageService.hostPublishAllMessages();
  }

  edit(message) {
    this.messageFormControl.setValue(message.content);
    this.toIdControl.setValue(message.toId);
    this.disapprovedMessageId = message.id;
    this.messageService.canSendPlayerMessage$.next(true);
  }


  sendMessage() {
    const toUser = this.usersInRoom.find(u => u.id === this.toIdControl.value);

    const message: Message = {
      id: this.disapprovedMessageId || uuidv4(),
      fromId: this.socketService.user.id,
      toId: this.toIdControl.value,

      fromName: this.user.username,
      toName: toUser.username,

      content: this.messageFormControl.value,
      timestamp: new Date().valueOf(),
      published: false,
      approvalStatus: 'pending',
      type: 'playerMessage',
      roundIndex: this.currentRound
    };

    this.messageService.playerSendMessageToHost(message);
    this.messageService.canSendPlayerMessage$.next(false);
    this.messageFormControl.reset();
    this.toIdControl.reset();
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

}
