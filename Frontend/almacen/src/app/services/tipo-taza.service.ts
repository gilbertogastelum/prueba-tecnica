import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoTaza } from '../models/tipo-taza';
import { HttpOptionsService } from './http-options.service';

@Injectable({
  providedIn: 'root'
})
export class TipoTazaService {

  private endpointUrl = environment.apiUrl + '/tipoTaza';

  constructor(
    private http: HttpClient,
    private httpOptions: HttpOptionsService
  ) { }

  getTiposTaza(): Observable<any> {
    return this.http.get(`${this.endpointUrl}/getTipos`,);
  }
}
