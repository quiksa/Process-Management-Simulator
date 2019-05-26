import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {



  constructor() { }

  fileLoad(e) {
    let file: any;
    file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      return fileReader.result
    }
    fileReader.readAsText(file);
  }
}
