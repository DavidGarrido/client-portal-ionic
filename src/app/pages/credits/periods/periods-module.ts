import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PeriodsComponent } from './periods.component';
import { PeriodsRoutingModule } from './periods-routing-module';

@NgModule({
  imports: [CommonModule, IonicModule, PeriodsRoutingModule],
  declarations: [PeriodsComponent],
})
export class PeriodsModule {}
