import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {

  pid: string;

  @Input() textArea;
  
  constructor(private utilService: UtilsService) { }

  

  ngOnInit() {

  }

  getData() {
    this.pid = this.generatePID();
  }

  //Gera código randômico hexadecimal de 4 dígitos
  getRandon() {
    return ((1 + Math.random()) * 100000 | 0).toString(16).substring(1);
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

  //Junta os códigos randômicos para gerar um id único
  generatePID() {
    var pid = "" + this.getRandon() + this.getRandon();
    pid += "-";
    pid += this.getRandon() + this.getRandon();
    pid += "-";
    pid += this.getRandon();
    return pid;
  }

}
