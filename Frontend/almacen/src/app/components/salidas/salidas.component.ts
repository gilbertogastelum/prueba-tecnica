import { Component, OnInit, ViewChild } from '@angular/core';
import {Inventario} from 'src/app/models/inventario';
import {SalidaService} from 'src/app/services/salida.service';
import {MatTableDataSource} from '@angular/material/table';
import {InventarioService} from 'src/app/services/inventario.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
declare let $: any;

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.css']
})
export class SalidasComponent implements OnInit {
  salidaMayor:Boolean=false; //PARA OBTENER SI LA CANTIDAD DE SALIDA ES MAYOR AL SOTCK DISPONIBLE
  salidaForm!: FormGroup;

  private paginator!: MatPaginator;
  private sort!: MatSort;
  inventario: Inventario[];//PARA MOSTRAR TODOS LOS PRODUCTOS DEL INVENTARIO
  productoSeleccionado:any;//PARA OBTENER EL PRODUCTO SELECCIONADO EN LA SALIDA DE ALMACÉN
  cantidadSalida:number;//PARA OBTENER LA CANTIDAD DE SALIDA DEL PRODUCO DE ALMACÉM

  displayedColumns: string[] = ['idSalida', 'descripcion', 'idProducto', 'fechaSalida', 'cantidad'];
  dataSource_Salidas = new MatTableDataSource<any>();

  //SORT PARA LA TABLA DE INVENTARIO
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
      this.sort = ms;
      this.dataSource_Salidas.sort = this.sort;
  }

  //PAGINACIÓN PARA LA TABLA DE INVENTARIO
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource_Salidas.paginator = this.paginator;
  }

  constructor(
    private inventarioService:InventarioService,
    private salidaService:SalidaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getSalidas();
    this.getInventario()

    this.salidaForm = this.formBuilder.group({
      descripcion : [null,],
      idProducto  : [null, Validators.required],
      idTipoTaza  : [null],
      fechaSalida : [null, Validators.required],
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

  async getSalidas(){
    await this.salidaService.getSalidas().subscribe((
      response=>{
        if(response==null){
          this.toastr.error("No hay registros", "Error");
        }else{
          this.dataSource_Salidas.data=response.detalles;
        }
      }
    ));
  }

  addSalida(){
    this.salidaMayor=false;
    let sotckActual:number=0;
    let tipoTaza:number=0;

    //OBTENER EL SOTCK DEL PRODUCTO QUE SELECCIONAMOS
    for (let entry of this.inventario) {
      if (entry.idProducto==this.productoSeleccionado){
        sotckActual=entry.stock;
        tipoTaza=entry.tipoTaza;
      }
    }

    //COMPROBAMOS QUE EL CANTIDAD QUE SE DESEA SACAR NO SEA MAYOR AL STOCK DISPONIBLE
    if(this.cantidadSalida>sotckActual){
      this.salidaMayor=true;
    }

    //SI LA SALIDA NO ES MAYOR AL STOCK ACTUAL DEL PRODUCTO PROCEDEMOS A REGISTRAR LA SALIDA DE ALMACÉN
    if(!this.salidaMayor){
      this.salidaForm.patchValue({
        idTipoTaza: tipoTaza,
        // formControlName2: myValue2 (can be omitted)
      });
      let formObj = this.salidaForm.getRawValue();
      this.salidaService.addSalida(formObj).subscribe((
        response=>{
          if (response.mensaje=="OK"){
            this.getSalidas();
            this.getInventario();
            this.salidaForm.reset();
            $('#modalSalida').modal('hide');
            this.toastr.success(response.detalles,'Correcto')
          }else{
            this.toastr.error(response.mensaje, "Error");
          }
        }
      ));
      //SI LA SALIDA FUE MAYOR MANDAMOS UN MENSAJE DE ERROR
    }else{
      this.toastr.error("La salida no puede ser mayor a la cantidad de stock actual","Error")
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource_Salidas.filter = filterValue.trim().toLowerCase();
  }

  clearForm(){
    this.salidaForm.reset();
  }

}
