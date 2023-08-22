import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import * as Highcharts from 'highcharts';
import {SeriesOptionsType} from 'highcharts';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/Olympic";

/**
 * Home Component
 *
 * @Description:
 * The Home component is the entry point of the application, serving as the default landing page.
 * It introduces the user to the context of the application and provides a visual representation
 * of the Olympic medals count per country, aggregated over all years.
 *
 * @Features:
 * - Automatically fetches and displays a graphical representation of the total medals count for each country.
 * - Allows users to interact with the chart: Clicking on a country within the chart will
 *   navigate the user to a detailed page specific to that country, offering more in-depth
 *   information and statistics.
 *
 * @author Jérémy Mulet
 */

@Component({
    selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    olympics$?: Subscription;
    pageInfos: { label: string, value: number }[] = [];
    pageTitle: string = "Medals per Country";
    highcharts: typeof Highcharts = Highcharts;
    chartOptions!: Highcharts.Options;

    constructor(private olympicService: OlympicService, private router: Router) {}

    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics().subscribe(data => {
            if (data.length != 0) {
                this.pageInfos.push({label: "Number of JOs", value: this.olympicService.getNumberOfJOs()})
                this.pageInfos.push({label: "Number of countries", value: this.olympicService.getNumberOfCountries()})
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
        const data: { name: string; y: number; }[] = [];

        olympics.forEach((olympic, index) => {
            data.push({name: olympic.country, y: this.olympicService.getTotalMedalsForACountry(olympic)})
        });
        series.push({data: data, type: 'pie'});

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
