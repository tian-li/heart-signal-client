import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-read-me',
  templateUrl: './read-me.component.html',
  styleUrls: ['./read-me.component.scss']
})
export class ReadMeComponent implements OnInit {
  canClose = false;

  constructor() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.canClose = true;
    }, 20000);
  }
}
