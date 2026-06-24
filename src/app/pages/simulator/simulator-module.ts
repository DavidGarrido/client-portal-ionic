import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SimulatorComponent } from './simulator.component';
import { SimulatorRoutingModule } from './simulator-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, SimulatorRoutingModule],
  declarations: [SimulatorComponent],
})
export class SimulatorModule {}
