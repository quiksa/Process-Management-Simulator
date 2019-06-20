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
      return
    }
    if (!this.operacao) {
      alert('Selecione o algoritmo!')
      return
    }

    let data = new descProc(this.textArea)
    if (this.operacao == 'fifo') {
      this.utilService.execProcessFifo(data.processList)
    } else if (this.operacao == 'sjf') {
      this.utilService.execProcessSjf(data.processList);
    } else if (this.operacao == 'rr') {
      if (!this.tempo) {
        alert('Selecione o tempo');
        return;
      }
      this.utilService.execProcessRr(data.processList, this.tempo);
    }
  }

  fileLoad(e) {
    let file: any;
    file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      //console.log(fileReader.result);
      this.textArea = fileReader.result
    }
    fileReader.readAsText(file);
  }

}
