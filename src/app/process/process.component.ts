import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '../utils.service';
import { descProc } from '../classes/descProc';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {

  pid: string;

  @Input() operacao
  @Input() textArea;

  constructor(private utilService: UtilsService) { }

  ngOnInit() {

  }

  start() {
    if (!this.textArea) {
      alert('Selecione um arquivo!')
    }
    if (!this.operacao) {
      alert('Selecione o algoritmo!')
    }

    let data = new descProc(this.textArea)
    if (this.operacao == 'fifo') {
      this.execProcess(data.processList)
    } else if (this.operacao == 'ssf') {

    } else if (this.operacao == 'rr') {

    }
  }

  execProcess(processList) {
    debugger
    while (processList.length > 0) {
      let x = 0;
      while (processList[x].cycle) {

      }
      x++
    }
  }

  fileLoad(e) {
    // this.textArea = this.utilService.fileLoad(e)
    let file: any;
    file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      this.textArea = fileReader.result
    }
    fileReader.readAsText(file);
  }

  getStatus(estado) {
    switch (estado) {
      case estado.NOVO:
        return {
          nome: "Novo",
          cor: "preto"
        };
      case estado.PRONTO:
        return {
          nome: "Pronto",
          cor: "azul"
        };
      case estado.EM_EXECUCAO:
        return {
          nome: "Executando",
          cor: "verde"
        };
      case estado.EM_ESPERA:
        return {
          nome: "Esperando",
          cor: "amarelo"
        };
      case estado.ENCERRADO:
        return {
          nome: "Encerrado",
          cor: "vermelho"
        };
    }
  }

}
