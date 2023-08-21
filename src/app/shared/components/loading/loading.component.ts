import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() width: number = 24;
  @Input() height: number = 24;

  constructor() { }

  ngOnInit(): void {
  }

}
