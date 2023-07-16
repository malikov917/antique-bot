import { NgModule } from '@angular/core';
import { BuilderModule } from '@builder.io/angular';

@NgModule({
  declarations: [],
  imports: [
    BuilderModule.forRoot('7cbcba47cd0149b4926a8ce7ce1d38ae')
  ],
  exports: [BuilderModule],
})
export class BuilderioWorkaround {}
