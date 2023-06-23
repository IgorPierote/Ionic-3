import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Carro } from '../../model/carro';
import { HttpClient } from '@angular/common/http'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public carros: Carro[];

  constructor(public navCtrl: NavController, private _http: HttpClient) {
    this._http.get<Carro[]>('http://localhost:8080/api/carro/listaTodos').subscribe((carros)=>{
      this.carros = carros;
    })
  }
}
  /*    this.itemShop = [
      {nome: "Morning Star", preco: 2000, img:"assets/imgs/Morning_Star_-_Simon.png"},
      {nome: "Holy Cross", preco: 1413, img: "assets/imgs/Cross.png"},
      {nome: "Dagger", preco: 7980, img: "assets/imgs/Dagger.png"},
      {nome: "Holy Water", preco: 8971, img: "assets/imgs/Holy_Water.png"},
    ];
  */
