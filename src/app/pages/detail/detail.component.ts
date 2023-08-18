import {Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {ActivatedRoute, Router} from '@angular/router';
import {Olympic} from 'src/app/core/models/Olympic';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {ErrorService} from "../../core/services/ErrorService.service";
import {LocalStorageService} from "../../core/services/local-storage.service";

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

    pageInfos: { name: string, data: number }[] = [];
    countryData?: Olympic | null | undefined;
    highcharts: typeof Highcharts = Highcharts;
    chartOptions!: Highcharts.Options;
    isChartDisplayable = false;
    requestedCountry: string | null = this.route.snapshot.paramMap.get('country');

    constructor(private olympicService: OlympicService,
                private router: Router,
                private route: ActivatedRoute,
                private errorService: ErrorService,
                private localStorageService: LocalStorageService) {}

    ngOnInit(): void {
        this.countryData = this.olympicService.getOlympicByCountryName(this.requestedCountry);
        if (this.countryData !== undefined) {
            this.localStorageService.setItem("currentCountryData", this.countryData);
            this.initHeader();
            this.initLineChart();
        } else {
            this.checkForExistingStorageData();
        }
    }

    initLineChart(): void {
        this.isChartDisplayable = true;
        console.log("init line chart")
        const datas: number[] = [];
        const categories: string[] = [];

        this.countryData?.participations.forEach(participation => {
            datas.push(participation.medalsCount);
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
            series: [{type: 'line', data: datas}],
        };
    }

    initHeader(): void {
        this.pageInfos.length = 0;
        this.pageInfos.push({name: "Number of entries", data: this.countryData!.participations.length});
        this.pageInfos.push({
            name: "Number of medals",
            data: this.olympicService.getTotalMedalsForACountry(this.countryData!)
        });
        this.pageInfos.push({
            name: "Number of athletes",
            data: this.olympicService.getTotalAthletesForACountry(this.countryData!)
        });
    }

    checkForExistingStorageData(): void {
        this.countryData = this.localStorageService.getItem("currentCountryData");
        if (this.countryData != null && this.countryData.country == this.requestedCountry) {
            this.initHeader();
            this.initLineChart();
        } else  {
            this.errorService.setNotFoundErrorMessage("We cannot found information for the chosen country");
            this.router.navigateByUrl('**');
        }

    }

}
