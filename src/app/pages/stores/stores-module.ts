import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StoresComponent } from './stores.component';
import { StoresRoutingModule } from './stores-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, StoresRoutingModule],
  declarations: [StoresComponent],
})
export class StoresModule {}
