import { isPlatformBrowser } from '@angular/common';
import { Directive, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAppShellRender]'
})
export class AppShellRenderDirective implements OnInit {

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    isPlatformBrowser(this.platformId)
      ? this.viewContainer.clear()
      : this.viewContainer.createEmbeddedView(this.templateRef);
  }

}
