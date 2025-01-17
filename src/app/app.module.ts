import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HighchartsChartModule} from 'highcharts-angular';
import {HomeComponent} from './pages/home/home.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {HeaderComponent} from './pages/components/header/header.component';
import {DetailComponent} from './pages/detail/detail.component';

@NgModule({
    declarations: [AppComponent, HomeComponent, NotFoundComponent, HeaderComponent, DetailComponent],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule, HighchartsChartModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
