import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inventario } from '../models/inventario';
import { HttpOptionsService } from './http-options.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private endpointUrl = environment.apiUrl + '/inventario';

  constructor(
    private http: HttpClient,
    private httpOptions: HttpOptionsService
  ) { }

  getInventario(): Observable<any> {
    return this.http.get(`${this.endpointUrl}/getProductos`,);
  }

  getInventariCompleto(): Observable<any> {
    return this.http.get(`${this.endpointUrl}/getInventario`,);
  }

  addProducto(producto:Inventario):Observable <any>{
    return this.http
      .post(`${this.endpointUrl}/addProducto`, {
        producto: producto,
      });
  }

  editProducto(producto:Inventario):Observable <any>{
    return this.http
      .put(`${this.endpointUrl}/editProducto/${producto.idProducto}`, {
        producto: producto,
      });
  }

  deleteProducto(producto:Inventario):Observable <any>{
    return this.http
      .delete(`${this.endpointUrl}/deleteProducto/${producto.idProducto}`);
  }
}
