import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  standalone: false
})
export class PopupComponent {
  @Input() title: string = 'Popup';
  @Output() closed = new EventEmitter<void>();

  isMaximized: boolean = false;

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
  }

  close() {
    this.closed.emit();
  }
}
