import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { MaterialModules } from 'src/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { UploadFMComponent } from './components/upload-fm/upload-fm.component';
import { FMEditorComponent } from './components/fmeditor/fmeditor.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LanguageDownloadComponent } from './components/language-download/language-download.component';
import { LogComponent } from './components/log/log.component';
import { DialogEditRelationNode, FeaturesComponent } from './components/features/features.component';
import { ConstraintsComponent } from './components/constraints/constraints.component';
import { InteropMatrixComponent } from './components/interop-matrix/interop-matrix.component';
import { ConstraintTreeComponent } from './components/constraint-tree/constraint-tree.component';
import { SemanticsMetricsComponent } from './components/semantics-metrics/semantics-metrics.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { NewFeaturesComponent } from './components/new-features/new-features.component';
import { DialogEditMainNode, MainNodeComponent } from './components/new-features/main-node/main-node.component';
import { RelationNodeComponent } from './components/new-features/relation-node/relation-node.component';



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
    SemanticsMetricsComponent,
    DialogEditMainNode,
    DialogEditRelationNode,
    NewFeaturesComponent,
    MainNodeComponent,
    RelationNodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModules,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

