import { Component, OnInit, ViewChild } from '@angular/core';
import {TipoTaza} from 'src/app/models/tipo-taza';
import {InventarioService} from 'src/app/services/inventario.service';
import {MatTableDataSource} from '@angular/material/table';
import { TipoTazaService } from 'src/app/services/tipo-taza.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
declare let $: any;

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class InventarioComponent implements OnInit {
  inventarioForm: FormGroup;
  selectedRow:any;//PARA OBTENER DATOS DE LA FILA SELECCIONADA A MODIFICAR O ELIMINAR
  selectedTipo:any;//GUARDAR EL TIPO DE TAZA PARA MOSTRARLA EN EL FORM
  stock:number;//PARA MOSTRAR EL STOCK DEL PRODUCTO, NO MODIFICABLE DESDE DE ESTE MÓDULO
  private paginator: MatPaginator;
  private sort: MatSort;
  tipoTaza: TipoTaza[]=[];
  displayedColumns: string[] = ['descripcion', 'tipoTaza', 'color', 'altura', 'ancho', 'capacidad', 'modelo', 'material', 'stock', 'edit','delete'];
  dataSource_Inventario = new MatTableDataSource<any>();

  //SORT PARA LA TABLA DE INVENTARIO
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
      this.sort = ms;
      this.dataSource_Inventario.sort = this.sort;
  }

  //PAGINACIÓN PARA LA TABLA DE INVENTARIO
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource_Inventario.paginator = this.paginator;
  }

  constructor(
    private inventarioService:InventarioService,
    private tiposTazaService: TipoTazaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getInventario();
    this.getTiposTaza();
    this.inventarioForm = this.formBuilder.group({
      descripcion : [null,],
      tipoTaza    : [null, Validators.required],
      color       : ['#000000', Validators.required],
      altura      : [null, Validators.required],
      ancho       : [null, Validators.required],
      capacidad   : [null, Validators.required],
      modelo      : [null, Validators.required],
      material    : [null, Validators.required],
      stock       : [0, Validators.required]
    });
    this.inventarioForm.controls['stock'].disable()
  }

  async getInventario(){
    await this.inventarioService.getInventario().subscribe((
      response=>{
        if(response==null){
          this.toastr.error("No hay registros", "Error");
        }else{
          this.dataSource_Inventario.data=response.detalles;
        }
      }
    ));
  }

  getTiposTaza(){
    this.tiposTazaService.getTiposTaza().subscribe((
      response=>{
        if(response==null){
          this.toastr.error("No existen tipos de tazas","Error")
        }else{
          this.tipoTaza= response.detalles as TipoTaza[];
        }
      }
    ));
  }

  addProducto(){
    let formObj = this.inventarioForm.getRawValue();

    this.inventarioService.addProducto(formObj).subscribe((
      response=>{
        if (response.mensaje=="OK"){
          this.getInventario();
          this.clearForm();
          $('#modalProducto').modal('hide');
          this.toastr.success(response.detalles,'Correcto')
        }else{
          this.toastr.error(response.mensaje, "Error");
        }
      }
    ));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource_Inventario.filter = filterValue.trim().toLowerCase();
  }


  openEditar(data: any) {
    for (let entry of this.tipoTaza) {
      if (entry.descripcion==data.tipoTaza){
        this.selectedTipo=entry.idTipoTaza;
      }
    }

    this.inventarioForm.controls['stock'].disable()
    this.inventarioForm = this.formBuilder.group({
      idProducto  : [data.idProducto, [Validators.required,]],
      descripcion : [data.descripcion, [Validators.required,]],
      tipoTaza    : [this.selectedTipo, Validators.required],
      color       : [data.color, Validators.required],
      altura      : [data.altura, Validators.required],
      ancho       : [data.ancho, Validators.required],
      capacidad   : [data.capacidad, Validators.required],
      modelo      : [data.modelo, Validators.required],
      material    : [data.material, Validators.required],
      stock       : [data.stock, Validators.required,]
    });
  }

  editProdcuto(){
    let formObj = this.inventarioForm.getRawValue();

    this.inventarioService.editProducto(formObj).subscribe((
      response=>{
        if (response.mensaje=="OK"){
          this.getInventario();
          this.clearForm();
          $('#modalEditProducto').modal('hide');
          this.toastr.success(response.detalles,'Correcto')
        }else{
          this.toastr.error(response.mensaje, "Error");
        }
      }
    ));
  }

  openEliminar(data: any) {
    this.inventarioForm = this.formBuilder.group({
      idProducto: [data.idProducto, [Validators.required,]]
    });
  }

  async deleteProducto(){
    let formObj = this.inventarioForm.getRawValue();

    this.inventarioService.deleteProducto(formObj).subscribe((
      response=>{
        if (response.mensaje=="OK"){
          this.getInventario();
          $('#deleteModal').modal('hide');
          this.toastr.info(response.detalles, "Correcto");
        }else{
          this.toastr.error(response.mensaje, "Error");
        }
      }
    ));
  }

  clearForm(){
    this.inventarioForm = this.formBuilder.group({
      descripcion : [null,],
      tipoTaza    : [null, Validators.required],
      color       : ['#000000', Validators.required],
      altura      : [null, Validators.required],
      ancho       : [null, Validators.required],
      capacidad   : [null, Validators.required],
      modelo      : [null, Validators.required],
      material    : [null, Validators.required],
      stock       : [0, Validators.required]
    });
    this.inventarioForm.controls['stock'].disable()
  }
}
