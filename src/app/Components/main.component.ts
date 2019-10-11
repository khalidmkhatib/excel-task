import { Component, OnInit, ElementRef } from '@angular/core';
import {Excel} from '../Helpers/Excel';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private el: ElementRef) { }
  public excel:Excel;
  private allowedExtensions:string[]=['xlsx','xls',  'xlsm','xltx','xltm','xlsb','xlam'];
    currentPage = 0;
  isEmptyDrop = true; 
  isExcelDrop = true;

  ngOnInit() {
  this.excel=new Excel();
  }

  inputExcelOnClick(evt) {
    const target: HTMLInputElement = evt.target;
    if (target.files.length === 0) {
      throw new Error('no file selected');
    }
    if (target.files.length > 1) {
      throw new Error('Cannot use multiple files');
    }
    var name:string=evt.target.files.item(0).name;
    if(this.allowedExtensions.indexOf(name.split('.')[name.split('.').length-1]) > -1 ){
    this.excel.sheetJsExcelName =name;
    const reader: FileReader = new FileReader();
    this.readerExcel(reader);
    reader.readAsArrayBuffer(target.files[0]);
    this.excel.sheetBufferRender = target.files[0];
    this.isEmptyDrop = false;
    this.isExcelDrop = true;
    }
    else {
            throw new Error('Not Allowed Extension');
    }
  }


  dropExcelOnChance(targetInput: Array<File>) {
    this.excel.sheetJsExcelName = targetInput[0].name;
    if (targetInput.length !== 1) {
      throw new Error('Cannot drop multipile files');
    }
    const reader: FileReader = new FileReader();
    this.readerExcel(reader);
    reader.readAsArrayBuffer(targetInput[0]);
    this.excel.sheetBufferRender = targetInput[0];
    this.isEmptyDrop = false;
    this.isExcelDrop = true;
  }

  dropExcelBlock(fileList: Array<File>) {
    if (fileList.length === 0) {
      return;
    } else {
      this.isExcelDrop = false;
      throw new Error('Not Excel file');
    }
  }

  loadSheetOnTabClick(eventTab: any) {
    if(eventTab){
      var index:number=eventTab.index;
    this.currentPage = index;
    if (this.excel.localWorkBook === undefined) {
      throw new Error('File Error');
      return;
    }
    const reader: FileReader = new FileReader();
    this.readerExcel(reader, index);
    reader.readAsArrayBuffer(this.excel.sheetBufferRender);
    }
  }


  transform(value) {
    return (value >= 26 ? this.transform(((value / 26) >> 0) - 1) : '') + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[value % 26 >> 0];
  }
  readerExcel(reader, index = 0) {
    this.excel.origExcelData = [];
    reader.onload = (e: any) => {
      const data: string = e.target.result;
      const wBook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
      this.excel.localWorkBook = wBook;
      const wsname: string = wBook.SheetNames[index];
      this.excel.sheetNameForTab = wBook.SheetNames;
      this.excel.totalPage = this.excel.sheetNameForTab.length;
      this.excel.selectDefault = this.excel.sheetNameForTab[index];
      const wSheet: XLSX.WorkSheet = wBook.Sheets[wsname];
      this.excel.localwSheet = wSheet;
      this.excel.sheetCellRange = XLSX.utils.decode_range(wSheet['!ref']);
      this.excel.sheetMaxRow = this.excel.sheetCellRange.e.r;
      this.excel.origExcelData = <AOA>XLSX.utils.sheet_to_json(wSheet, {
        header: 1,
        range: wSheet['!ref'],
        raw: true,
      });
      this.excel.refExcelData = this.excel.origExcelData.slice(1).map(value => Object.assign([], value));
      this.excel.excelTransformNum = [];
      for (let idx = 0; idx <= this.excel.sheetCellRange.e.c; idx++) {
        this.excel.excelTransformNum[idx] = this.transform(idx);
      }
      this.excel.refExcelData.map(x => x.unshift('#'));
      this.excel.excelTransformNum.unshift('order');
      this.excel.excelDataEncodeToJson = this.excel.refExcelData.slice(0).map(item =>
        item.reduce((obj, val, i) => {
          obj[this.excel.excelTransformNum[i]] = val;
          return obj;
        }, {}),
      );
    };
  }
}
