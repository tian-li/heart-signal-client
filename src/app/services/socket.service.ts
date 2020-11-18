import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
import {User} from '../shared/user';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: socketIo.Socket;
  user: User;
  private _roomNumber: string;
  private _usersInRoom: User[] = [];

  usersInRoom$: BehaviorSubject<User[]> = new BehaviorSubject([]);

  constructor(private router: Router,
              private snackBar: MatSnackBar) {
    this.setupSocketConnection();
    this.socket.on('disconnect', (user) => {
      this.socket.io.connect();
    });

    this.socket.on('error', (error) => {
      this.snackBar.open(
        error.message,
        '好的',
        {
          duration: 2000,
        }
      );
    });

    this.socket.on('newUserJoined', (user) => {
      this.addUserToRoom(user);
    });

    this.socket.on('approveAttemptToJoinAsPlayer', (user) => {
      this.joinRoom(user);
    });


    this.socket.on('listUserInRoom', ({roomNumber, users}) => {
      this.updateUsersInRoom(users);
      this.setRoomNumber(roomNumber);
      this.user = users.find(u => u.id === this.socket.id);
      this.router.navigate(['./room']);
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
    this.socket.emit('attemptToJoinAsPlayer', {
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
    this.socket = socketIo.io();
  }
}
