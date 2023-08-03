import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import * as Highcharts from 'highcharts';
import {SeriesOptionsType} from 'highcharts';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/Olympic";

@Component({
  selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  olympics$?: Subscription;
  pageInfos: { name: string, data: number }[] = [];
  pageTitle: string = "Medals per Country";

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  constructor(private olympicService: OlympicService, private router: Router) {
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().subscribe(data => {
      if (data.length != 0) {
        this.pageInfos.push({name: "Number of JOs", data: this.olympicService.getNumberOfJOs()})
        this.pageInfos.push({name: "Number of countries", data: this.olympicService.getNumberOfCountries()})
      }
      this.initPieChart(data);
    });
  }

  ngOnDestroy(): void {
    if (this.olympics$) {
      this.olympics$.unsubscribe();
    }
  }

  initPieChart(olympics: Olympic[]): void {
    let series: SeriesOptionsType[] = [];
    const datas: { name: string; y: number; }[] = [];

    olympics.forEach((olympic, index) => {
      datas.push({name: olympic.country, y: this.olympicService.getTotalMedalsForACountry(olympic)})
    });
    series.push({data: datas, type: 'pie'});

    this.chartOptions = {
      colors: ['#956065', '#793d52', '#8aa1db', '#9780a1', '#bee0f1', '#b9cbe7'],
      title: {text: ''},
      tooltip: {
        backgroundColor: 'rgb(2, 131, 143)',
        borderWidth: 0,
        borderRadius: 10,
        shadow: false, style: {
          color: '#F0F0F0', textAlign: 'center'
        },
        useHTML: true, formatter: function () {
          return this.point.name + '<br/><i class="fas fa-medal"></i><b> ' + this.y + '</b>';
        }
      },
      plotOptions: {
        pie: {
          point: {
            events: {
              click: (event) => {
                this.onClickPie(event.point.name);
              }
            }
          }
        }
      }, series: series
    };
  }

  onClickPie(country: string): void {
    this.router.navigateByUrl(`detail/${country}`);
  }

}
