import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RequestLimitIncreaseComponent } from './request.component';
import { RequestLimitIncreaseRoutingModule } from './request-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, RequestLimitIncreaseRoutingModule],
  declarations: [RequestLimitIncreaseComponent],
})
export class RequestLimitIncreaseModule {}
