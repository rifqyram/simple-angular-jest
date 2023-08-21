import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input()
  isExpand!: boolean;
  @Output()
  isExpandChange: EventEmitter<boolean> = new EventEmitter();
  @Output()
  isLoggedInChange: EventEmitter<void> = new EventEmitter();

  handleLogout() {
    this.isLoggedInChange.emit();
  }

  handleExpanded() {
    this.isExpand = !this.isExpand;
    this.isExpandChange.emit(this.isExpand)
  }
}
