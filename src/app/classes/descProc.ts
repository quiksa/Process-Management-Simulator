export class Process {
    pid: number;
    status: string;
    priority: number;
    start_time: number;
    end_time: number;
    time_spent: number;
    context: number;
    cycle: Array<Object>;
    submit_time: number;
}

export class descProc {

    public processList: Array<Process>;

    constructor(private dataset: any) {
        // separa a lista de processos para ser utilizada posteriormente  
        this.processList = new Array<Process>();
        let data = dataset.split('\n');
        data.forEach(element => {
            if (element != "") {
                let process = new Process();
                let array = element.split(':')
                process.pid = array[0]
                process.status = 'apto'
                process.cycle = new Array<Object>()
                let operacao = array[1].split(';')
                while (operacao.length > 0) {
                    let x = 0;
                    let processCPU = new Object;
                    let cpu = 0;
                    while (operacao[x] == 'CPU') {
                        //console.log(operacao[x])
                        cpu++
                        operacao.splice(operacao[x], 1)
                    }
                    if (cpu) {
                        processCPU = {
                            operation: 'CPU',
                            cicly: cpu
                        }
                        //processCPU.set('CPU', cpu)
                        process.cycle.push(processCPU)
                    }

                    let processES = new Object;
                    let es = 0;
                    while (operacao[x] == 'ES') {
                        //console.log(operacao[x])
                        es++
                        operacao.splice(operacao[x], 1)
                    }
                    if (es) {
                        processES = {
                            operation: 'ES',
                            cicly: es
                        }
                        //processES.set('ES', es)
                        process.cycle.push(processES)
                    }
                    x++
                }
                this.processList.push(process)
            }
        });
    }
}