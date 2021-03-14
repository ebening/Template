/// <reference types="select2" />
import { AfterViewInit, ElementRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges, Renderer, OnInit } from '@angular/core';
import { Select2OptionData } from './select2.interface';
export declare class Select2Component implements AfterViewInit, OnChanges, OnDestroy, OnInit {
    private renderer;
    selector: ElementRef;
    data: Array<Select2OptionData>;
    value: any;
    cssImport: boolean;
    width: string;
    disabled: boolean;
    options: Select2Options;
    valueChanged: EventEmitter<{}>;
    private element;
    private check;
    constructor(renderer: Renderer);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private initPlugin();
    private style;
}
