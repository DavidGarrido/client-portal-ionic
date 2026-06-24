import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AmortizationComponent } from './amortization.component';
import { AmortizationRoutingModule } from './amortization-routing-module';

@NgModule({
  imports: [CommonModule, IonicModule, AmortizationRoutingModule],
  declarations: [AmortizationComponent],
})
export class AmortizationModule {}
