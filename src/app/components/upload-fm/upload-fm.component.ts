import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Component({
  selector: 'app-upload-fm',
  templateUrl: './upload-fm.component.html',
  styleUrls: ['./upload-fm.component.css']
})
export class UploadFMComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef | undefined;

  // Pasa los datos del FM recibidos de la llamada al endpoint de /uploadFM o /uploadExampleFM
  @Output() fmDataEvent = new EventEmitter<Object>();

  // Mientras se estan cargando los archivos se deshabilitan botones
  // El resto de módulos quedan a la espera -> Pasar al padre y gestionar
  @Output() uploading = new EventEmitter<Object>();

  disable = false;

  constructor(
    //TODO Esto deberia estar aparte en un servicio + interceptor/gestor de errores
    public http: RestService) { }

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
      console.log(files[0]);
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

  ngOnInit(): void {
    //TODO Esto es temporal deberia estar en un servicio
    this.http.getExampleFMFilenames().subscribe(fmExamples => {
      for (const fm of (fmExamples as string[])) {
        this.fmExamples.push(fm);
      }
    });
  }

  loadFeatures(): void {
    const formData: FormData = new FormData();
    this.disable = true;
    this.uploading.emit(this.disable);
    if (this.selectedOption) {
      formData.append('filename', this.selectedOption);
      this.http.getExampleFmInfo(formData).subscribe({
        next: fmData => {
          this.fmDataEvent.emit(fmData);
          this.disable = false;
          this.uploading.emit(this.disable);
        },
        error: error => {
          this.disable = false;
          this.uploading.emit(this.disable);
        } 
      });
    } else {
      if (!this.file) {
        throw new Error('A file must be loaded.'); // Lanza un error si no hay archivos cargados
      }
      formData.append('file', this.file, this.file.name);
      this.http.getFmInfo(formData).subscribe({
        next: fmData => {
          console.log(fmData);
          this.fmDataEvent.emit(fmData);
          this.disable = false;
          this.uploading.emit(this.disable);
        },
        error: ignored => {
          this.disable = false;
          this.uploading.emit(this.disable);
      }});
    }
  }
}
