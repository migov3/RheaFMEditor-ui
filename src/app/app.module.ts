import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MaterialModules } from 'src/material.module';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { UploadFMComponent } from './upload-fm/upload-fm.component';
import { FMEditorComponent } from './fmeditor/fmeditor.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LanguageDownloadComponent } from './language-download/language-download.component';
import { LogComponent } from './log/log.component';
import { FeaturesComponent } from './features/features.component';
import { ConstraintsComponent } from './constraints/constraints.component';
import { InteropMatrixComponent } from './interop-matrix/interop-matrix.component';
import { ConstraintTreeComponent } from './constraint-tree/constraint-tree.component';
import { SemanticsMetricsComponent } from './semantics-metrics/semantics-metrics.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    HeaderComponent,
    UploadFMComponent,
    FMEditorComponent,
    PageNotFoundComponent,
    LanguageDownloadComponent,
    LogComponent,
    FeaturesComponent,
    ConstraintsComponent,
    InteropMatrixComponent,
    ConstraintTreeComponent,
    SemanticsMetricsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModules,
    FormsModule,
    NgSelectModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
