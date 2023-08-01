import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {

    this.olympicService.getOlympics().subscribe(data => {

        this.numberOfJOs = this.olympicService.getNumberOfJOs();
        this.numerOfContries = this.olympicService.getNumberOfCountries();

        this.chartOptions = {
          title: { text: '' },
          series: this.olympicService.getPieChartDatas()
        };
        
      });
    }

}
