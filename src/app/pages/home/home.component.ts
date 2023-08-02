import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import * as Highcharts from 'highcharts';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/Olympic";
import {SeriesOptionsType} from "highcharts";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  olympics$?: Subscription;
  numberOfJOs!: number;
  numberOfCountries!: number;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  constructor(private olympicService: OlympicService, private router: Router) {
  }

  ngOnDestroy(): void {
    if (this.olympics$) {
      this.olympics$.unsubscribe();
    }
  }

  ngOnInit(): void {

    this.olympics$ = this.olympicService.getOlympics().subscribe(data => {
      this.numberOfJOs = this.olympicService.getNumberOfJOs();
      this.numberOfCountries = this.olympicService.getNumberOfCountries();
      this.initPieChart(data);
    });
  }

  initPieChart(olympics: Olympic[]): void {
    let series: SeriesOptionsType[] = [];
    const datas: { name: string; y: number; }[] = [];

    olympics.forEach( (olympic, index) => {
      datas.push({name:olympic.country, y:this.olympicService.getTotalMedalsCountry(olympic)})
    });
    series.push({data: datas, type:'pie' });

    this.chartOptions = {
      title: {text: ''},
      tooltip: {
        useHTML: true,
        formatter: function () {
          return this.point.name + '<i class="material-icons">&#xE5A7;</i><br/> Medals: <b>' + this.y + '</b>';
        }
      }, plotOptions: {
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
