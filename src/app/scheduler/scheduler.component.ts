import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '../utils.service';
import { descProc } from '../classes/descProc';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {

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
    } else if (this.operacao == 'sjf') {

    } else if (this.operacao == 'rr') {

    }
  }

  execProcess(processList: Array<any>) {
    debugger
    let bloqList = new Array<any>();
    let x = 0;
    let removeListaBloq = null;
    let removeListaProcess = null;
    let exitBloqFor = false;
    for (let index = 0; index < processList.length; index++) {
      const process = processList[index];
      //processList.forEach((process,index) => {
      let numClycles = 0;
      let numEs = 0;
      if (process.status === 'apto') {
        let progamExec = process.pid;

        for (let indexC = 0; indexC < process.cycle.length; indexC++) {
          const cycle = process.cycle[indexC];
          //process.cycle.forEach((cycle, indexC) => {

          if (bloqList.length > 0) {
            for (let indexPB = 0; indexPB < bloqList.length; indexPB++) {
              
              if(exitBloqFor){
                break;
              }

              const bloq = bloqList[indexPB];

              //bloqList.forEach((bloq, indexB) => {
              for (let indexCB = 0; indexCB < bloq.cycle.length; indexCB++) {
                const bloqCycle = bloq.cycle[indexCB];
                
                //});
                let sum = indexCB + 1;
                let sumP = indexPB + 1;
                if (bloq.cycle[sum].operation === 'CPU' && bloq.cycle[sum].status === 'apto') {
                  processList.push(bloqList[indexPB]);
                  removeListaBloq = indexPB;
                }

                if (bloqCycle.operation === 'ES' && bloqCycle.status === 'apto') {
                  //bloq.cycle.forEach(element => {
                  if (bloqCycle.status === 'apto') {
                    bloqCycle.status = 'executado'; // Executou ES
                    numEs++;
                    bloqList.splice(indexPB,1);
                    exitBloqFor = true;
                    break;
                  }
                }

              }
            }
            //});
          }
          exitBloqFor = false;
          //remove da lsita
          if(removeListaBloq){
            bloqList.splice(removeListaBloq,1);
            removeListaBloq = null;
          }

          if (cycle.operation === 'CPU' && cycle.status === 'apto') {
            cycle.status = 'executado'; //executou
            numClycles++;
          }
          let val = indexC + 1;
          if (processList[index].cycle[val].operation === 'ES' && processList[index].cycle[val].status === 'apto') {
            bloqList.push(process);
            processList.splice(index,1);
            index--;
            break;
          }
        }
        //})
        console.log('PID ' + progamExec + ' num Cycles: ' + numClycles + ' num es ' + numEs);
      }
    }
    //})
  }

  fileLoad(e) {
    // this.textArea = this.utilService.fileLoad(e)
    let file: any;
    file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      //console.log(fileReader.result);
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
