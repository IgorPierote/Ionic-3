import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { Carro } from '../../model/carro';
import { HttpErrorResponse } from '@angular/common/http'
import { CarrosServiceProvider } from '../../providers/carros-service/carros-service';
import { NavLifeCycles } from '../../utils/ionic/nav/nav-lifecyclies';
import { EscolhaPage } from '../escolha/escolha';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements NavLifeCycles {

  public carros: Carro[];

  constructor(public _navCtrl: NavController,
    private _loadingCtrl:LoadingController,
    private _alertCtrl: AlertController,
    private _carrosService: CarrosServiceProvider
    ) {}

    ionViewDidLoad(){
      let loading = this._loadingCtrl.create({
        content: 'Aguarde...'
      });

      loading.present();

      this._carrosService.lista().subscribe((carros)=>{
        this.carros = carros;

        loading.dismiss();
      },(error: HttpErrorResponse) =>{
        console.log(error);

        loading.dismiss();

        this._alertCtrl.create({
          title: 'Falha na conexão',
          subTitle: 'Não foi possível carregar a lista de carros. Tente novamente mais tarde',
          buttons: [
            {text: 'Ok'}
          ]
        }).present();
      }
      );
    };

    selectionCar(carro: Carro) {
      console.log(carro);
      this._navCtrl.push(EscolhaPage.name, {
        carroSelecionado: carro
      });
    }
}
