import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FmRepositoryService {
  private apiUrl = 'http://localhost:5000/features';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getFeatures(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addFeature(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, {  withCredentials: true, responseType: 'json', headers: this.getHeaders() });
  }

  deleteFeature(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  verifyFeature(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/verify`, null, { headers: this.getHeaders() });
  }

  downloadFeature(id: number): Observable<Blob> {
    const url = `${this.apiUrl}/${id}/download`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
