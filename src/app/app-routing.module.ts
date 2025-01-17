import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {DetailComponent} from './pages/detail/detail.component';
import {OlympicDataResolver} from "./core/resolver/OlympicDataResolver";

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'detail/:country',
        component: DetailComponent,
        resolve: { olympicData: OlympicDataResolver }
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
