import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FMEditorComponent } from './components/fmeditor/fmeditor.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'fm-editor', component: FMEditorComponent },
  { path: '', redirectTo: 'fm-editor', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent } // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
