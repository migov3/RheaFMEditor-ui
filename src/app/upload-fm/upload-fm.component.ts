import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-upload-fm',
  templateUrl: './upload-fm.component.html',
  styleUrls: ['./upload-fm.component.css']
})
export class UploadFMComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef | undefined;

  constructor(
    //TODO Esto deberia estar aparte en un servicio + interceptor/gestor de errores
    public http: HttpClient) { }

  // Archivo ejemplo
  selectedOption?: string;

  // Archivo introducido por el usuario
  selectedFileName?: string;
  file?: File;

  //TODO La ruta a los endpoints deberian tener una variable de entorno
  env: string = "http://127.0.0.1:5000/"
  urldocuments = this.env + "/getExampleFMs";
  urluploadExample = this.env + "/uploadExampleFM";
  urlupload = this.env + "/uploadFM";

  fmExamples: string[] = [];

  onFileSelected(event: any): void {
    const inputElement = event.target as HTMLInputElement;
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
    this.http.get(this.urldocuments).subscribe(fmExamples => {
      for (const fm of (fmExamples as string[])) {
        this.fmExamples.push(fm);
      }
    });
  }

  loadFeatures(): void {
    //TODO Deberia llamar a un servicio que obtenga toda la info del FM
    const formData: FormData = new FormData();
    let upload: string = this.urlupload;
    if (this.selectedOption) { // Subimos el ejemplo
      upload = this.urluploadExample;
      formData.append('filename', this.selectedOption);
    } 
    else { // Deberia existir siempre un archivo cargado
      formData.append('file', this.file!, this.file!.name); //TODO esto tengo que mirarlo en la parte del servidor ('file'?)
    }
    this.http.post(upload, formData, { withCredentials: true, responseType: 'text' }).subscribe(fmData => {
      console.log(fmData);
    });
  }
}
