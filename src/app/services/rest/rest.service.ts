import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ALLOWED_LANGUAGES, CACHEDFM, DOWNLOAD_FM, EXAMPLES_FILENAMES_URL, EXAMPLE_UPLOAD_URL, REFACTORING, UPDATE_URL, UPLOAD_URL } from 'src/app/constants';
import { FeatureModel } from 'src/app/interfaces/FeatureModel';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  env: string = "http://localhost:5000" // Temporal
  
  urldocuments = this.env + EXAMPLES_FILENAMES_URL;
  urluploadExample = this.env + EXAMPLE_UPLOAD_URL;
  urlupload = this.env + UPLOAD_URL;
  urldownload = this.env + DOWNLOAD_FM;
  allowedlanguages = this.env + ALLOWED_LANGUAGES;
  urlupdate = this.env + UPDATE_URL;
  urlrefactor = this.env + REFACTORING;
  urlcachedfm = this.env + CACHEDFM;

  constructor(private http: HttpClient) { }

  getExampleFMFilenames() {
    return this.http.get<string[]>(this.urldocuments);
  }

  getExampleFmInfo(formData: FormData) {
    return this.http.post<FeatureModel>(this.urluploadExample, formData, { withCredentials: true, responseType: 'json' });
  }

  getFmInfo(formData: FormData) {
    return this.http.post<FeatureModel>(this.urlupload, formData, { withCredentials: true, responseType: 'json' });
  }

  downloadFM(formData: FormData) {
    return this.http.post(this.urldownload, formData, { withCredentials: true, responseType: 'text' });
  }

  getAllowedLanguages() {
    return this.http.get<string[]>(this.allowedlanguages);
  }

  updateFM(formData: FormData) {
    return this.http.post<FeatureModel>(this.urlupdate, formData, { withCredentials: true, responseType: 'json' });
  }

  refactor(formData: FormData) {
    return this.http.post<FeatureModel>(this.urlrefactor, formData, { withCredentials: true, responseType: 'json' });
  }

  getCachedFM(formData: FormData) {
    return this.http.post<FeatureModel>(this.urlcachedfm, formData, { withCredentials: true, responseType: 'json' });
  }

}
