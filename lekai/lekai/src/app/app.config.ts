import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BuilderModule } from '@builder.io/angular';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(BuilderModule.forRoot('7cbcba47cd0149b4926a8ce7ce1d38ae')),
  ]
};
