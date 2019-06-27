import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {



  constructor() { }


  public execProcessFifo(processList: Array<any>) {
    let data = {
      log: '',
      dp: '',
      context: '',
      ma: ''
    }
    let bloqList = new Array<any>(); // Lista para colocar os bloqueados
    let execList = new Array<any>(); // Lista para colocar o processo que está executando
    let ciclos = 0; // Contar os ciclos
    let cycleList = new Array<any>() // Lista com os ciclos de cada processo
    let trocaContexto = 0;

    while (processList.length > 0 || execList.length > 0 || bloqList.length > 0) { // Caso as listas estejam vazias terminou os precessos, saí do while
      debugger
      let es = 0; // Contar as ES
      let pid = 0; // Salvar o PID que está sendo executado (usado somente para exibir)
      let terminouProcesso = false; // Usado somente para exibir se o processo terminou no final do while
      let mandarListaBloq = false; // Caso precise colocar um processo na lista de bloqueado é utilizado essa boolean (é adicionado um processo na lista de bloqueado somente no final do while)
      let cpu = 0; // Contar os CPU
      let pides = 0; // Exibir os ES dos processos expecíficos

      if (processList.length > 0 && execList.length === 0) { // Caso exista processo e a lista de execução está vazia é preciso colocar o próximo processo para executar
        if (processList[0].cycle[0].operation === 'CPU') { // se for CPU coloca na lista de execução e remove da lista de processos 
          processList[0].status = 'executando' // passa para executando
          if (this.naoAddPidIgualCiclo(cycleList, processList[0])) {
            cycleList.push({
              PID: processList[0].pid,
              cycles: ciclos
            })
          }
          execList.push(processList[0]); // Adicionando na lista de execuação
          processList.splice(0, 1); // Removendo da lista de processos
        }
      }
      if (execList.length > 0) { // Se a lista de execução não está vazia executa o processo
        if (execList[0].cycle[0].operation === 'CPU') { // Se for CPU executa
          pid = execList[0].pid; // Salva o PID para exibir no final
          execList[0].cycle.splice(0, 1); // Executa o CPU  (Remove da lista pois foi executado)
          cpu++; // Soma os processos
        }
        if (execList[0].cycle[0] === null || execList[0].cycle[0] === undefined || execList[0].cycle[0] === '') { // Se a lista de execução está vazia o processo terminou
          terminouProcesso = true; // Boolean para exibir no final que o processo terminou
          trocaContexto++;
          execList.splice(0, 1); // remove da lista de execução (não sei se precisa)
        } else if (execList[0].cycle[0].operation === 'ES') { // Se ainda existir processo na lista de execução verifica se é ES
          mandarListaBloq = true; // Boolean para indicar que é preciso mandar o processo para a lista de bloqueado
        }
      }

      if (bloqList.length > 0) { // Se a lista de bloqueados não está vazia
        if (bloqList[0].cycle[0].operation === 'ES') { // Se for ES executa
          pides = bloqList[0].pid; // Salva o PID do processo que fez ES para exibir no final
          bloqList[0].cycle.splice(0, 1); // Executa o ES (Remove da lista de bloqueado)
          es++; // Soma ES para exibir no final
        }
        if (bloqList[0].cycle[0].operation === 'CPU') { // Se a lista de bloqueado for CPU
          bloqList[0].status = 'apto'
          processList.push(bloqList[0]); // Coloca de volta na lista de processos (aptos)
          bloqList.splice(0, 1); // Remove da lista de bloqueados
        }

      }

      if (mandarListaBloq) { // Se precisa adicionar na lista de bloqueado
        execList[0].status = 'bloqueado'
        trocaContexto++;
        bloqList.push(execList[0]); // Coloca processo na lista de bloqueados
        execList.splice(0, 1); // Remove processo da lista de execução
      }

      ciclos++; // Incrementa o ciclo

      // Exibte informações no log para fins de debug
      console.log('CICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PID-ES: ' + pides + ' ES: ' + es);
      if (data.log) {
        data.log += '\nCICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PID-ES: ' + pides + ' ES: ' + es
      } else {
        data.log += 'CICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PID-ES: ' + pides + ' ES: ' + es
      }
      if (terminouProcesso) {
        cpu = 0;
        console.log('PID: ' + pid + ' PRONTO');
        data.log += '\n\tPID: ' + pid + ' PRONTO'

      }

    }
    data.log += '\n\tTROCAS DE CONTEXTO: ' + (trocaContexto - 1);
    console.log('TROCAS DE CONTEXTO: ' + (trocaContexto - 1));

    data.log += '\n\tTEMPO PARA CADA PROCESSO COMEÇAR: '
    for (let index = 0; index < cycleList.length; index++) {
      data.log += '\n\tPID: ' + cycleList[index].PID + ", TEMPO: " + cycleList[index].cycles

    }
    let media = this.calculaMA(cycleList)
    console.log('MA: ' + media);
    data.log += '\n\tMA: ' + media

    let dp = this.calculaDp(cycleList, media)
    console.log('DP: ' + dp);
    data.log += '\n\tDP: ' + dp

    data.context = (trocaContexto - 1).toString();
    data.dp = dp
    data.ma = (media).toString()

    return data

  }

  public execProcessRr(processList: Array<any>, tempo: number) {
    let data = {
      log: '',
      dp: '',
      context: '',
      ma: ''
    }
    let bloqList = new Array<any>(); // Lista para colocar os bloqueados
    let execList = new Array<any>(); // Lista para colocar o processo que está executando
    let ciclos = 0; // Contar os ciclos
    let countTempo = 1;
    let cycleList = new Array<any>() // Lista com os ciclos de cada processo
    let trocaContexto = 0;

    while (processList.length > 0 || execList.length > 0 || bloqList.length > 0) { // Caso as listas estejam vazias terminou os precessos, saí do while
      let es = 0; // Contar as ES
      let pid = 0; // Salvar o PID que está sendo executao (usado somente para exibir)
      let terminouProcesso = false; // Usado somente para exibir se o processo terminou no final do while
      let mandarListaBloq = false; // Caso precise colocar um processo na lista de bloqueado é utilizado essa boolean (é adicionado um processo na lista de bloqueado somente no final do while)
      let cpu = 0; // Contar os CPU
      let pides = 0; // Exibir os ES dos processos expecíficos

      if (processList.length > 0 && execList.length === 0) { // Caso exista processo e a lista de execução está vazia é preciso colocar o próximo processo para excutar
        if (processList[0].cycle[0].operation === 'CPU') { // se for CPU coloca na lista de execução e remove da lista de processos 
          processList[0].status = 'executando' // passa para executando
          if (this.naoAddPidIgualCiclo(cycleList, processList[0])) {
            cycleList.push({
              PID: processList[0].pid,
              cycles: ciclos
            })
          }
          execList.push(processList[0]); // Adicionando na lista de execuação
          processList.splice(0, 1); // Removendo da lista de processos
        }
      }
      if (execList.length > 0) { // Se a lista de execução não está vazia executa o processo
        if (execList[0].cycle[0].operation === 'CPU') { // Se for CPU executa
          pid = execList[0].pid; // Salva o PID para exibir no final
          execList[0].cycle.splice(0, 1); // Executa o CPU  (Remove da lista pois foi executado)
          cpu++; // Soma os processos
        }
        if (execList[0].cycle[0] === null || execList[0].cycle[0] === undefined || execList[0].cycle[0] === '') { // Se a lista de execução está vazia o processo terminou
          terminouProcesso = true; // Boolean para exibir no final que o processo terminou
          trocaContexto++;
          execList.splice(0, 1); // remove da lista de execução (não sei se precisa)
        } else if (execList[0].cycle[0].operation === 'ES') { // Se ainda existir processo na lista de execução verifica se é ES
          mandarListaBloq = true; // Boolean para indicar que é preciso mandor o processo para a lista de bloqueado
        }
      }

      if (bloqList.length > 0) { // Se a lista de bloqueados não está vazia
        if (bloqList[0].cycle[0].operation === 'ES') { // Se for ES executa
          pides = bloqList[0].pid; // Salva o PID do processo que fez ES para exibir no final
          bloqList[0].cycle.splice(0, 1); // Executa o ES (Remove da lista de bloqueado)
          es++; // Soma ES para exibir no final
        }
        if (bloqList[0].cycle[0].operation === 'CPU') { // Se a lista de bloqueado for CPU
          bloqList[0].status = 'apto'
          processList.push(bloqList[0]); // Coloca de volta na lista de processos (apto)
          bloqList.splice(0, 1); // Remove da lista de bloqueados
        }

      }

      if (mandarListaBloq) { // Se precisa adicionar na lista de bloqueado
        execList[0].status = 'bloqueado'
        trocaContexto++;
        bloqList.push(execList[0]); // Coloca processo na lista de bloqueados
        execList.splice(0, 1); // Remove processo da lista de execução
        countTempo = 1; // Se mandar pra lista de bloqueados o tempo do RR reinicia
      }

      ciclos++; // Incrementa o ciclo

      // Exibte informações no log para fins de debug
      console.log('CICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PID-ES: ' + pides + ' ES: ' + es + ', TEMPO ' + countTempo);
      if (data.log) {
        data.log += '\nCICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PID-ES: ' + pides + ' ES: ' + es + ', TEMPO ' + countTempo
      } else {
        data.log += 'CICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PID-ES: ' + pides + ' ES: ' + es + ', TEMPO ' + countTempo
      }
      if (terminouProcesso) {
        countTempo = 0; // Se o processo temrinou o tempo do RR reinicia
        cpu = 0;
        console.log('PID: ' + pid + ' PRONTO');
        data.log += '\n\tPID: ' + pid + ' PRONTO'

      }

      if (countTempo == tempo) { // Se chegar no fim do tempoo do RR é preciso trocar o processo
        execList[0].status = 'apto'
        //execList[0].context++
        processList.push(execList[0]); // Coloca o processo em execução na lista dos processos
        execList.splice(0, 1); // Remove o processo atual da lista de execução
        processList[0].status = 'executando'
        trocaContexto++;
        execList.push(processList[0]); // Coloca o próximo processo apto na lista de execução
        if (this.naoAddPidIgualCiclo(cycleList, processList[0])) {
          cycleList.push({
            PID: processList[0].pid,
            cycles: ciclos
          })
        }
        processList.splice(0, 1); // Remove o processo que foi pra execução da lista de processos
        countTempo = 1; // Tempo do RR volta pro começo
      } else { // Se não for o tempo igual soma
        countTempo++;
      }
    }
    data.log += '\n\tTROCAS DE CONTEXTO: ' + (trocaContexto);
    console.log('TROCAS DE CONTEXTO: ' + (trocaContexto));

    let media = this.calculaMA(cycleList)
    console.log('MA: ' + media);
    data.log += '\n\tMA: ' + media

    let dp = this.calculaDp(cycleList, media)
    console.log('DP: ' + dp);
    data.log += '\n\tDP: ' + dp

    data.context = (trocaContexto).toString();
    data.dp = dp
    data.ma = (media).toString()

    return data

  }

  public execProcessSjf(processList: Array<any>) {
    let data = {
      log: '',
      dp: '',
      context: '',
      ma: ''
    }
    let bloqList = new Array<any>(); // Lista para colocar os bloqueados
    let execList = new Array<any>(); // Lista para colocar o processo que está executando
    let ciclos = 0; // Contar os ciclos
    let cycleList = new Array<any>() // Lista com os ciclos de cada processo
    let trocaContexto = 0;

    while (processList.length > 0 || execList.length > 0 || bloqList.length > 0) { // Caso as listas estejam vazias terminou os precessos, saí do while

      processList = this.ordernarSjf(processList); // Ordena a lista
      let es = 0; // Contar as ES
      let pid = 0; // Salvar o PID que está sendo executao (usado somente para exibir)
      let terminouProcesso = false; // Usado somente para exibir se o processo terminou no final do while
      let mandarListaBloq = false; // Caso precise colocar um processo na lista de bloqueado é utilizado essa boolean (é adicionado um processo na lista de bloqueado somente no final do while)
      let cpu = 0; // Contar os CPU
      let pides = 0; // Exibir os ES dos processos expecíficos

      if (processList.length > 0 && execList.length === 0) { // Caso exista processo e a lista de execução está vazia é preciso colocar o próximo processo para excutar
        if (processList[0].cycle[0].operation === 'CPU') { // se for CPU coloca na lista de execução e remove da lista de processos 
          processList[0].status = 'executando' // passa para executando
          if (this.naoAddPidIgualCiclo(cycleList, processList[0])) {
            cycleList.push({
              PID: processList[0].pid,
              cycles: ciclos
            })
          }
          execList.push(processList[0]); // Adicionando na lista de execuação
          processList.splice(0, 1); // Removendo da lista de processos
        }
      }
      if (execList.length > 0) { // Se a lista de execução não está vazia executa o processo
        if (execList[0].cycle[0].operation === 'CPU') { // Se for CPU executa
          pid = execList[0].pid; // Salva o PID para exibir no final
          execList[0].cycle.splice(0, 1); // Executa o CPU  (Remove da lista pois foi executado)
          cpu++; // Soma os processos
        }
        if (execList[0].cycle[0] === null || execList[0].cycle[0] === undefined || execList[0].cycle[0] === '') { // Se a lista de execução está vazia o processo terminou
          terminouProcesso = true; // Boolean para exibir no final que o processo terminou
          trocaContexto++;
          execList.splice(0, 1); // remove da lista de execução (não sei se precisa)
        } else if (execList[0].cycle[0].operation === 'ES') { // Se ainda existir processo na lista de execução verifica se é ES
          mandarListaBloq = true; // Boolean para indicar que é preciso mandar o processo para a lista de bloqueado
        }
      }

      if (bloqList.length > 0) { // Se a lista de bloqueados não está vazia
        if (bloqList[0].cycle[0].operation === 'ES') { // Se for ES executa
          pides = bloqList[0].pid; // Salva o PID do processo que fez ES para exibir no final
          bloqList[0].cycle.splice(0, 1); // Executa o ES (Remove da lista de bloqueado)
          es++; // Soma ES para exibir no final
        }
        if (bloqList[0].cycle[0].operation === 'CPU') { // Se a lista de bloqueado for CPU
          bloqList[0].status = 'apto'
          //bloqList[0].context++ // contexto volta para lista de aptos
          processList.push(bloqList[0]); // Coloca de volta na lista de processos (apto)
          bloqList.splice(0, 1); // Remove da lista de bloqueados
        }

      }

      if (mandarListaBloq) { // Se precisa adicionar na lista de bloqueado
        execList[0].status = 'bloqueado'
        trocaContexto++;
        bloqList.push(execList[0]); // Coloca processo na lista de bloqueados
        execList.splice(0, 1); // Remove processo da lista de execução
      }

      ciclos++; // Incrementa o ciclo

      // Exibte informações no log para fins de debug
      console.log('CICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PIDES: ' + pides + ' ES: ' + es);
      if (data.log) {
        data.log += '\nCICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PID-ES: ' + pides + ' ES: ' + es
      } else {
        data.log += 'CICLO: ' + ciclos + ', PID: ' + pid + ', CPU: ' + cpu + ', PID-ES: ' + pides + ' ES: ' + es
      }
      if (terminouProcesso) {
        cpu = 0;
        console.log('PID: ' + pid + ' PRONTO');
        data.log += '\n\tPID: ' + pid + ' PRONTO'

      }

    }
    data.log += '\n\tTROCAS DE CONTEXTO: ' + (trocaContexto);
    console.log('TROCAS DE CONTEXTO: ' + (trocaContexto));

    let media = this.calculaMA(cycleList)
    console.log('MA: ' + media);
    data.log += '\n\tMA: ' + media

    let dp = this.calculaDp(cycleList, media)
    console.log('DP: ' + dp);
    data.log += '\n\tDP: ' + dp

    data.context = (trocaContexto).toString();
    data.dp = dp
    data.ma = (media).toString()

    return data

  }

  // Função para adicionar o total dos primeiros CPUs na lista de processo para fins de ordenação
  private contarCPU(process: any) {

    let totalCPU = 0;

    for (let index = 0; index < process.cycle.length; index++) {
      const element = process.cycle[index];
      if (element.operation === 'CPU') {
        totalCPU++;
      } else {
        process.totalCPU = totalCPU;
        return process;
      }
    }
    process.totalCPU = totalCPU;
    return process;

  }

  // Função para ordenar a lista de processos
  public ordernarSjf(processList: Array<any>) {

    processList.forEach((element, index) => {
      processList[index] = this.contarCPU(element);
    });

    processList.sort(function (a, b) { return a.totalCPU - b.totalCPU });

    return processList;

  }

  private calculaMA(cycleList): number {
    let finalListaCiclos = cycleList.length - 1;
    return cycleList[finalListaCiclos].cycles / cycleList.length
  }

  private calculaDp(cycleList, media): string {
    let valor = 0
    let dp = 0
    for (let index = 0; index < cycleList.length; index++) {
      const data = cycleList[index];
      valor += Math.pow(data.cycles - media, 2)
    }
    dp = Math.sqrt(valor / cycleList.length - 1)
    return dp.toFixed(2)
  }

  private naoAddPidIgualCiclo(cycleList, ciclo): boolean {
    for (let index = 0; index < cycleList.length; index++) {
      if (cycleList[index].PID == ciclo.pid) {
        return false;
      }
    }
    return true;
  }

}
