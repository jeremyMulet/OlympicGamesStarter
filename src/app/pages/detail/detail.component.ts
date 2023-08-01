import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ActivatedRoute } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public numberOfEntries!: number;
  public numberOfMedals!: number;
  public numberOfAthletes!: number;
  public countryDatas?: Olympic | null |undefined ;
  
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    
    const olympicCountryName = this.route.snapshot.paramMap.get('country');

    this.olympicService.getOlympics().subscribe(data => {

      if (this.olympicService.getOlympicsByName(olympicCountryName) !== undefined) {
        this.countryDatas = this.olympicService.getOlympicsByName(olympicCountryName);
      }

      if (this.countryDatas !== undefined && this.countryDatas !== null) {
        this.numberOfEntries = this.countryDatas?.participations.length;
        this.numberOfMedals = this.olympicService.getTotalMedalsCountry(this.countryDatas);
        this.numberOfAthletes = this.olympicService.getTotalAthletesForCountry(this.countryDatas);
        this.getLineChartDatas();
      }
    });
  }

  getLineChartDatas(): void {
    
    let series: { data: number[]; type: string; }[] = [];
    const datas: number[] = [];
    const categories: string[] = [];

    this.countryDatas?.participations.forEach(participation => {
      datas.push(participation.medalsCount);
      categories.push(participation.year.toString());
    })
    series.push({data: datas, type:'line' });
    this.chartOptions = {
      title: {
        text: '',
      },
      yAxis: {
          title: {
              text: 'Medals'
          }
      },
      xAxis: {
        categories: categories
      },
      legend: {
        enabled: false
      },
      series: [{
        type: 'line',
        data: datas
      }],
    };

  }

}
