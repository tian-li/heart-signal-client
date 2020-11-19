import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
import {User} from '../shared/user';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: socketIo.Socket;
  user: User;
  private _roomNumber: string;
  private _usersInRoom: User[] = [];

  currentRound$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  canSendPlayerMessage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  usersInRoom$: BehaviorSubject<User[]> = new BehaviorSubject([]);

  constructor(private router: Router,
              private snackBar: MatSnackBar) {
    this.setupSocketConnection();
    this.socket.on('disconnect', (user) => {
      this.socket.io.connect();
    });

    this.socket.on('alert', (error) => {
      this.snackBar.open(
        error.message,
        '好的',
        {
          duration: 2000,
        }
      );
    });

    // this.socket.on('newUserJoined', (user) => {
    //   this.addUserToRoom(user);
    // });

    this.socket.on('approveAttemptToJoin', (user) => {
      this.joinRoom(user);
    });

    this.socket.on('disapproveAttemptToJoin', () => {
      this.snackBar.open(
        '主持人拒绝了你的加入请求',
        '好的',
        {
          duration: 2000,
        }
      );
    });

    this.socket.on('joinSuccess', ({user, roomInfo}) => {
      this.user = user;
      this.setRoomNumber(user.roomNumber);
      this.router.navigate(['./room']);

      if (!!roomInfo) {
        this.currentRound$.next(roomInfo.roundIndex);
        this.canSendPlayerMessage$.next(roomInfo.isSendingMessage);
      }
    });

    this.socket.on('listUserInRoom', ({roomNumber, users}) => {
      this.updateUsersInRoom(users);
    });

    // 短信轮次
    this.socket.on('startNewRound', (roundIndex) => {
      this.currentRound$.next(roundIndex);
      this.canSendPlayerMessage$.next(true);
    });

    this.socket.on('endCurrentRound', () => {
      this.canSendPlayerMessage$.next(false);
    });
  }

  addUserToRoom(user: User) {
    this._usersInRoom.push(user);
    this.usersInRoom$.next(this._usersInRoom);
  }

  updateUsersInRoom(users: User[]) {
    this._usersInRoom = users;
    this.usersInRoom$.next(this._usersInRoom);
  }

  joinRoom(user: { userRole: string, roomNumber: string, username?: string }) {
    this.socket.emit('join', user);
  }

  attemptToJoin(user: { userRole: string, roomNumber: string, username?: string }) {
    this.socket.emit('attemptToJoin', {
      id: this.socket.id,
      ...user
    });

    this.snackBar.open(
      '等待主持人批准',
      '好的',
      {
        duration: 2000,
      }
    );
  }

  createRoom({username, roomNumber}) {
    this.socket.emit('create', {
      username,
      roomNumber
    });
  }

  setRoomNumber(roomNumber: string) {
    this._roomNumber = roomNumber;
  }

  getRoomNumber(): string {
    return this._roomNumber;
  }

  setupSocketConnection() {

    if(environment.production) {
      this.socket = socketIo.io();
    } else {
      this.socket = socketIo.io('http://localhost:3000', {
        transports: ['websocket']
      });
    }
  }
}
