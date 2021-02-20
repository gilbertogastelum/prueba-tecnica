import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Salida } from '../models/salida';
import { HttpOptionsService } from './http-options.service';

@Injectable({
  providedIn: 'root'
})
export class SalidaService {
  private endpointUrl = environment.apiUrl + '/salida';

  constructor(
    private http: HttpClient,
    private httpOptions: HttpOptionsService
  ) { }

  getSalidas(): Observable<any> {
    return this.http.get(`${this.endpointUrl}/getSalidas`,);
  }

  addSalida(salida:Salida):Observable <any>{
    return this.http
      .post(`${this.endpointUrl}/addSalida`, {
        salida: salida,
      });
  }
}
