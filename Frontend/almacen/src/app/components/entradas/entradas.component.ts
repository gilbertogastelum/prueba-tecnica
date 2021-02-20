import { Component, OnInit, ViewChild } from '@angular/core';
import {Inventario} from 'src/app/models/inventario';
import { EntradaService } from 'src/app/services/entrada.service';
import {MatTableDataSource} from '@angular/material/table';
import {InventarioService} from 'src/app/services/inventario.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';

declare let $: any;

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css']
})
export class EntradasComponent implements OnInit {
  entradaForm: FormGroup;

  private paginator: MatPaginator;
  private sort: MatSort;
  inventario: Inventario[];//PARA MOSTRAR TODOS LOS PRODUCTOS DEL INVENTARIO
  productoSeleccionado:any;//PARA OBTENER EL PRODUCTO SELECCIONADO EN LA ENTRADA DE ALMACÉN
  cantidadEntrada:number;//PARA OBTENER LA CANTIDAD DE ENTRADA DEL PRODUCO DE ALMACÉM

  displayedColumns: string[] = ['idEntrada', 'descripcion', 'idProducto', 'fechaEntrada', 'cantidad'];
  dataSource_Entradas = new MatTableDataSource<any>();

   //SORT PARA LA TABLA DE INVENTARIO
   @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource_Entradas.sort = this.sort;
}

//PAGINACIÓN PARA LA TABLA DE INVENTARIO
@ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
  this.paginator = mp;
  this.dataSource_Entradas.paginator = this.paginator;
}
constructor(
  private inventarioService:InventarioService,
  private entradaService:EntradaService,
  private formBuilder: FormBuilder,
  private toastr: ToastrService
) { }

  ngOnInit(): void {
    this.getEntradas();
    this.getInventario();

    this.entradaForm = this.formBuilder.group({
      descripcion : [null,],
      idProducto  : [null, Validators.required],
      fechaEntrada : [null, Validators.required],
      cantidad    : [null, Validators.required]
    });
  }

  async getInventario(){
    await this.inventarioService.getInventariCompleto().subscribe((
      response=>{
        if(response==null){
          this.toastr.error("No hay registros", "Error");
        }else{
          this.inventario=response.detalles as Inventario[];
        }
      }
    ));
  }

  async getEntradas(){
    await this.entradaService.getEntradas().subscribe((
      response=>{
        if(response==null){
          this.toastr.error("No hay registros", "Error");
        }else{
          this.dataSource_Entradas.data=response.detalles;
        }
      }
    ));
  }

  addEntrada(){
    let formObj = this.entradaForm.getRawValue();

    this.entradaService.addEntrada(formObj).subscribe((
      response=>{
        if (response.mensaje=="OK"){
          this.getEntradas();
          this.getInventario();
          this.entradaForm.reset();
          $('#modalEntrada').modal('hide');
          this.toastr.success(response.detalles,'Correcto')
        }else{
          this.toastr.error(response.mensaje, "Error");
        }
      }
    ));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource_Entradas.filter = filterValue.trim().toLowerCase();
  }

  clearForm(){
    this.entradaForm.reset();
  }

}
