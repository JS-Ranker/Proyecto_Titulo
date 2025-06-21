import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
registerLocaleData(localeEsCL);

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
