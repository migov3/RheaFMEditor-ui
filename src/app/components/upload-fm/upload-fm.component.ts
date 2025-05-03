import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';
import { RestService } from 'src/app/services/rest/rest.service';
import { UpdateService } from 'src/app/services/update/update.service';
import { AddFeatureModelDialog } from '../repository/repository.component';

@Component({
  selector: 'app-upload-fm',
  templateUrl: './upload-fm.component.html',
  styleUrls: ['./upload-fm.component.css']
})
export class UploadFMComponent implements OnInit {

  // Mientras se estan cargando los archivos se deshabilitan botones
  // El resto de módulos quedan a la espera -> Pasar al padre y gestionar
  @Output() uploading = new EventEmitter<Object>();

  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef | undefined;

  // Pasa los datos del FM recibidos de la llamada al endpoint de /uploadFM o /uploadExampleFM
  @Output() fm = new EventEmitter<FeatureModel>();

  disable = false;

  constructor(public dialog: MatDialog,
    public http: RestService, private updateService: UpdateService) { }

  // Archivo ejemplo
  selectedOption?: string;

  // Archivo introducido por el usuario
  selectedFileName?: string;
  file?: File;

  fmExamples: string[] = [];

  onFileSelected(event: any): void {
    const files: FileList = event.target.files; // Obtener los archivos seleccionados
    if (files.length > 0) {
      // TODO Replantear esto
      //console.log(files[0]);
      this.file = event.target.files[0];
      this.selectedFileName = this.file?.name;
      // Deseleccionamos el posible ejemplo
      this.selectedOption = undefined;
    }
  }

  onExampleSelected(event: any): void {
    this.selectedFileName = event.value;
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  onFileInputClick(): void {
    const fileInput = document.getElementById('fileInput');
    fileInput?.click();
  }

  successfulUpload(fmData: FeatureModel) {
    this.updateService.addHash(fmData.hash);
    this.fm.emit(fmData);
    this.disable = false;
    this.uploading.emit(this.disable);
    this.updateService.lastAction.next({name: "upload", success: true, payload: fmData.name});
  }

  ngOnInit(): void {
    this.http.getExampleFMFilenames().subscribe(fmExamples => {
      for (const fm of (fmExamples as string[])) {
        this.fmExamples.push(fm);
      }
      const formData: FormData = new FormData();
      this.disable = true;
      this.uploading.emit(this.disable);
      formData.append('filename', fmExamples[0]);
      this.http.getExampleFmInfo(formData).subscribe({ // Como ejemplo inicial
        next: (fmData: FeatureModel) => {
          this.successfulUpload(fmData);
        },
        error: (error: any) => {
          this.disable = false;
          this.uploading.emit(this.disable);
          this.updateService.lastAction.next({name: "upload", success: false, payload: error});
        }
    });
  });
    
  }

  loadFeatures(): void {
    const formData: FormData = new FormData();
    this.disable = true;
    this.uploading.emit(this.disable);
    if (this.selectedOption) { // Se ha seleccionado un ejemplo
      formData.append('filename', this.selectedOption);
      this.http.getExampleFmInfo(formData).subscribe({
        next: (fmData: FeatureModel) => {
          this.successfulUpload(fmData);
        },
        error: (error: any) => {
          this.disable = false;
          this.uploading.emit(this.disable);
          this.updateService.lastAction.next({name: "upload", success: false, payload: error});
        }
      });
    } else { // Se ha subido un archivo
      if (!this.file) {
        throw new Error('A file must be loaded.'); // Lanza un error si no hay archivos cargados
      }
      formData.append('file', this.file, this.file.name);
      this.http.getFmInfo(formData).subscribe({
        next: (fmData: FeatureModel) => {
          //console.log(fmData);
          this.successfulUpload(fmData);
        }, 
        error: (error: any) => {
          console.log(error);
          this.disable = false;
          this.uploading.emit(this.disable);
          this.updateService.lastAction.next({name: "upload", success: false, payload: error});
      }
    });
    }
  }

  sendToRepo() {
    
  }
}
