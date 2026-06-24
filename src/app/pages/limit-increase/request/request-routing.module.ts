import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestLimitIncreaseComponent } from './request.component';

const routes: Routes = [{ path: '', component: RequestLimitIncreaseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestLimitIncreaseRoutingModule {}
