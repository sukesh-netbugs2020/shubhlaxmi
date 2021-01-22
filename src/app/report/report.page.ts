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
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  providers: [NetworkProviderService,
    Network
  ]
})
export class ReportPage implements OnInit {

  public fromDate = null;
  public toDate = null;
  public reportsArr = [];
  public reportName;
  public totalPlAmt = 0;
  public totalMachineAmt = 0;
  public totalCompAmt = 0;
  public selectedFromDate = null;
  public selectedToDate = null;
  public selectedMachineId;
  public machinesArr = [];
  public delay = ms => new Promise(res => setTimeout(res, ms));

  // tslint:disable-next-line: member-ordering
  private fromDateCalendar: any = this.appConstants.globalCalendarObject;
  // tslint:disable-next-line: member-ordering
  private toDateCalendar: any = this.appConstants.globalCalendarObject;

  constructor(
    public appConstants: AppConstants,
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
    this.getReports();
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

  printTicket(ticketData: any[]) {

    console.log(JSON.stringify(ticketData));

    // tslint:disable-next-line: prefer-const
    let qz = require('qz-tray');
    const createHash = require('sha.js');
    // tslint:disable-next-line: only-arrow-functions
    qz.api.setSha256Type(function (data) {
      return createHash('sha256').update(data).digest('hex');
    });

    qz.api.setPromiseType(function promise(resolver) { return new Promise(resolver); });

    if (!qz.websocket.isActive()) {

      // tslint:disable-next-line: only-arrow-functions
      qz.websocket.connect().then(function () {
        return qz.printers.find();
        // tslint:disable-next-line: only-arrow-functions
      }).then(function (printers) {

        // tslint:disable-next-line: prefer-const
        let config = qz.configs.create(printers[0]);

        // tslint:disable-next-line: only-arrow-functions
        qz.print(config, ticketData).catch(function (e) {
          console.error(e);
        });

      });

    } else {

      // tslint:disable-next-line: only-arrow-functions
      qz.printers.find().then(function (printers) {

        // tslint:disable-next-line: prefer-const
        let config = qz.configs.create(printers[0]);
        // tslint:disable-next-line: only-arrow-functions
        qz.print(config, ticketData).catch(function (e) {
          console.error(e);
        });

      });

    }

  }

  changeMachine() {
    this.reportsArr = [];
    this.getReports(this.reportName);
  }

  // **************** Call api *****************


  async getMachineList() {

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

    const sessionData = this.utility.getSessionObject();

    const postData = 'agent_id=' + sessionData.data.id;

    this.apiService.postApi(this.appConstants.getMachineForAgentUrl, postData).subscribe(
      (result) => {
        // console.log(JSON.stringify(result));
        if (result.status === '1') {

          if (result.data.length !== 0) {
            this.machinesArr = result.data;

            const machine = {
              id: 'All',
              machine_name: 'All'
            };

            this.machinesArr.splice(this.machinesArr.length, 0, machine);

            this.machinesArr.forEach(element => {
              if (element.id === sessionData.machine_id) {
                this.selectedMachineId = element.id;
                this.getReports('Today');
              }
            });

          } else {
            // this.alertDialogs.alertDialog('', result.message);
          }

        } else {
          // this.alertDialogs.alertDialog('', result.message);
        }
      }
    );


  }

  async getReports(reportsOf: any = 'Today') {

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

    this.reportsArr = [];

    if (reportsOf === 'By Date' && this.utility.checkStringNullEmpty(this.fromDate)) {
      return;
    }


    if (reportsOf === 'By Date' && this.utility.checkStringNullEmpty(this.toDate)) {
      return;
    }

    const sessionData = this.utility.getSessionObject();

    // const postData = 'agent_id=' + sessionData.data.id + '&agent_machine_id=' + this.selectedMachineId
    //   + '&from_date=' + this.selectedFromDate + '&to_date=' + this.selectedToDate;

    const postData = '?from_date=' + this.selectedFromDate + '&to_date=' + this.selectedToDate;

    console.log(this.appConstants.getTransactionsByDatesUrl+postData);
    await this.apiService.getApiWithoutProgress(this.appConstants.getReportByDatesUrl+postData).subscribe(
      (result) => {
        console.log(JSON.stringify(result));
        if (result.status === 200) {

          if (result.body.length !== 0) {
            const reportArray = result.body;

            this.totalPlAmt = 0;
            this.totalMachineAmt = 0;
            this.totalCompAmt = 0;

            if (reportArray.length > 0) {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < reportArray.length; i++) {

                const report = reportArray[i];
                let totalCompAmount = 0.0;

                // tslint:disable-next-line: radix
                this.totalPlAmt = this.totalPlAmt + parseFloat(report.profitLossAmount);
                // tslint:disable-next-line: radix
                this.totalMachineAmt = this.totalMachineAmt + parseFloat(report.machineAmount);
                
                // tslint:disable-next-line: radix
                this.totalCompAmt = this.totalCompAmt + parseFloat(report.companyAmount);

                /** Trim PL Amount, Machine Amt, Company Amount  */
                // reportArray[i].net_amount = parseFloat(report.net_amount).toFixed(2);
                // reportArray[i].machine_amount = parseFloat(report.machine_amount).toFixed(2);
                // reportArray[i].machine_commission = parseFloat(report.machine_commission).toFixed(2);
                // reportArray[i].total_company_amount = parseFloat(report.total_company_amount).toFixed(2);

                reportArray[i].net_amount = (parseFloat(report.amount) * 0.5).toFixed(2);
                reportArray[i].machine_amount = (parseFloat(report.amount) * 0.5).toFixed(2);
                reportArray[i].machine_commission = (parseFloat(report.amount) * 0.5).toFixed(2);
                reportArray[i].total_company_amount = (parseFloat(report.amount) * 0.5).toFixed(2);

              }
              this.reportsArr = reportArray;
            }

          } else {
            // this.alertDialogs.alertDialog('', result.message);
          }

        } else {
          // this.alertDialogs.alertDialog('', result.message);
        }
      }
    );


  }

