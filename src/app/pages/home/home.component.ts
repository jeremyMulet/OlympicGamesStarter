import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public olympics$: Observable<any> = of(null);
  public numberOfJOs! : number;
  public numerOfContries!: number;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options; 

  constructor(private olympicService: OlympicService, private router:Router) {}

  ngOnInit(): void {

    this.olympicService.getOlympics().subscribe(data => {

        this.numberOfJOs = this.olympicService.getNumberOfJOs();
        this.numerOfContries = this.olympicService.getNumberOfCountries();

        this.chartOptions = {
          title: { text: '' },
          tooltip: { formatter: function () {
              return this.point.name +'<br/> Medals: <b>' + this.y + '</b>';
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
          },
          series: this.olympicService.getPieChartDatas()
        };
        
      });
    }

    onClickPie(country: string): void {
      this.router.navigateByUrl(`detail/${country}`);
    }

}
