import { NgModule } from '@angular/core';

import { AppShellRenderDirective } from './app-shell-render.directive';

@NgModule({
  declarations: [AppShellRenderDirective],
  exports: [AppShellRenderDirective]
})
export class AppShellRenderModule { }
