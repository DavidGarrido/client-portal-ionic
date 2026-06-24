import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing-module';

@NgModule({
  imports: [CommonModule, IonicModule, DashboardRoutingModule],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
