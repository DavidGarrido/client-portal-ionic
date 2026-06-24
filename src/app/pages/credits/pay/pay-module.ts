import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PayComponent } from './pay.component';
import { PayRoutingModule } from './pay-routing-module';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, PayRoutingModule],
  declarations: [PayComponent],
})
export class PayModule {}
