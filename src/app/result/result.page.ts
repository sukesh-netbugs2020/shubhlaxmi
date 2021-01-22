import { Component, OnInit } from '@angular/core';
import { Utility } from 'src/app/utility/utility';
import { AppConstants } from '../app.constants';
import { DatePipe } from '@angular/common';
import { NavController, Events, ModalController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { NetworkProviderService } from '../utility/network-provider.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../utility/api.service';
import { AlertDialogs } from '../utility/alert-dialogs';
import { DateFunctions } from '../utility/date-functions';
import { Ionic4DatepickerModalComponent } from '@logisticinfotech/ionic4-datepicker';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  providers: [NetworkProviderService,
    Network
  ]
})
export class ResultPage implements OnInit {

  public fromDate = null;
  public toDate = null;
  public resultsArr = [];
  public reportName;
  public selectedFromDate = null;
  public selectedToDate = null;
  public delay = ms => new Promise(res => setTimeout(res, ms));

  // tslint:disable-next-line: member-ordering
  private fromDateCalendar: any = this.appConstants.globalCalendarObject;
  // tslint:disable-next-line: member-ordering
  private toDateCalendar: any = this.appConstants.globalCalendarObject;

  constructor(public appConstants: AppConstants,
              public utility: Utility,
              public datepipe: DatePipe,
              public navController: NavController,
              public network: Network,
              public events: Events,
              public networkProvider: NetworkProviderService,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private alertDialogs: AlertDialogs,
              public dateFunctions: DateFunctions,
              public modalCtrl: ModalController) { }

  ngOnInit() {
    this.getResults('Today');
  }

  async openFromDatePicker() {
    this.delay(100);
    this.fromDateCalendar = this.appConstants.globalCalendarObject;
    this.fromDateCalendar.fromDate = new Date('2000-01-01');
    this.fromDateCalendar.inputDate = new Date();
    const datePickerModal = await this.modalCtrl.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { objConfig: this.fromDateCalendar }
    });
    await datePickerModal.present();
    datePickerModal.onDidDismiss()
      .then((data) => {
        // this.isModalOpen = false;
        console.log(data);
        if (data.data.date !== 'Invalid date') {
          this.fromDate = data.data.date;
          this.toDate = '';
        }

      });
  }

  async openToDatePicker() {
    this.toDateCalendar.fromDate = new Date(this.fromDate);
    const datePickerModal = await this.modalCtrl.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { objConfig: this.toDateCalendar }
    });
    await datePickerModal.present();
    datePickerModal.onDidDismiss()
      .then((data) => {
        // this.isModalOpen = false;
        console.log(data);

        if (data.data.date !== 'Invalid date') {

          this.toDate = data.data.date;
        }

      });
  }

  backToHome() {
    this.navController.navigateRoot('/home');
  }


  // **************** Call api *****************

  async getResults(reportsOf: any) {

    this.reportName = reportsOf;

    // Check Internet
    this.networkProvider.initializeNetworkEvents();
    this.events.subscribe('network:offline', () => {
      this.alertDialogs.alertDialog('', this.appConstants.checkInternet);
      console.log('network:offline ==> ' + this.network.type);
      return;
    });

    this.events.subscribe('network:online', () => {
      alert('network:online ==> ' + this.network.type);
    });

    if (reportsOf === 'Today') {

      this.selectedFromDate = this.dateFunctions.todaysDate();
      this.selectedToDate = this.dateFunctions.todaysDate();

      this.fromDate = null;
      this.toDate = null;

    } else if (reportsOf === 'Yesterday') {

      this.selectedFromDate = this.dateFunctions.yesterDayDate();
      this.selectedToDate = this.dateFunctions.yesterDayDate();

      this.fromDate = null;
      this.toDate = null;

    } else if (reportsOf === 'Last 7 days') {

      this.selectedFromDate = this.dateFunctions.dateBefore7thDay();
      this.selectedToDate = this.dateFunctions.todaysDate();

      this.fromDate = null;
      this.toDate = null;

    } else if (reportsOf === 'By Date') {

      this.selectedFromDate = this.fromDate;
      this.selectedToDate = this.toDate;

    }

    this.resultsArr = [];

    if (reportsOf === 'By Date' && this.utility.checkStringNullEmpty(this.fromDate)) {
      return;
    }


    if (reportsOf === 'By Date' && this.utility.checkStringNullEmpty(this.toDate)) {
      return;
    }

    const sessionData = this.utility.getSessionObject();

    const postData =  '?from_date=' + this.selectedFromDate + '&to_date=' + this.selectedToDate;
    // const postData =  '?from_date=&to_date=';

    this.apiService.getApiWithoutProgress(this.appConstants.getResultsByDatesUrl + postData).subscribe(
      (result) => {
        if (result.status === 200) {
            this.resultsArr = result.body;

        } else {
          this.alertDialogs.alertDialog('', result.body);
        }
      }
    );


  }

}
