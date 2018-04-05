import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[modal-holder]'
})
export class ModalHolderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
