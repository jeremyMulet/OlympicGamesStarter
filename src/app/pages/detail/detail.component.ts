import {Component, OnDestroy, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {ActivatedRoute, Router} from '@angular/router';
import {Olympic} from 'src/app/core/models/Olympic';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Subscription} from "rxjs";
import {ErrorService} from "../../core/services/ErrorService.service";

@Component({
    selector: 'app-detail', templateUrl: './detail.component.html', styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
    olympics$?: Subscription;
    pageInfos: { name: string, data: number }[] = [];
    countryData?: Olympic | null | undefined;
    highcharts: typeof Highcharts = Highcharts;
    chartOptions!: Highcharts.Options;

    constructor(private olympicService: OlympicService,
                private router: Router,
                private route: ActivatedRoute,
                private errorService: ErrorService) {}

    ngOnInit(): void {
        const olympicCountryName = this.route.snapshot.paramMap.get('country');

        this.olympics$ = this.olympicService.getOlympics().subscribe(data => {
            if (this.olympicService.getOlympicByCountryName(olympicCountryName) !== null) {
                this.countryData = this.olympicService.getOlympicByCountryName(olympicCountryName);
            } else {
                this.errorService.setNotFoundErrorMessage("We cannot found information for the choosen country");
                this.router.navigateByUrl('**')
            }

            if (this.countryData !== undefined && this.countryData !== null) {
                this.pageInfos.push({name: "Number of entries", data: this.countryData?.participations.length})
                this.pageInfos.push({
                    name: "Number of medals",
                    data: this.olympicService.getTotalMedalsForACountry(this.countryData)
                })
                this.pageInfos.push({
                    name: "Number of athletes",
                    data: this.olympicService.getTotalAthletesForACountry(this.countryData)
                })
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

        this.countryData?.participations.forEach(participation => {
            datas.push(participation.medalsCount);
            categories.push(participation.year.toString());
        })

        this.chartOptions = {
            colors: ['#956065'],
            title: {text: ''},
            xAxis: {
                title: {
                    text: 'Dates',
                    style: { fontSize: '25px' }
                },
                categories: categories,
            },
            yAxis: {
                title: {text: null}
            },
            tooltip: {
                backgroundColor: 'rgb(2, 131, 143)', borderWidth: 0, borderRadius: 10, shadow: false,
                style: {
                    color: '#F0F0F0', textAlign: 'center'
                },
                useHTML: true, formatter: function () {
                    return '<i class="fas fa-medal"></i><b> ' + this.y + '</b>';
                }
            },
            legend: {enabled: false},
            series: [{type: 'line', data: datas}],
        };
    }

}
