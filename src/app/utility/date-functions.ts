import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
@NgModule({
})
export class DateFunctions {

    constructor(public datepipe: DatePipe) {

    }

    /** Return todays date in  yyyy-MM-dd format */
    todaysDate() {
        return this.convertDate(new Date(), 'yyyy-MM-dd');
    }

    /** Return yesterdays date in  yyyy-MM-dd format */
    yesterDayDate() {
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate() - 1),
        year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    /** Return date before 7th day in  yyyy-MM-dd format */
    dateBefore7thDay() {
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate() - 6),
        year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    /** Convert date into given format */
    convertDate(date: any, format: any) {
        return this.datepipe.transform(date, format);
    }

    /** Convert date into given format */
    convertStringDate(date: any, format: any) {
        if(date)
         return this.datepipe.transform(new Date(date), format);
        else return null;
    }
}
