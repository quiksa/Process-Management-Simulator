import { Component, OnInit, Input, Output } from '@angular/core';
import { UtilsService } from '../utils.service';
import { descProc } from '../classes/descProc';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {

  @Input() operacao
  @Input() textArea;
  @Input() logdata
  @Input() tempo;
  @Input() media;
  @Input() dp;
  @Input() context;

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
      let res = this.utilService.execProcessFifo(data.processList)
      this.logdata = res.log
      this.context = res.context
      this.dp = res.dp
      this.media = res.ma
    } else if (this.operacao == 'sjf') {
      let res = this.utilService.execProcessSjf(data.processList)
      this.logdata = res.log
      this.context = res.context
      this.dp = res.dp
      this.media = res.ma
    } else if (this.operacao == 'rr') {
      if (!this.tempo) {
        alert('Selecione o tempo!');
        return;
      }
      let res = this.utilService.execProcessRr(data.processList, this.tempo);
      this.logdata = res.log
      this.context = res.context
      this.dp = res.dp
      this.media = res.ma
    }
  }

  fileLoad(e) {
    let file: any;
    file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.textArea = fileReader.result
    }
    fileReader.readAsText(file);
  }

}
