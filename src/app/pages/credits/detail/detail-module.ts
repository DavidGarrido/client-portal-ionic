import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DetailComponent } from './detail.component';
import { DetailRoutingModule } from './detail-routing-module';

@NgModule({
  imports: [CommonModule, IonicModule, DetailRoutingModule],
  declarations: [DetailComponent],
})
export class DetailModule {}
