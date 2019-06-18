import { Component, OnInit, Input } from '@angular/core';
import { ApexChart, ApexTitleSubtitle, ApexAxisChartSeries, ApexNonAxisChartSeries, ApexAnnotations, ApexDataLabels, ApexStroke, ApexLegend, ApexFill, ApexTooltip, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexYAxis, ApexGrid, ApexStates, ApexTheme } from 'ng-apexcharts';

@Component({
  selector: 'app-fcfs',
  templateUrl: './fcfs.component.html',
  styleUrls: ['./fcfs.component.css']
})

export class FcfsComponent implements OnInit {

  @Input() chart: ApexChart;
  @Input() annotations: ApexAnnotations;
  @Input() colors: string[];
  @Input() dataLabels: ApexDataLabels;
  @Input() series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  @Input() stroke: ApexStroke;
  @Input() labels: string[];
  @Input() legend: ApexLegend;
  @Input() fill: ApexFill;
  @Input() tooltip: ApexTooltip;
  @Input() plotOptions: ApexPlotOptions;
  @Input() responsive: ApexResponsive[];
  @Input() xaxis: ApexXAxis;
  @Input() yaxis: ApexYAxis | ApexYAxis[];
  @Input() grid: ApexGrid;
  @Input() states: ApexStates;
  @Input() title: ApexTitleSubtitle;
  @Input() subtitle: ApexTitleSubtitle;
  @Input() theme: ApexTheme;

  @Input() data
  @Input() options;

  constructor() {

  }

  ngOnInit() {

    this.chart = {
      height: 350,
      type: 'bar',
      stacked: true,
    }
    this.plotOptions = {
      bar: {
        horizontal: true,
      },

    }

    this.stroke = {
      width: 1,
      colors: ['#fff']
    }

    this.series = [{
      name: 'Marine Sprite',
      data: [44, 54, 41, 37, 22, 43, 21]
    }, {
      name: 'Striking Calf',
      data: [53, 32, 33, 52, 13, 43, 32]
    }, {
      name: 'Tank Picture',
      data: [12, 17, 11, 9, 15, 11, 20]
    }, {
      name: 'Bucket Slope',
      data: [9, 7, 5, 8, 6, 9, 4]
    }, {
      name: 'Reborn Kid',
      data: [25, 12, 19, 32, 25, 24, 10]
    }]

    this.title = {
      text: 'Fiction Books Sales'
    }

    this.xaxis = {
      categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
      labels: {
        formatter: function (val) {
          return val + "K"
        }
      }
    }

    this.yaxis = {
      title: {
        text: undefined
      },
    }

    this.tooltip = {
      y: {
        formatter: function (val) {
          return val + "K"
        }
      }
    }

    this.fill = {
      opacity: 1

    }

    this.legend = {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    }

    this.data = {
      labels: ['PID1', 'PID2', 'PID3', 'PID4', 'PID5', 'PID6', 'PID7', 'PID1'],
      datasets: [
        {
          label: 'Cycle',
          data: [65, 59, 80, 81, 56, 55, 40, 10],
          fill: true,
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
