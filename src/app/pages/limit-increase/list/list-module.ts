import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LimitIncreaseListComponent } from './list.component';
import { LimitIncreaseListRoutingModule } from './list-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, LimitIncreaseListRoutingModule],
  declarations: [LimitIncreaseListComponent],
})
export class LimitIncreaseListModule {}
