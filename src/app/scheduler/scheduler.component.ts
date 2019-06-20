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
  @Input() tempo;

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
      this.execProcessFifo(data.processList)
    } else if (this.operacao == 'sjf') {
      this.execProcessSjf(data.processList);
    } else if (this.operacao == 'rr') {
      if(!this.tempo){
        alert('Selecione o tempo');
        return;
      }
      this.execProcessRr(data.processList);
    }
  }

  execProcessRr(processList: Array<any>){

    let bloqList = new Array<any>(); // Lista para colocar os bloqueados
    let execList = new Array<any>(); // Lista para colocar o processo que está executando
    let ciclos  = 0; // Contar os ciclos
    let countTempo = 1;

    while(processList.length > 0 || execList.length > 0 || bloqList.length > 0){ // Caso as listas estejam vazias terminou os precessos, saí do while
      debugger
      let es = 0; // Contar as ES
      let pid = 0; // Salvar o PID que está sendo executao (usado somente para printar)
      let terminouProcesso = false; // Usado somente para printar se o processo terminou no final do while
      let mandarListaBloq = false; // Caso precise colocar um processo na lista de bloqueado é utilizado essa boolean (é adicionado um processo na lista de bloqueado somente no final do while)
      let cpu = 0; // Contar os CPU
      let pides = 0; // Exibir os ES dos processos expecíficos

      if(processList.length > 0 && execList.length === 0){ // Caso exista processo e a lista de execução está vazia é preciso colocar o próximo processo para excutar
        if(processList[0].cycle[0].operation === 'CPU'){ // se for CPU coloca na lista de execução e remove da lista de processos 
          execList.push(processList[0]); // Adicionando na lista de execuação
          processList.splice(0,1); // Removendo da lista de processos
        }
      }
      if(execList.length > 0){ // Se a lista de execução não está vazia executa o processo
        if(execList[0].cycle[0].operation === 'CPU'){ // Se for CPU executa
          pid = execList[0].pid; // Salva o PID para exibir no final
          execList[0].cycle.splice(0,1); // Executa o CPU  (Remove da lista pois foi executado)
          cpu ++; // Soma os processos
        }
        if(execList[0].cycle[0] === null || execList[0].cycle[0] === undefined || execList[0].cycle[0] === ''){ // Se a lista de execução está vazia o processo terminou
          terminouProcesso = true; // Boolean para exibir no final que o processo terminou
          execList.splice(0,1); // remove da lista de execução (não sei se precisa)
        }else 
        if(execList[0].cycle[0].operation === 'ES'){ // Se ainda existir processo na lista de execução verifica se é ES
          mandarListaBloq = true; // Boolean para indicar que é preciso mandor o processo para a lista de bloqueado
        }
      }

      if(bloqList.length > 0){ // Se a lista de bloqueados não está vazia
        if(bloqList[0].cycle[0].operation === 'ES'){ // Se for ES executa
          pides = bloqList[0].pid; // Salva o PID do processo que fez ES para exibir no final
          bloqList[0].cycle.splice(0,1); // Executa o ES (Remove da lista de bloqueado)
          es ++; // Soma ES para exibir no final
        }
        if(bloqList[0].cycle[0].operation === 'CPU'){ // Se a lista de bloqueado for CPU
          processList.push(bloqList[0]); // Coloca de volta na lista de processos (apto)
          bloqList.splice(0,1); // Remove da lista de bloqueados
        }
        
      }

      if(mandarListaBloq){ // Se precisa adicionar na lista de bloqueado
        bloqList.push(execList[0]); // Coloca processo na lista de bloqueados
        execList.splice(0,1); // Remove processo da lista de execução
        countTempo = 1; // Se mandar pra lista de bloqueados o tempo do RR reinicia
      }

      ciclos++; // Incrementa o ciclo

      // Exibte informações no log para fins de debug
      console.log('CICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PIDES: ' + pides + ' ES: ' + es + ', TEMPO ' + countTempo);
      if(terminouProcesso){
        countTempo = 0; // Se o processo temrinou o tempo do RR reinicia
        cpu = 0;
        console.log('PID: ' + pid + ' PRONTO');
      }

      if(countTempo == this.tempo){ // Se chegar no fim do tempoo do RR é preciso trocar o processo
        processList.push(execList[0]); // Coloca o processo em execução na lista dos processos
        execList.splice(0,1); // Remove o processo atual da lista de execução
        execList.push(processList[0]); // Coloca o próximo processo apto na lista de execução
        processList.splice(0,1); // Remove o processo que foi pra execução da lista de processos
        countTempo = 1; // Tempo do RR volta pro começo
      }else{ // Se não for o tempo igual soma
        countTempo ++;  
      }

    }

  }

  execProcessSjf(processList: Array<any>){
    let bloqList = new Array<any>(); // Lista para colocar os bloqueados
    let execList = new Array<any>(); // Lista para colocar o processo que está executando
    let ciclos  = 0; // Contar os ciclos

    while(processList.length > 0 || execList.length > 0 || bloqList.length > 0){ // Caso as listas estejam vazias terminou os precessos, saí do while
      debugger
      processList = this.ordernarSjf(processList); // Ordena a lista
      let es = 0; // Contar as ES
      let pid = 0; // Salvar o PID que está sendo executao (usado somente para printar)
      let terminouProcesso = false; // Usado somente para printar se o processo terminou no final do while
      let mandarListaBloq = false; // Caso precise colocar um processo na lista de bloqueado é utilizado essa boolean (é adicionado um processo na lista de bloqueado somente no final do while)
      let cpu = 0; // Contar os CPU
      let pides = 0; // Exibir os ES dos processos expecíficos

      if(processList.length > 0 && execList.length === 0){ // Caso exista processo e a lista de execução está vazia é preciso colocar o próximo processo para excutar
        if(processList[0].cycle[0].operation === 'CPU'){ // se for CPU coloca na lista de execução e remove da lista de processos 
          execList.push(processList[0]); // Adicionando na lista de execuação
          processList.splice(0,1); // Removendo da lista de processos
        }
      }
      if(execList.length > 0){ // Se a lista de execução não está vazia executa o processo
        if(execList[0].cycle[0].operation === 'CPU'){ // Se for CPU executa
          pid = execList[0].pid; // Salva o PID para exibir no final
          execList[0].cycle.splice(0,1); // Executa o CPU  (Remove da lista pois foi executado)
          cpu ++; // Soma os processos
        }
        if(execList[0].cycle[0] === null || execList[0].cycle[0] === undefined || execList[0].cycle[0] === ''){ // Se a lista de execução está vazia o processo terminou
          terminouProcesso = true; // Boolean para exibir no final que o processo terminou
          execList.splice(0,1); // remove da lista de execução (não sei se precisa)
        }else 
        if(execList[0].cycle[0].operation === 'ES'){ // Se ainda existir processo na lista de execução verifica se é ES
          mandarListaBloq = true; // Boolean para indicar que é preciso mandor o processo para a lista de bloqueado
        }
      }

      if(bloqList.length > 0){ // Se a lista de bloqueados não está vazia
        if(bloqList[0].cycle[0].operation === 'ES'){ // Se for ES executa
          pides = bloqList[0].pid; // Salva o PID do processo que fez ES para exibir no final
          bloqList[0].cycle.splice(0,1); // Executa o ES (Remove da lista de bloqueado)
          es ++; // Soma ES para exibir no final
        }
        if(bloqList[0].cycle[0].operation === 'CPU'){ // Se a lista de bloqueado for CPU
          processList.push(bloqList[0]); // Coloca de volta na lista de processos (apto)
          bloqList.splice(0,1); // Remove da lista de bloqueados
        }
        
      }

      if(mandarListaBloq){ // Se precisa adicionar na lista de bloqueado
        bloqList.push(execList[0]); // Coloca processo na lista de bloqueados
        execList.splice(0,1); // Remove processo da lista de execução
      }

      ciclos++; // Incrementa o ciclo

      // Exibte informações no log para fins de debug
      console.log('CICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PIDES: ' + pides + ' ES: ' + es);
      if(terminouProcesso){
        cpu = 0;
        console.log('PID: ' + pid + ' PRONTO');
      }

    }
  }

  execProcessFifo(processList: Array<any>) {
    let bloqList = new Array<any>(); // Lista para colocar os bloqueados
    let execList = new Array<any>(); // Lista para colocar o processo que está executando
    let ciclos  = 0; // Contar os ciclos

    while(processList.length > 0 || execList.length > 0 || bloqList.length > 0){ // Caso as listas estejam vazias terminou os precessos, saí do while
      debugger
      let es = 0; // Contar as ES
      let pid = 0; // Salvar o PID que está sendo executao (usado somente para printar)
      let terminouProcesso = false; // Usado somente para printar se o processo terminou no final do while
      let mandarListaBloq = false; // Caso precise colocar um processo na lista de bloqueado é utilizado essa boolean (é adicionado um processo na lista de bloqueado somente no final do while)
      let cpu = 0; // Contar os CPU
      let pides = 0; // Exibir os ES dos processos expecíficos

      if(processList.length > 0 && execList.length === 0){ // Caso exista processo e a lista de execução está vazia é preciso colocar o próximo processo para excutar
        if(processList[0].cycle[0].operation === 'CPU'){ // se for CPU coloca na lista de execução e remove da lista de processos 
          execList.push(processList[0]); // Adicionando na lista de execuação
          processList.splice(0,1); // Removendo da lista de processos
        }
      }
      if(execList.length > 0){ // Se a lista de execução não está vazia executa o processo
        if(execList[0].cycle[0].operation === 'CPU'){ // Se for CPU executa
          pid = execList[0].pid; // Salva o PID para exibir no final
          execList[0].cycle.splice(0,1); // Executa o CPU  (Remove da lista pois foi executado)
          cpu ++; // Soma os processos
        }
        if(execList[0].cycle[0] === null || execList[0].cycle[0] === undefined || execList[0].cycle[0] === ''){ // Se a lista de execução está vazia o processo terminou
          terminouProcesso = true; // Boolean para exibir no final que o processo terminou

          execList.splice(0,1); // remove da lista de execução (não sei se precisa)
        }else 
        if(execList[0].cycle[0].operation === 'ES'){ // Se ainda existir processo na lista de execução verifica se é ES
          mandarListaBloq = true; // Boolean para indicar que é preciso mandor o processo para a lista de bloqueado
        }
      }

      if(bloqList.length > 0){ // Se a lista de bloqueados não está vazia
        if(bloqList[0].cycle[0].operation === 'ES'){ // Se for ES executa
          pides = bloqList[0].pid; // Salva o PID do processo que fez ES para exibir no final
          bloqList[0].cycle.splice(0,1); // Executa o ES (Remove da lista de bloqueado)
          es ++; // Soma ES para exibir no final
        }
        if(bloqList[0].cycle[0].operation === 'CPU'){ // Se a lista de bloqueado for CPU
          processList.push(bloqList[0]); // Coloca de volta na lista de processos (apto)
          bloqList.splice(0,1); // Remove da lista de bloqueados
        }
        
      }

      if(mandarListaBloq){ // Se precisa adicionar na lista de bloqueado
        bloqList.push(execList[0]); // Coloca processo na lista de bloqueados
        execList.splice(0,1); // Remove processo da lista de execução
      }

      ciclos++; // Incrementa o ciclo

      // Exibte informações no log para fins de debug
      console.log('CICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PIDES: ' + pides + ' ES: ' + es);
      if(terminouProcesso){
        cpu = 0;
        console.log('PID: ' + pid + ' PRONTO');
      }

    }

  }

  // Função para adicionar o total dos primeiros CPUS na lista de processo para fins de ordenação
  contarCPU(process: any){

    let totalCPU = 0;

    for (let index = 0; index < process.cycle.length; index++) {
      const element = process.cycle[index];
        if(element.operation === 'CPU'){
          totalCPU ++;
        }else{
          process.totalCPU = totalCPU;
          return process;
        }
    }
    process.totalCPU = totalCPU;
    return process;

  }

  // Função para ordenar a lista de processos
  ordernarSjf(processList: Array<any>){

    let listaOrdenada: Array<any>;
    let maiorCPU = 0;

     processList.forEach((element,index) => {
       processList[index] = this.contarCPU(element);
     });
     
     processList.sort(function(a,b){return a.totalCPU - b.totalCPU});

     return processList;


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
