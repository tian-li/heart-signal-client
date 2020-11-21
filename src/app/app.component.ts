import {Component} from '@angular/core';
import {SocketService} from "./services/socket.service";
import {getUserFromLocalStorage} from "./shared/utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private socketService: SocketService) {
  }

ngOnInit() {
  // const prevUsername = localStorage.getItem('username');
  // const prevUserRole = localStorage.getItem('userRole');
  // const prevRoomNumber = localStorage.getItem('roomNumber');
  //
  // if(!!prevUsername&&!!prevUserRole&&!!prevRoomNumber) {
  //   this.socketService.joinRoom({
  //     username: prevUsername,
  //     userRole: prevUserRole,
  //     roomNumber: prevRoomNumber
  //   });
  // }


  // const localStorageUser = getUserFromLocalStorage();
  //
  // if(!!localStorageUser) {
  //   this.socketService.autoJoin({...localStorageUser});
  // }
}
}
