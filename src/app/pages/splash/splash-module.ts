import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SplashComponent } from './splash.component';
import { SplashRoutingModule } from './splash-routing-module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SplashRoutingModule,
  ],
  declarations: [SplashComponent],
})
export class SplashModule {}
