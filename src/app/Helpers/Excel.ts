import * as XLSX from 'xlsx';
type AOA = any[][];
 export class Excel{
origExcelData: AOA = [
    [''],
  ];


  refExcelData: Array<any>;
  excelFirstRow = [];
  excelDataEncodeToJson;
  excelTransformNum = [];

  sheetJsExcelName = 'firstpage.xlsx';

  sheetCellRange;
  sheetMaxRow;
  localwSheet;
  localWorkBook;
  sheetNameForTab: Array<string> = [];
  totalPage = this.sheetNameForTab.length;
  selectDefault;
  sheetBufferRender;
}