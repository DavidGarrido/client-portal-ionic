import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing-module';

@NgModule({
  imports: [CommonModule, IonicModule, ProfileRoutingModule],
  declarations: [ProfileComponent],
})
export class ProfileModule {}
