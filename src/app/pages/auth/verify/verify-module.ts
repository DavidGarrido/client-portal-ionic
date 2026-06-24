import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerifyComponent } from './verify.component';
import { VerifyRoutingModule } from './verify-routing-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyRoutingModule,
  ],
  declarations: [VerifyComponent],
})
export class VerifyModule {}
