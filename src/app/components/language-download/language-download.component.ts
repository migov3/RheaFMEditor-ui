import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RestService } from 'src/app/services/rest/rest.service';

@Component({
  selector: 'app-language-download',
  templateUrl: './language-download.component.html',
  styleUrls: ['./language-download.component.css']
})
export class LanguageDownloadComponent implements OnInit {

  @Input() hash?: string;
  @Input() fmName?: string;
  
  languages?: string[];
  extensions?: string[];
  selectedLanguage?: string;

  constructor(private http: RestService) {
  
  }

  ngOnInit(): void {
      this.initializeLanguages();
  }

  initializeLanguages(r?: number) {
    if (!r || r < 3) {
      this.http.getAllowedLanguages().subscribe({
        next: languages => {
          this.languages = languages;
          console.log(languages)
        },
        error: error => {
          this.languages = [];
          this.initializeLanguages((r ? r : 0) + 1);
          console.log(error.message);
        }
      });
    }
  }

  // previo a la descarga hay que hacer un update
  // si se han hecho cambios respecto al FM que se ha subido
  download() {
    const formData: FormData = new FormData();
    formData.append('fm_hash', this.hash!);
    formData.append('fm_format', this.selectedLanguage!);
    console.log(this.selectedLanguage);
    this.http.downloadFM(formData).subscribe({
      next: fm => {
        let file = new Blob([fm], { type: this.selectedLanguage });
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(file);
        if (this.fmName)
          downloadLink.setAttribute('download', this.fmName + "." + this.selectedLanguage);
        console.log(this.fmName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      error: error => {
        console.log(error.message);
      }
    });
  }
}
