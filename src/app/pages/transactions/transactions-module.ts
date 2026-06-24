import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TransactionsComponent } from './transactions.component';
import { TransactionsRoutingModule } from './transactions-routing-module';

@NgModule({
  imports: [CommonModule, IonicModule, TransactionsRoutingModule],
  declarations: [TransactionsComponent],
})
export class TransactionsModule {}
