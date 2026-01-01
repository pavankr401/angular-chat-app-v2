import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab-strip',
  templateUrl: './tab-strip.component.html',
  styleUrls: ['./tab-strip.component.css'],
  standalone: false
})
export class TabStripComponent {
  @Input() tabs: string[] = [];

  @Output() tabSelected = new EventEmitter<number>();

  activeIndex: number = 0;

  selectTab(index: number) {
    this.activeIndex = index;
    this.tabSelected.emit(index);
  }
}
