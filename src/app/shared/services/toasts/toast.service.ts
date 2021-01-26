import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}, header?: string, ) {
    this.toasts.push({ textOrTpl, ...options, header });
  }

  remove(toast: any[]) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
