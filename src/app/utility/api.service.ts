import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertDialogs } from './alert-dialogs';
import { Utility } from './utility';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /***base url***/
  url = 'http://localhost:8080/api/v1/';
  fileUrl = 'http://http://localhost:8080/api/app.zip';
  private httpOptions: any;

  constructor(private http: HttpClient, public loading: LoadingService, public alerDialogs: AlertDialogs, public utility: Utility) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  /****** Get api call******/
  getApiWithoutProgress(myUrl: any): Observable<any> {
    console.log(this.url + myUrl);

    return this.http.get<any>(this.url + myUrl)
      .pipe(
        map(data => {
          console.log('Get Responce ::::::', JSON.stringify(data));
          return data;
        }),
        catchError((error: HttpErrorResponse) => {
          if (!this.utility.checkStringNullEmpty(error)) {
            this.alerDialogs.alertDialog('', error);
          }
          // return an observable with a user-facing error message
          return throwError(error);
        }));
  }

  /****** Get api call******/
  getApi(myUrl: any): Observable<any> {

    this.loading.present();

    return this.http.get<any>(this.url + myUrl)
      .pipe(
        map(data => {
          console.log('Get Responce ::::::', JSON.stringify(data));
          this.loading.dismiss();
          return data;
        }),
        catchError((error: HttpErrorResponse) => {
          this.loading.dismiss();
          if (!this.utility.checkStringNullEmpty(error)) {
            this.alerDialogs.alertDialog('', error);
          }
          // return an observable with a user-facing error message
          return throwError(error);
        }));
  }

  /****** Post api call******/
  postApi(myUrl: any, postData: any): Observable<any> {

    this.loading.present();

    console.log('Post Request ::::::', myUrl, JSON.stringify(postData));

    return this.http.post<any>(this.url + myUrl, postData, this.httpOptions)
      .pipe(
        map(data => {
          console.log('Post Responce ::::::', JSON.stringify(data));
          this.loading.dismiss();
          return data;
        }),
        catchError((error: HttpErrorResponse) => {
          this.loading.dismiss();
console.log(error);

          if (!this.utility.checkStringNullEmpty(error)) {
            this.alerDialogs.alertDialog('', error);
          }
          console.log('Post Error ::::::', JSON.stringify(error));
          // return an observable with a user-facing error message
          return throwError(error);
        }));
  }

  /****** Post api call******/
  postApiWithoutProgress(myUrl: any, postData: any): Observable<any> {

    console.log('Post Request ::::::', myUrl, JSON.stringify(postData));

    return this.http.post<any>(this.url + myUrl, postData, this.httpOptions)
      .pipe(
        map(data => {
          console.log('Post Responce ::::::', JSON.stringify(data));
          return data;
        }),
        catchError((error: HttpErrorResponse) => {
          if (!this.utility.checkStringNullEmpty(error.error.message)) {
            this.alerDialogs.alertDialog('', error.error.message);
          }
          console.log('Post Error ::::::', JSON.stringify(error));
          // return an observable with a user-facing error message
          return throwError(error.error.message);
        }));
  }

}
