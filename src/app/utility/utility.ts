import { NavController } from '@ionic/angular';
import { Injectable, NgModule } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AppConstants } from '../app.constants';
import { DatePipe } from '@angular/common';
import { isUndefined } from 'util';
@NgModule({
})
export class Utility {

    data: any;

    constructor(private appConstants: AppConstants) {

    }

    // Check String null empty
    public checkStringNullEmpty(str: any) {
        if (str != null && str !== '') {
            return false;
        } else {
            return true;
        }
    }


    // Set User Session
    public setSessionObject(dataObject: any) {
        localStorage.setItem(this.appConstants.loginSessionKey, JSON.stringify(dataObject));
    }

    public getSessionObject() {
        const sessionObj = localStorage.getItem(this.appConstants.loginSessionKey);

        // tslint:disable-next-line: quotemark
        if (sessionObj !== null && sessionObj !== "undefined") {
            return JSON.parse(sessionObj);
        }
        return null;
    }

    /** Check give value is negative value or not */
    public isNegativeValue(val: any) {
        if (!this.checkStringNullEmpty(val) && val < 0) {
            return true;
        }
        return false;
    }

    public convertNoIntoDate(no: any) {
        if (!this.checkStringNullEmpty(no)) {
            let date = '';

            for (let i = 0; i < no.length; i++) {
                // 2019-
                if (i === 4) {
                    date = date + '-';
                }

                // 2019-09-
                if (i === 6) {
                    date = date + '-';
                }

                // 2019-09-25
                if (i === 8) {
                    date = date + ' ';
                }

                // 2019-09-25 08:
                if (i === 10) {
                    date = date + ':';
                }

                if (no.length === 14 && i === 12) {
                    date = date + ':';
                }

                date = date + no[i];
            }
            return date;
        } else {
            return '';
        }
    }

    public convertNoIntoTime(no: any) {
        if (!this.checkStringNullEmpty(no)) {
            let date = '';

            for (let i = 0; i < no.length; i++) {
                // 2019-
                if (i === 4) {
                    // date = date + '-';
                }

                // 2019-09-
                if (i === 6) {
                    // date = date + '-';
                }

                // 2019-09-25
                if (i === 8) {
                    // date = date + ' ';
                }

                // 2019-09-25 08:
                if (i === 10) {
                    date = date + ':';
                }

                if (no.length === 14 && i === 12) {
                    date = date + ':';
                }

                date = date + no[i];
            }
            return date;
        } else {
            return '';
        }
    }

    public getMillies(date: any): number {
        const d = new Date(date);
        const n = d.getMilliseconds();
        return new Date(date).getMilliseconds();
    }

    public twoDateDiffInSeconds(startDate: any, endDate: any) {
        return ((Date.parse(endDate) - Date.parse(startDate)) / 1000);
    }

    public ticketNo(ticketNo: any) {

        // tslint:disable-next-line: radix
        if (parseInt(ticketNo) > 0) {
            return '200' + ticketNo;
        } else {
            return '201' + ticketNo;
        }
    }
}
