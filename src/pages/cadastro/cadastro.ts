import { Agendamento } from './../../model/agendamento';
import { Component } from '@angular/core';
import { Alert, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Carro } from '../../model/carro';
import { AgendamentosServiceProvider } from '../../providers/agendamentos-service/agendamentos-service';
import { HomePage } from '../home/home';
import { AgendamentoDaoProvider } from '../../providers/agendamento-dao/agendamento-dao';

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {

  public carro: Carro;
  public precoTotal: number;

  public nome: String = '';
  public endereco: String = '';
  public email: String = '';
  public data: String = new Date().toISOString();
  private _alerta: Alert;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _agendamentoService: AgendamentosServiceProvider,
    private _alertCtrl: AlertController,
    private _agendamentoDao: AgendamentoDaoProvider
    ) {
      this.carro = this.navParams.get('carroSelecionado');
      this.precoTotal = this.navParams.get('precoTotal');
  }

  agenda() {

    if(!this.nome || !this.endereco || !this.email){
      this._alertCtrl.create({
        title: 'Preenchimento obrigatório',
        subTitle: 'Preencha todos os campos!',
        buttons: [
          {text: 'Ok'}
        ]
      }).present();
      return
    }

    let agendamento: Agendamento = {
      nomeCliente: this.nome,
      enderecoCliente: this.endereco,
      emailCliente: this.email,
      modeloCarro: this.carro.nome,
      precoTotal: this.precoTotal,
      confirmado: false,
      enviado: false,
      data: this.data
    };

    this._alerta = this._alertCtrl.create({
      title: 'Aviso',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });

    let mensagem = '';

    this._agendamentoDao.ehDuplicado(agendamento).mergeMap(ehDuplicado => {
      if(ehDuplicado){
        throw new Error('Agendamento existente!')
      }
      return this._agendamentoService.agenda(agendamento)
    })
    .mergeMap( (valor) => {
      let observable = this._agendamentoDao.salva(agendamento);
      if(valor instanceof Error) {
        throw valor;
      }

      return observable;
    })
    .finally(
      () => {
        this._alerta.setSubTitle(mensagem);
        this._alerta.present();
      }
    )
    .subscribe(
      () => mensagem = 'Agendamento realizado!',
      (err: Error) => mensagem = err.message
    );
  }



}
