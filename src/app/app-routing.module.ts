import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FMEditorComponent } from './components/fmeditor/fmeditor.component';
import { RepositoryComponent } from './components/repository/repository.component';

const routes: Routes = [
  { path: 'fm-editor', component: FMEditorComponent },
  { path: 'repository', component: RepositoryComponent },
  { path: '', redirectTo: 'fm-editor', pathMatch: 'full'},
  { path: '**', redirectTo: 'fm-editor'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
