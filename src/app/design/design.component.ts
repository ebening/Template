import { Component, ViewContainerRef } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { tableData, mediosData } from './table.data';

import { Router, ActivatedRoute} from '@angular/router';

import {StructureService} from '../service/structure.service';
import {UtilService} from '../service/util.service';
import {CatalogService} from '../service/catalog.service';

import {Eventos} from '../model/Eventos';
import {MediumModel} from '../model/MediumModel';

import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import * as data from './design.data';

import {MediosTableDTO} from '../model/helper/MediosTableDTO';

declare var jQuery: any;
declare var Dropzone: any;

import {FileUploader } from "ng2-file-upload";

const URL = 'http://localhost:3000/';
@Component({
    selector: 'design',
    templateUrl: './design.template.html',
    styleUrls: ['./design.style.scss'],
})
export class Design {

    public uploader: FileUploader = new FileUploader({ url: URL });
    public hasBaseDropZoneOver: boolean = false;
    private fileLoaderMsg: string = 'Arrastre y suelte fotos directamente a este dialogo.';


    /*----------------------------------------------------------------------------------------------------*/
    // parametros de medios

    structureDataId: number = 0;
    versionNum: number = 0;
    //objeto del evento
    eventoData: Eventos = new Eventos();
    //objeto de la forma
    mediumModel: MediumModel = new MediumModel();
    //opciones de campos de fechas
    datepickerOpts: any = {};

    //objeto de tabla
    //rows
    rows: Array<any> = [];
    //definicion de columnas
    columns: Array<any> = [
        { title: 'Listado de Medios', name: 'descripcion', sort: '' }
    ];


    //valores parametros
    page: number = 1;
    itemsPerPage: number = 5;
    maxSize: number = 5;
    numPages: number = 2;
    length: number = 0;
    //configuracion
    config: any = {
        paging: true,
        sorting: { columns: this.columns },
        filtering: { filterString: '', columnName: 'descripcion' }
    };
    //otro
    //ng2TableData: Array<any> = mediosData;
    //informacion de mi tabla de medios manual
    mediosTable: MediosTableDTO = new MediosTableDTO();

    constructor(
        private route: ActivatedRoute,
        private structureService: StructureService,
        private utilService: UtilService,
        //private catalogService: CatalogService,
        vcRef: ViewContainerRef,
        private router: Router) {

       // this.length = this.ng2TableData.length;
    }

    /*-----------------------------------------------------------------------------------------------------*/
    /*Carga del evento*/
    loadEvento(structureDataId: number) {
        this.structureService.getEventoByStructureDataId(structureDataId).then(
            data => {
                this.eventoData = data;

                this.mediumModel.fechaInicial = new Date(this.eventoData.fechaInicialTime);
                this.mediumModel.fechaFinal = new Date(this.eventoData.fechaFinalTime);
                this.datepickerOpts = this.utilService.loadDateOptions(this.mediumModel.fechaInicial, this.mediumModel.fechaFinal);
                //this.loadMediosDeEvento(this.eventoData.eventosId);
                this.loadMediosDeEvento2(this.eventoData.eventosId, false);
            });
    }
    
    /*carga de medios por evento*/
    loadMediosDeEvento2(eventoId, last) {
        let cLast = last || false;
        this.structureService.getMediosByEventoIdAndPagination(eventoId, this.mediosTable).then(data => {
            this.mediosTable.buildFromData(data);
            if (cLast) {
                this.moveMedioTableToPage(this.mediosTable.data.totalPages - 1);
            }
        });
    }

    public moveMedioTableToPage(e) {
        this.mediosTable.page = e;
        this.loadMediosDeEvento2(this.eventoData.eventosId, false);
    }

    /*requeridos por select*/
    /*selected: any;
    select2Options: any = {
        theme: 'bootstrap',
    };
    select2OptionsDisabled: any = {
        theme: 'bootstrap',
        disabled: true
    };*/

    /*tabla*/

    destindationMask = {
        mask: [/[1-9]/, /\d/, /\d/, /\d/, /\d/]
    };

    creditMask = {
        mask: [/[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    };

    destinationValue = '';
    creditValue = '';

    unmask(event) {
        return event.replace(/\D+/g, '');
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;

        if (this.hasBaseDropZoneOver) {
            this.fileLoaderMsg = 'Suelte la Imagen';
        } else {
            this.fileLoaderMsg = 'Arrastre y suelte fotos directamente a este dialogo.';
        }
    }
}