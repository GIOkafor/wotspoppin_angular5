import { OnInit, OnChanges, SimpleChanges, ElementRef, Renderer } from '@angular/core';
import { PopOverComponent } from "./pop-over.component";
export declare class PopOverTrigger implements OnInit, OnChanges {
    private elRef;
    private renderer;
    popover: PopOverComponent;
    showOn: string;
    hideOn: string;
    constructor(elRef: ElementRef, renderer: Renderer);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private setHideOn();
    private setShowOn();
}
