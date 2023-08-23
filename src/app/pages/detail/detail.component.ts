import {Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {ActivatedRoute, Router} from '@angular/router';
import {Olympic} from 'src/app/core/models/Olympic';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {ErrorService} from "../../core/services/ErrorService.service";
import {filter, find, map, Observable, take} from "rxjs";

/**
 * Detail Component
 *
 * Description:
 * The Detail component provides in-depth insights and statistics about a selected country's
 * participation in the Olympic Games.
 *
 * Features:
 * - Automatically fetches and displays detailed statistics specific to the country selected
 *   by the user from the Home component.
 * - Presents the following country-specific data:
 *   - Total number of Olympic Games participations.
 *   - Aggregate count of medals won across all Olympic Games.
 *   - Total number of athletes the country has presented in the Olympic Games.
 * - Incorporates a graphical representation to visualize
 *   the distribution of medals won by the country across different Olympic Games editions.
 *
 * @author Jérémy Mulet
 */

@Component({
    selector: 'app-detail', templateUrl: './detail.component.html', styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    pageInfos: { label: string, value: number }[] = [];
    countryData!: Olympic;
    highcharts: typeof Highcharts = Highcharts;
    chartOptions!: Highcharts.Options;
    isChartDisplayable = false;
    requestedCountry: string | null = this.route.snapshot.paramMap.get('country');

    constructor(private olympicService: OlympicService,
                private router: Router,
                private route: ActivatedRoute,
                private errorService: ErrorService) {}

    ngOnInit(): void {
       this.olympicService.getOlympicById(this.requestedCountry).pipe(take(1)).subscribe(
            {
                next: value => {
                    if (value) {
                        this.countryData = value;
                        this.initHeader();
                        this.initLineChart();
                    } else {
                        this.errorService.setNotFoundErrorMessage("We cannot found information for the chosen country");
                        this.router.navigateByUrl('**');
                    }
                }
            }
        )

    }

    initLineChart(): void {
        this.isChartDisplayable = true;
        const data: number[] = [];
        const categories: string[] = [];

        this.countryData.participations.forEach(participation => {
            data.push(participation.medalsCount);
            categories.push(participation.year.toString());
        })

        this.chartOptions = {
            colors: ['#956065'],
            title: {text: ''},
            xAxis: {
                title: {text: 'Dates', style: { fontSize: '25px' }},
                categories: categories,
            },
            yAxis: {
                title: {text: null}
            },
            tooltip: {
                backgroundColor: 'rgb(2, 131, 143)', borderWidth: 0, borderRadius: 10, shadow: false,
                style: {color: '#F0F0F0', textAlign: 'center'},
                useHTML: true, formatter: function () {
                    return '<i class="fas fa-medal"></i><b> ' + this.y + '</b>';
                }
            },
            legend: {enabled: false},
            series: [{type: 'line', data: data}],
        };
    }

    initHeader(): void {
        this.pageInfos.length = 0;
        this.pageInfos.push({label: "Number of entries", value: this.countryData!.participations.length});
        this.pageInfos.push({
            label: "Number of medals",
            value: this.olympicService.getTotalMedalsForACountry(this.countryData!)
        });
        this.pageInfos.push({
            label: "Number of athletes",
            value: this.getTotalAthletesForACountry(this.countryData!)
        });
    }

    getTotalAthletesForACountry(olympicCountry: Olympic): number {
        return olympicCountry.participations.reduce((total, participation) =>
            total + participation.athleteCount, 0);
    }

}
