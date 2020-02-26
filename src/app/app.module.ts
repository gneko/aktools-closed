import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // (optional)
import { MaterialModule } from '@blox/material';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HrComponent } from './hr/hr.component';
import { HrTagsComponent } from './hr-tags/hr-tags.component';
import { HrCombComponent } from './hr-comb/hr-comb.component';
import { LvlupComponent } from './lvlup/lvlup.component';
import { MaterialComponent } from './material/material.component';
import { MaterialCardComponent } from './material-card/material-card.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MainComponent } from './main/main.component';
import { HelpComponent } from './help/help.component';
import { ClipboardModule } from 'ngx-clipboard';
import { CharMatComponent } from './char-mat/char-mat.component';
import { CharMatCharcardComponent } from './char-mat-charcard/char-mat-charcard.component';
import { CharMatMatcardComponent } from './char-mat-matcard/char-mat-matcard.component';
import { SettingsComponent } from './settings/settings.component';
import { AutoDetectComponent } from './auto-detect/auto-detect.component';
import { AutoDetectHashComponent } from './auto-detect-hash/auto-detect-hash.component';
import { DetectSetttingComponent } from './detect-setting/detect-setting.component';
import { StageChooserComponent } from './stage-chooser/stage-chooser.component';

@NgModule({
  declarations: [
    AppComponent,
    HrComponent,
    HrTagsComponent,
    HrCombComponent,
    LvlupComponent,
    MaterialComponent,
    MaterialCardComponent,
    MainComponent,
    HelpComponent,
    CharMatComponent,
    CharMatCharcardComponent,
    CharMatMatcardComponent,
    SettingsComponent,
    AutoDetectComponent,
    AutoDetectHashComponent,
    DetectSetttingComponent,
    StageChooserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    ClipboardModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
