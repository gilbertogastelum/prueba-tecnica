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

  addTipoTaza(tipoTaza:TipoTaza):Observable <any>{
    return this.http
      .post(`${this.endpointUrl}/addTipoTaza`, {
        tipoTaza: tipoTaza,
      });
  }

  editTipoTaza(tipoTaza:TipoTaza):Observable <any>{
    return this.http
      .put(`${this.endpointUrl}/editTipoTaza/${tipoTaza.idTipoTaza}`, {
        tipoTaza: tipoTaza,
      });
  }

  deleteTipoTaza(tipoTaza:TipoTaza):Observable <any>{
    return this.http
      .delete(`${this.endpointUrl}/deleteTipoTaza/${tipoTaza.idTipoTaza}`);
  }
}
