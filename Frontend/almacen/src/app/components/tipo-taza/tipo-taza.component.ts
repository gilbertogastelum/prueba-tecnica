import { Component, OnInit, ViewChild } from '@angular/core';
import {TipoTaza} from 'src/app/models/tipo-taza';
import {MatTableDataSource} from '@angular/material/table';
import { TipoTazaService } from 'src/app/services/tipo-taza.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
declare let $: any;

@Component({
  selector: 'app-tipo-taza',
  templateUrl: './tipo-taza.component.html',
  styleUrls: ['./tipo-taza.component.css']
})
export class TipoTazaComponent implements OnInit {
  tipoTazaForm: FormGroup;
  private paginator: MatPaginator;
  private sort: MatSort;
  displayedColumns: string[] = ['idTipoTaza', 'descripcion', 'edit','delete'];
  dataSource_TipoTaza = new MatTableDataSource<any>();

  //SORT PARA LA TABLA DE INVENTARIO
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
      this.sort = ms;
      this.dataSource_TipoTaza.sort = this.sort;
  }

  //PAGINACIÓN PARA LA TABLA DE INVENTARIO
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource_TipoTaza.paginator = this.paginator;
  }

  constructor(
    private tiposTazaService: TipoTazaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTiposTaza();

    this.tipoTazaForm = this.formBuilder.group({
      descripcion: [null,Validators.required]
    });
  }

  async getTiposTaza(){
    await this.tiposTazaService.getTiposTaza().subscribe((
      response=>{
        if(response==null){
          this.toastr.error("No hay registros","Error");
        }else{
          this.dataSource_TipoTaza= response.detalles ;
        }
      }
    ));
  }

  addTipoTaza(){
    let formObj = this.tipoTazaForm.getRawValue();

    this.tiposTazaService.addTipoTaza(formObj).subscribe((
      response=>{
        if (response.mensaje=="OK"){
          this.getTiposTaza();
          this.clearForm();
          $('#modalTipo').modal('hide');
          this.toastr.success(response.detalles,'Correcto')
        }else{
          this.toastr.error(response.mensaje, "Error");
        }
      }
    ));
  }

  openEditar(data: any){
    this.tipoTazaForm = this.formBuilder.group({
      idTipoTaza  : [data.idTipoTaza,[Validators.required]],
      descripcion : [data.descripcion, [Validators.required,]],
    });

  }

  editTipoTaza(){
    let formObj = this.tipoTazaForm.getRawValue();

    this.tiposTazaService.editTipoTaza(formObj).subscribe((
      response=>{
        if (response.mensaje=="OK"){
          this.getTiposTaza();
          this.clearForm();
          $('#modalEditTipoTaza').modal('hide');
          this.toastr.success(response.detalles,'Correcto')
        }else{
          this.toastr.error(response.mensaje, "Error");
        }
      }
    ));

  }

  openEliminar(data: any){
    this.tipoTazaForm = this.formBuilder.group({
      idTipoTaza: [data.idTipoTaza, [Validators.required,]]
    });
  }

  deleteTipoTaza(){
    let formObj = this.tipoTazaForm.getRawValue();

    this.tiposTazaService.deleteTipoTaza(formObj).subscribe((
      response=>{
        if (response.mensaje=="OK"){
          this.getTiposTaza();
          $('#deleteModal').modal('hide');
          this.toastr.info(response.detalles, "Correcto");
        }else{
          this.toastr.error(response.mensaje, "Error");
        }
      }
    ));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource_TipoTaza.filter = filterValue.trim().toLowerCase();
  }

  clearForm(){
    this.tipoTazaForm = this.formBuilder.group({
      descripcion: [null,Validators.required]
    });
  }


}
