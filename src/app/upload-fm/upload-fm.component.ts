import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-fm',
  templateUrl: './upload-fm.component.html',
  styleUrls: ['./upload-fm.component.css']
})
export class UploadFMComponent implements OnInit {

  constructor(
    //TODO Esto deberia estar aparte en un servicio + interceptor/gestor de errores
    public http: HttpClient) { }
  selectedFileName?: string;
  file?: File;
  //TODO La ruta a los endpoints deberian tener una variable de entorno
  urldocuments = "http://127.0.0.1:5000/getExampleFMs";
  urlupload = "http://127.0.0.1:5000/uploadFM";
  fmExamples: string[] = [];

  onFileSelected(event: any) {
    const files: FileList = event.target.files; // Obtener los archivos seleccionados
    if (files.length > 0) {
      // TODO Replantear esto
      console.log(files);
      this.file = event.target.files[0];
      this.selectedFileName = this.file?.name;
    }
  }

  onExampleSelected(event: any) {
    this.selectedFileName = event.value;
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
    formData.append('file', this.file!, this.file!.name); //TODO esto tengo que mirarlo en la parte del servidor ('file'?)
    this.http.post(this.urlupload,formData,{withCredentials:true,responseType:'text'}).subscribe(fmData => {  
      console.log(fmData);
        }
    );
  }

}
