import {Component, OnDestroy, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import { ActivatedRoute, Router } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  olympics$?: Subscription;
  numberOfEntries!: number;
  numberOfMedals!: number;
  numberOfAthletes!: number;
  countryDatas?: Olympic | null |undefined ;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  constructor(private olympicService: OlympicService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    const olympicCountryName = this.route.snapshot.paramMap.get('country');

    this.olympics$ = this.olympicService.getOlympics().subscribe(data => {

      if (this.olympicService.getOlympicsByName(olympicCountryName) !== null) {
        this.countryDatas = this.olympicService.getOlympicsByName(olympicCountryName);
      } else {
        this.router.navigateByUrl('**')
      }

      if (this.countryDatas !== undefined && this.countryDatas !== null) {
        this.numberOfEntries = this.countryDatas?.participations.length;
        this.numberOfMedals = this.olympicService.getTotalMedalsCountry(this.countryDatas);
        this.numberOfAthletes = this.olympicService.getTotalAthletesForCountry(this.countryDatas);
        this.initLineChart();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.olympics$) {
      this.olympics$.unsubscribe();
    }
  }

  initLineChart(): void {

    const datas: number[] = [];
    const categories: string[] = [];

    this.countryDatas?.participations.forEach(participation => {
      datas.push(participation.medalsCount);
      categories.push(participation.year.toString());
    })
    this.chartOptions = {
      colors: ['#956065'],
      title: { text: '' },
      xAxis: {
        title:{ text: 'Dates'},
        categories: categories
      },
      tooltip: {
        backgroundColor: 'rgb(2, 131, 143)',
        borderWidth: 0,
        borderRadius: 10,
        shadow: false,
        style: {
          color: '#F0F0F0',
          textAlign: 'center'
        },
        useHTML: true,
        formatter: function () {
          return '<i class="fas fa-medal"></i><b> ' + this.y + '</b>';
        }
      },
      legend: { enabled: false },
      series: [{
        type: 'line',
        data: datas
      }],
    };

  }

}
