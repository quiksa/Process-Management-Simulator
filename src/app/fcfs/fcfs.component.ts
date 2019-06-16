import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fcfs',
  templateUrl: './fcfs.component.html',
  styleUrls: ['./fcfs.component.css']
})

export class FcfsComponent implements OnInit {

  @Input() data
  @Input() options;

  constructor() {

  }

  ngOnInit() {
    this.data = {
      labels: ['PID1', 'PID2', 'PID3', 'PID4', 'PID5', 'PID6', 'PID7', 'PID1'],
      datasets: [
        {
          label: 'Ciclys',
          data: [65, 59, 80, 81, 56, 55, 40, 10],
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
          ],
          borderWidth: 1,
        },
      ],
    },

      this.options = {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
  }



}