  async getReportsPrint() {

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


    const sessionData = this.utility.getSessionObject();

    // const postData = 'agent_id=' + sessionData.data.id + '&agent_machine_id=' + this.selectedMachineId
    //   + '&from_date=' + this.selectedFromDate + '&to_date=' + this.selectedToDate;
    const postData = 'agent_machine_id=' + this.selectedMachineId
      + '&from_date=' + this.selectedFromDate + '&to_date=' + this.selectedToDate;

    this.apiService.postApi(this.appConstants.getReportsPrintUrl, postData).subscribe(
      (result) => {
        // console.log(JSON.stringify(result));
        if (result.status === '1') {

          if (result.data.length > 0) {
            const resData = result.data;

            let totalAmt = 0.0;
            const horizontalLine = '----------------------------';
            const fromDate = this.dateFunctions.convertDate(this.selectedFromDate, 'dd-MM-yyyy');
            const toDate = this.dateFunctions.convertDate(this.selectedToDate, 'dd-MM-yyyy');
            const todaysDate = this.dateFunctions.convertDate(new Date(), 'dd-MM-yyyy');

            const header =
              'Date :' + todaysDate + '\n'
              + 'KuberLaxmi Lottery(Gadchandur)\n'
              + 'Cash Report\n'
              + 'from ' + fromDate + ' to ' + toDate + '\n';

            let ticket = '';

            /** Print tickets */
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < resData.length; i++) {

              const obj = resData[i];
              const date = this.dateFunctions.convertDate(obj.created, 'dd-MM-yyyy');

              ticket = ticket + horizontalLine + '\n'
                + date + '\n'
                + horizontalLine + '\n'
                + 'Sale : ' + obj.total_sale + '\n'
                + 'Win Point : ' + obj.win_point + '\n'
                + 'Net Amount : ' + obj.net_amount + '\n'
                + 'Commission Amount : ' + obj.machine_commission + '\n'
                + 'Total G.P.: ' + obj.machine_amount + '\n'
                + 'Company Amount : ' + (parseFloat(obj.company_amount) + parseFloat(obj.agent_amount)) + '\n';

              // tslint:disable-next-line: radix
              totalAmt = totalAmt + parseFloat(obj.machine_amount);
            }

            const footer = horizontalLine + '\n'
              + 'Payable Total : ' + totalAmt + '\n'
              + horizontalLine + '\n';

            const myd = header + ticket + footer + '\n\n';

            // tslint:disable-next-line: prefer-const
            let ticketData3 = [
              myd
            ];

            this.printTicket(ticketData3);

          } else {
            // this.alertDialogs.alertDialog('', result.message);
          }

        } else {
          // this.alertDialogs.alertDialog('', result.message);
        }
      }
    );


  }


}
