import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LimitIncreaseListComponent } from './list.component';

const routes: Routes = [{ path: '', component: LimitIncreaseListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LimitIncreaseListRoutingModule {}
