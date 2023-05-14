import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-fm',
  templateUrl: './upload-fm.component.html',
  styleUrls: ['./upload-fm.component.css']
})
export class UploadFMComponent implements OnInit {

  constructor() { }

  selectedFileName: string = '';

  onFileSelected(event: any) {
    const files: FileList = event.target.files; // Obtener los archivos seleccionados
    if (files.length > 0) {
      // Realizar las acciones que desees con los archivos seleccionados
      // Por ejemplo, puedes mostrar información sobre los archivos o cargarlos en un servidor
      console.log(files);
      const file = event.target.files[0];
      this.selectedFileName = file.name;
    }
  }

  onFileInputClick(): void {
    const fileInput = document.getElementById('fileInput');
    fileInput?.click();
  }

  ngOnInit(): void {
  }

}
