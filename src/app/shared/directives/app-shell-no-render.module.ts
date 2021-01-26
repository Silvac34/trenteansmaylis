import { NgModule } from '@angular/core';

import { AppShellNoRenderDirective } from './app-shell-no-render.directive';

@NgModule({
  declarations: [AppShellNoRenderDirective],
  exports: [AppShellNoRenderDirective]
})
export class AppShellNoRenderModule { }
