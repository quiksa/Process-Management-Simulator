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
                    if (operacao[x] == 'CPU') {
                        cpu++
                        operacao.splice(operacao[x], 1)
                    }
                    if (cpu) {
                        processCPU = {
                            operation: 'CPU',
                            cycle: cpu,
                            status: 'apto'
                        }
                        process.cycle.push(processCPU)
                    }

                    let processES = new Object;
                    let es = 0;
                    if (operacao[x] == 'ES') {
                        es++
                        operacao.splice(operacao[x], 1)
                    }
                    if (es) {
                        processES = {
                            operation: 'ES',
                            cycle: es,
                            status: 'apto'
                        }
                        process.cycle.push(processES)
                    }
                    x++
                }
                this.processList.push(process)
            }
        });
    }
}