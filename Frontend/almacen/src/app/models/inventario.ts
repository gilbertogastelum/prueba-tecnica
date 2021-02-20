import { TipoTaza } from "./tipo-taza";

export interface Inventario {
  idProducto?:number;
  descripcion:string;
  tipoTaza:number;
  color:string;
  altura:number;
  ancho:number;
  capacidad:number;
  modelo:string;
  material:string;
  stock:number;
}
