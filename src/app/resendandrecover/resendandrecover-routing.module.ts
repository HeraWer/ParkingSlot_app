import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResendandrecoverPage } from './resendandrecover.page';

const routes: Routes = [
  {
    path: '',
    component: ResendandrecoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResendandrecoverPageRoutingModule {}
