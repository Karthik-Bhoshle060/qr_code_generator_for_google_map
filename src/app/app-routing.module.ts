import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateQrCodeComponent } from './components/generate-qr-code/generate-qr-code.component';

const routes: Routes = [
  { path: 'generate-qr-code', component: GenerateQrCodeComponent },
  { path: '', redirectTo: 'generate-qr-code', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
