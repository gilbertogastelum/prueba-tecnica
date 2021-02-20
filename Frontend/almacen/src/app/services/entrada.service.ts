import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entrada } from '../models/entrada';
import { HttpOptionsService } from './http-options.service';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {
  private endpointUrl = environment.apiUrl + '/entrada';

  constructor(
    private http: HttpClient,
    private httpOptions: HttpOptionsService
  ) { }

  getEntradas(): Observable<any> {
    return this.http.get(`${this.endpointUrl}/getEntradas`,);
  }

  addEntrada(entrada:Entrada):Observable <any>{
    return this.http
      .post(`${this.endpointUrl}/addEntrada`, {
        entrada: entrada,
      });
  }

}
