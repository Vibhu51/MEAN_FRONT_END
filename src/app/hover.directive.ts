import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {

  constructor(private h:ElementRef) { }

  @HostBinding('color') yellow ='yellow'

  @HostListener('mouseenter') onMouseEnter() {
    this.h.nativeElement.style.color = 'pink';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.h.nativeElement.style.color = 'yellow';
  }

}
