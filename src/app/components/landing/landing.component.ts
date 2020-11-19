import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SocketService} from '../../services/socket.service';
import {MatDialog} from "@angular/material/dialog";
import {ReadMeComponent} from "../read-me/read-me.component";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  title = 'heart-signal-client';

  form: FormGroup;
  loading = false;

  userTypes = [
    {value: 'player', display: '玩家'},
    {value: 'observer', display: '观众'},
    {value: 'host', display: '主持人'},
  ];

  isHost: boolean;
  isPlayer: boolean;
  isObserver: boolean;

  constructor(
    private socketService: SocketService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.dialog.open(ReadMeComponent, {
      disableClose: true,
    })

    this.form = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      roomNumber: new FormControl('', Validators.required),
      userRole: new FormControl('', Validators.required)
    });

    this.form.get('userRole').valueChanges.subscribe(selectedRole => {
      this.isHost = selectedRole === 'host';
      this.isPlayer = selectedRole === 'player';
      this.isObserver = selectedRole === 'observer';

      if (!this.isHost) {
        this.form.get('username').reset();
      } else {
        this.form.get('username').setValue('other player');
      }
    });

    this.socketService.socket.on('approveAttemptToJoin', () => {
      this.loading = false;
    });

    this.socketService.socket.on('alert', () => {
      this.loading = false;
    });

    this.socketService.socket.on('disapproveAttemptToJoin', () => {
      this.loading = false;
    });

  }

  joinRoom() {
    this.loading = true;
    this.socketService.attemptToJoin({
      username: this.formValue.username,
      userRole: this.formValue.userRole,
      roomNumber: this.formValue.roomNumber,
    });
  }

  createRoom() {
    this.socketService.createRoom({
      username: this.formValue.username,
      roomNumber: this.formValue.roomNumber,
    });
  }

  get formValue() {
    // console.log('form value', this.form.value)
    return this.form.value;
  }

}
