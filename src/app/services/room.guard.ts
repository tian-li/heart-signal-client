import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {SocketService} from './socket.service';
import {of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RoomGuard implements CanActivate {
  constructor(private socketService:SocketService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot,
  ) {
    if(!!this.socketService.user) {
      return true;
    } else {
      return this.router.parseUrl('/landing');
    }

  }
}
