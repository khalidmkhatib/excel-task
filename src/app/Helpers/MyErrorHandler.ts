import { ErrorHandler, Injectable } from "@angular/core";

@Injectable({
  providedIn:'root',
})
export class MyErrorHandler implements ErrorHandler {  
  constructor(){}
  handleError(error) {
console.log(error);

  }
}