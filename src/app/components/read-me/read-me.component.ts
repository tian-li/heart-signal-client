import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-read-me',
  templateUrl: './read-me.component.html',
  styleUrls: ['./read-me.component.scss']
})
export class ReadMeComponent implements OnInit {
  canClose = false;
  countDown = 10;

  constructor() {
  }

  ngOnInit(): void {
    const interval = setInterval(() => {
      this.countDown--;
    }, 1000);

    setTimeout(() => {
      this.canClose = true;
      clearInterval(interval);
    }, this.countDown * 1000);
  }

  ok() {
    localStorage.setItem('hasReadNotice', 'true');
  }
}
