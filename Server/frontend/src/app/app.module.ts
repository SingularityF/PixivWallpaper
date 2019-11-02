import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DemoComponent } from './demo/demo.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FaqComponent } from './faq/faq.component';
import { FeaturesComponent } from './features/features.component';
import { RankingComponent } from './ranking/ranking.component';

const appRoutes: Routes = [
  { path: '', component: FeaturesComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'ranking/:uuid', component: RankingComponent },
  { path: 'ranking', component: RankingComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    FaqComponent,
    FeaturesComponent,
    RankingComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
