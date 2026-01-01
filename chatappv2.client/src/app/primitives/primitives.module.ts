import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabStripComponent } from './tab-strip/tab-strip.component';
import { PopupComponent } from './popup/popup.component'; // Ensure path is correct

@NgModule({
  declarations: [
    TabStripComponent,
    PopupComponent // Angular CLI should have added this already
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TabStripComponent,
    PopupComponent
  ]
})
export class PrimitivesModule { }
