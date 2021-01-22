import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import { Utility } from 'src/app/utility/utility';
import { AppConstants } from '../app.constants';
import { DatePipe } from '@angular/common';
import { NavController, Events, Platform, AlertController, IonInput } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { NetworkProviderService } from '../utility/network-provider.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../utility/api.service';
import { AlertDialogs } from '../utility/alert-dialogs';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { DateFunctions } from '../utility/date-functions';
import { Howl, Howler } from 'howler';
import * as Winwheel from 'node_modules/winwheel';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [NetworkProviderService,
    Network
  ]
})
export class HomePage {

  public fieldOne = null;
  public fieldTwo = null;
  public fieldThree = null;
  public fieldFour = null;
  public fieldFive = null;
  public fieldSix = null;
  public fieldSeven = null;
  public fieldEight = null;
  public fieldNine = null;
  public fieldZero = null;
  public showConfirmTicketDialog = false;
  public showTicketDetailsDialog = false;
  public showResultDetails = false;
  public showSubmitButton = false;
  public showRefreshButton = false;
  public isShowWheelModel = false;
  public isShowLastFiveTicketModel = false;
  public isShowTodaysSaleAmt = false;
  public isUserWin = false;
  public purchaseDateTime;
  public totalAmtOfTicket = 0;
  public totalDrawAmt = 0;
  public ticketArr: any[] = [];
  public lastRecordsArr: any[] = [];
  public lastFiveTicketArr = [];
  public barcodeNo: any;
  public winingAmount = 0;
  public finalBarcode;
  public wheelImage;
  public sessionData;
  public time: string;
  private code = '';
  public timeouts = [];
  private focusedFieldNo = 1;

  // Sound
  public alertSound;
  public winningSound;
  public wheelSound;
  public delay = ms => new Promise(res => setTimeout(res, ms));

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
    private barcodeScanner: BarcodeScanner,
    private nativeAudio: NativeAudio,
    public dateFunction: DateFunctions,
    public alertCtrl: AlertController,
    public datePipe: DatePipe
    ) {
    const { Howl, Howler } = require('howler');
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event.target);

    if (event.key !== 'Enter') {
      this.code = this.code + event.key;
    }

    if (event.key === 'Enter') {

      this.barcodeNo = this.code;
      this.code = '';
      // this.alertDialogs.alertDialog('Code', this.barcodeNo);
      this.getTicketDetails();
    }
  }


  // tslint:disable-next-line: use-lifecycle-interface
  async ngOnInit() {

    this.sessionData = this.utility.getSessionObject();

    this.sessionData.drawDate = '2019-04-10';
    this.sessionData.nextDrawTime = '10:10';
    console.log(this.sessionData);

    /** Load all sounds */
    this.loadSounds();

    /* this.isShowWheelModel = true;
    let myWheel = new Winwheel({
      numSegments: 10,         // Number of segments
      textFontSize: 38,        // Font size.
      segments:            // Definition of all the segments.
        [
          { fillStyle: '#eae56f', text: '1' },
          { fillStyle: '#89f26e', text: '2' },
          { fillStyle: '#7de6ef', text: '3' },
          { fillStyle: '#e7706f', text: '4' },
          { fillStyle: '#eae56f', text: '5' },
          { fillStyle: '#89f26e', text: '6' },
          { fillStyle: '#7de6ef', text: '7' },
          { fillStyle: '#e7706f', text: '8' },
          { fillStyle: '#89f26e', text: '9' },
          { fillStyle: '#7de6ef', text: '0' }
        ],
      animation:               // Definition of the animation
      {
        type: 'spinToStop',
        duration: 10,
        spins: 10,
        //  callbackFinished: alertPrize
      }
    });
    let stopAt = this.appConstants.wheelNoArr[3];
    // this.alertDialogs.alertDialog('Stop at', stopAt);
    // Important thing is to set the stopAngle of the animation before stating the spin.
    myWheel.animation.stopAngle = stopAt;
    myWheel.startAnimation(); */

    document.onkeydown = (e: KeyboardEvent): any => {

      let element = null;

      if (e.keyCode === 37) {
        console.log('Prev');

        if (this.focusedFieldNo === 10) {
          // Focus nineth field
          element = document.getElementById('field9');

        } else if (this.focusedFieldNo === 9) {
          // Focus eighth field
          element = document.getElementById('field8');

        } else if (this.focusedFieldNo === 8) {
          // Focus seventh field
          element = document.getElementById('field7');

        } else if (this.focusedFieldNo === 7) {
          // Focus sixth field
          element = document.getElementById('field6');

        } else if (this.focusedFieldNo === 6) {
          // Focus fifth field
          element = document.getElementById('field5');

        } else if (this.focusedFieldNo === 5) {
          // Focus fourth field
          element = document.getElementById('field4');

        } else if (this.focusedFieldNo === 4) {
          // Focus third field
          element = document.getElementById('field3');

        } else if (this.focusedFieldNo === 3) {
          // Focus second field
          element = document.getElementById('field2');

        } else if (this.focusedFieldNo === 2) {
          // Focus first field
          element = document.getElementById('field1');

        }

        if (element !== null) {
          element.focus();
        }

        if (this.focusedFieldNo !== 1) {
          this.focusedFieldNo--;
        }
      }

      if (e.keyCode === 39) {
        console.log('Next');

        if (this.focusedFieldNo === 1) {
          // Focus second field
          element = document.getElementById('field2');

        } else if (this.focusedFieldNo === 2) {
          // Focus third field
          element = document.getElementById('field3');

        } else if (this.focusedFieldNo === 3) {
          // Focus fourth field
          element = document.getElementById('field4');

        } else if (this.focusedFieldNo === 4) {
          // Focus fifth field
          element = document.getElementById('field5');

        } else if (this.focusedFieldNo === 5) {
          // Focus sixth field
          element = document.getElementById('field6');

        } else if (this.focusedFieldNo === 6) {
          // Focus seventh field
          element = document.getElementById('field7');

        } else if (this.focusedFieldNo === 7) {
          // Focus eighth field
          element = document.getElementById('field8');

        } else if (this.focusedFieldNo === 8) {
          // Focus nineth field
          element = document.getElementById('field9');

        } else if (this.focusedFieldNo === 9) {
          // Focus tenth field
          element = document.getElementById('field10');

        }

        if (element !== null) {
          element.focus();
        }

        if (this.focusedFieldNo !== 10) {
          this.focusedFieldNo++;
        }
      }

    };

  }

  /*same as resume */
  ionViewDidEnter() {
    this.getAgentData(true);
  }

  loadSounds() {

    this.alertSound = new Howl({
      src: ['./assets/audio/alert.mp3']
    });

    this.wheelSound = new Howl({
      src: ['./assets/audio/wheel_sound.ogg']
    });

    this.winningSound = new Howl({
      src: ['./assets/audio/winning_sound.mp3']
    });

    return;

    /** Load alert sound */
    this.nativeAudio.preloadSimple('alert_sound', './assets/audio/alert.mp3').then((success) => {
      // console.log('success');
      /*  this.nativeAudio.play('alert_sound').then(() => {
         console.log('success playing');
       }, (error) => {
         console.log(error);
       }); */
    }, (error) => {
      console.log(error);
    });

    /** Load wheel sound */
    this.nativeAudio.preloadSimple('wheel_sound', './assets/audio/wheel_sound.ogg').then((success) => {
      // console.log('success');
    }, (error) => {
      console.log(error);
    });

    /** Load winnig sound */
    this.nativeAudio.preloadSimple('winning_sound', './assets/audio/winning_sound.mp3').then((success) => {
      // console.log('success');
    }, (error) => {
      console.log(error);
    });


  }

  openReports() {
    this.navController.navigateForward('/report');
  }

  cancel() {
    this.showConfirmTicketDialog = false;
    this.isShowLastFiveTicketModel = false;
  }

  resetFields() {
    this.fieldOne = null;
    this.fieldTwo = null;
    this.fieldThree = null;
    this.fieldFour = null;
    this.fieldFive = null;
    this.fieldSix = null;
    this.fieldSeven = null;
    this.fieldEight = null;
    this.fieldNine = null;
    this.fieldZero = null;
    this.ticketArr = [];
    this.totalAmtOfTicket = 0;
  }

  showTicketDetail() {
    this.showTicketDetailsDialog = true;
  }

  closeTicketDetail() {
    this.showTicketDetailsDialog = false;
  }

  closeResultDetail() {
    this.showResultDetails = false;
  }

  goToResult() {
    this.navController.navigateForward('/result');
  }

  // Cancel ticket
  async cancelTicket(ticketNo: any, index: any) {

    const alert = await this.alertCtrl.create({
      header: this.appConstants.cancelTicketNo + ticketNo,
      message: this.appConstants.cancelTicketMsg,
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            // Cancel Ticket
            console.log('Ticket No::', ticketNo, 'Index:', index);
            this.appConstants.totalDrawAmountArr.splice(index, 1);
            this.totalDrawAmt = 0;

            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.appConstants.totalDrawAmountArr.length; i++) {
              this.totalDrawAmt = this.totalDrawAmt + this.appConstants.totalDrawAmountArr[i].total;
            }

            this.cancelTicketByUser(ticketNo);

          }
        },
        {
          text: 'No',
          handler: async () => {
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  /** Calculate total amount of all tickets
   * (Show at window right side green window)
   */
  calculateTotal(ticketNo: any) {

    const ticket = {
      ticketNo: ticketNo,
      total: this.totalAmtOfTicket
    };

    this.appConstants.totalDrawAmountArr.push(ticket);
    this.totalDrawAmt = 0;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.appConstants.totalDrawAmountArr.length; i++) {
      this.totalDrawAmt = this.totalDrawAmt + this.appConstants.totalDrawAmountArr[i].total;
    }

    this.encodedText(ticketNo);
  }

  /** Click on Submit Ticket Button */
  submitTicket() {
    this.ticketArr = [];
    this.totalAmtOfTicket = 0;

    if (!this.utility.checkStringNullEmpty(this.fieldOne)) {

      if (this.fieldOne === '0') {
        this.alertDialogs.alertDialog('', this.appConstants.zeroEntered);
        return;
      }

      const objOne = {
        num: 1,
        amount: this.fieldOne
      };

      this.ticketArr.push(objOne);
    }


    if (!this.utility.checkStringNullEmpty(this.fieldTwo)) {

      if (this.fieldTwo === '0') {
        this.alertDialogs.alertDialog('', this.appConstants.zeroEntered);
        return;
      }

      const objTwo = {
        num: 2,
        amount: this.fieldTwo
      };

      this.ticketArr.push(objTwo);
    }


    if (!this.utility.checkStringNullEmpty(this.fieldThree)) {

      if (this.fieldThree === '0') {
        this.alertDialogs.alertDialog('', this.appConstants.zeroEntered);
        return;
      }

      const objThree = {
        num: 3,
        amount: this.fieldThree
      };

      this.ticketArr.push(objThree);
    }


    if (!this.utility.checkStringNullEmpty(this.fieldFour)) {

      if (this.fieldFour === '0') {
        this.alertDialogs.alertDialog('', this.appConstants.zeroEntered);
        return;
      }

      const objFour = {
        num: 4,
        amount: this.fieldFour
      };

      this.ticketArr.push(objFour);
    }


    if (!this.utility.checkStringNullEmpty(this.fieldFive)) {

      if (this.fieldFive === '0') {
        this.alertDialogs.alertDialog('', this.appConstants.zeroEntered);
        return;
      }

      const objFive = {
        num: 5,
        amount: this.fieldFive
      };

      this.ticketArr.push(objFive);
    }


    if (!this.utility.checkStringNullEmpty(this.fieldSix)) {

      if (this.fieldSix === '0') {
        this.alertDialogs.alertDialog('', this.appConstants.zeroEntered);
        return;
      }

      const objSix = {
        num: 6,
        amount: this.fieldSix
      };

      this.ticketArr.push(objSix);
    }


    if (!this.utility.checkStringNullEmpty(this.fieldSeven)) {

      if (this.fieldSeven === '0') {
        this.alertDialogs.alertDialog('', this.appConstants.zeroEntered);
        return;
      }

      const objSeven = {
        num: 7,
        amount: this.fieldSeven
      };

      this.ticketArr.push(objSeven);
    }


    if (!this.utility.checkStringNullEmpty(this.fieldEight)) {

      if (this.fieldEight === '0') {
        this.alertDialogs.alertDialog('', this.appConstants.zeroEntered);
        return;
      }

      const objEight = {
        num: 8,
        amount: this.fieldEight
      };

      this.ticketArr.push(objEight);
    }


    if (!this.utility.checkStringNullEmpty(this.fieldNine)) {

      if (this.fieldNine === '0') {
        this.alertDialogs.alertDialog('', this.appConstants.zeroEntered);
        return;
      }

      const objNine = {
        num: 9,
        amount: this.fieldNine
      };

      this.ticketArr.push(objNine);
    }


    if (!this.utility.checkStringNullEmpty(this.fieldZero)) {

      if (this.fieldZero === '0') {
        this.alertDialogs.alertDialog('', this.appConstants.zeroEntered);
        return;
      }

      const objZero = {
        num: 0,
        amount: this.fieldZero
      };

      this.ticketArr.push(objZero);
    }

    if (this.ticketArr.length > 0) {
      this.showConfirmTicketDialog = true;
      this.purchaseDateTime = this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss a');
      console.log('Array: ', JSON.stringify(this.ticketArr));

      /** Calculate total amount of ticket */
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.ticketArr.length; i++) {
        // tslint:disable-next-line: radix
        this.totalAmtOfTicket = this.totalAmtOfTicket + parseInt(this.ticketArr[i].amount);
      }
    }
  }

  /** Create barcode */
  encodedText(ticketNo: any) {
    this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE, ticketNo)
      .then(
        encodedData => {
          console.log(encodedData);
          this.finalBarcode = encodedData;
          console.log('Barcode : ' + this.finalBarcode);
        },
        err => {
          console.log('Error occured : ' + err);
        }
      );
  }

  /** Print Ticket */
  printTicket(ticketData: any[]) {

    console.log(ticketData);

    const qz = require('qz-tray');
    const createHash = require('sha.js');

    /*  qz.security.setCertificatePromise((resolve, reject) => {
       fetch('assets/digital-certificate.txt', { cache: 'no-store', headers: { 'Content-Type': 'text/plain' } })
         .then(data => resolve(data.text()));
     });
   
     qz.security.setSignaturePromise(hash => {
       return (resolve, reject) => {
         fetch('assets/private-key.pem', { cache: 'no-store', headers: { 'Content-Type': 'text/plain' } })
           .then(wrapped => wrapped.text())
           .then(data => {
             var pk = KEYUTIL.getKey(data);
             var sig = new KJUR.crypto.Signature({ 'alg': 'SHA1withRSA' });
             sig.init(pk);
             sig.updateString(hash);
             var hex = sig.sign();
             console.log('DEBUG: \n\n' + stob64(hextorstr(hex)));
             resolve(stob64(hextorstr(hex)));
           })
           .catch(err => console.error(err));
       };
     }); */

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

        const config = qz.configs.create(printers[0]);

        // tslint:disable-next-line: only-arrow-functions
        qz.print(config, ticketData).catch(function (e) {
          console.error(e);
        });

      });

    } else {

      // tslint:disable-next-line: only-arrow-functions
      qz.printers.find().then(function (printers) {

        const config = qz.configs.create(printers[0]);
        // tslint:disable-next-line: only-arrow-functions
        qz.print(config, ticketData).catch(function (e) {
          console.error(e);
        });

      });

    }

  }

  printLastTicket(ticket) {
    this.isShowLastFiveTicketModel = false;

    let ticketDetails = '';
    const code = ticket.id;
    let bets = '';
    let totalAmt = 0;
    // tslint:disable-next-line: max-line-length
    const drawDateTime = this.dateFunction.convertStringDate(this.utility.convertNoIntoDate(ticket.drawDateTime), 'dd-MM-yyyy hh:mm a');

    /** Make String of Number and corresponding entered amount
     * and calculate total Amount
     */
    const betArr: any[] = JSON.parse(ticket.bet_nums);

    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < betArr.length; j++) {
      // tslint:disable-next-line: max-line-length
      bets = bets + 'Number: ' + this.utility.ticketNo(betArr[j].num) + ' Amount: ' + betArr[j].amount + '\n';
      // tslint:disable-next-line: radix
      totalAmt = totalAmt + parseInt(betArr[j].amount);
    }

    // convenience method
    // tslint:disable-next-line: only-arrow-functions
    const chr = function (n) { return String.fromCharCode(n); };
    const barcode = '\x1D' + 'h' + chr(80) +   // barcode height
      '\x1D' + 'f' + chr(0) +              // font for printed number
      '\x1D' + 'k' + chr(69) + chr(code.length) + code + chr(0); // code39


    ticketDetails = ticketDetails
      + '\x1B' + '\x45' + '\x0D' + 'KuberLaxmi Lottery(Pune)\n' + '\x1B' + '\x45' + '\x0A'
      + 'Four Digit Online Weekly\n'
      + 'Dr. ' + drawDateTime + '\x0A'
      + '\x1D' + '\x21' + '\x01' + bets + '\x1D' + '\x21' + '\x00'
      + 'Qty : ' + betArr.length + ' Total : Rs. ' + totalAmt + '\n'
      + '\x1B' + '\x45' + '\x0D' + 'Ticket No. :' + ticket.id + '\n' + '\x1B' + '\x45' + '\x0A'
      + barcode + '\n\n';


    const data = [
      ticketDetails + '\n'
    ];

    this.printTicket(data);
  }

  showTodaysSaleAmt() {
    if (!this.isShowTodaysSaleAmt) {
      this.isShowTodaysSaleAmt = true;
    } else {
      this.isShowTodaysSaleAmt = false;
    }
  }

  // **************** Call api *****************
  async ticketConfirmPrint() {

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


    // const postData = 'agent_id=' + this.sessionData.data.id + '&agent_machine_id=' + this.sessionData.machine_id
    //   + '&draw_date_time=' + this.sessionData.nextDrawId + '&bet_nums=' + JSON.stringify(this.ticketArr)
    //   + '&total_amount=' + this.totalAmtOfTicket;
    var ticketSubmit = {
      purchaseDateTime: new Date(),
      selectedDtos: this.ticketArr,
      totalAmtOfTicket: this.totalAmtOfTicket,
      nextDrawId : this.sessionData.nextDrawId
    }

    this.apiService.postApi(this.appConstants.submitTicketUrl, ticketSubmit).subscribe(
      (result) => {
        // console.log(JSON.stringify(result));
        if (result.status === 200) {

          if (result != null) {

            const code = '' + result.body.ticketNo;
            this.calculateTotal(result.body.ticketNo);
            this.showConfirmTicketDialog = false;

            /** Print Ticket Data */

            let bets = '';
            let totalAmt = 0;
            // tslint:disable-next-line: max-line-length
            const drawDateTime = this.dateFunction.convertStringDate(this.utility.convertNoIntoDate(this.sessionData.nextDrawId), 'dd-MM-yyyy hh:mm a');

            /** Make String of Number and corresponding entered amount
             * and calculate total Amount
             */
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.ticketArr.length; i++) {
              bets = bets + 'Number:' + this.utility.ticketNo(this.ticketArr[i].num) + ' Amount:' + this.ticketArr[i].amount + '\n';
              // tslint:disable-next-line: radix
              totalAmt = totalAmt + parseInt(this.ticketArr[i].amount);
            }


            // convenience method
            // tslint:disable-next-line: only-arrow-functions
            const chr = function (n) { return String.fromCharCode(n); };
            const barcode = '\x1D' + 'h' + chr(80) +   // barcode height
              '\x1D' + 'f' + chr(0) +              // font for printed number
              '\x1D' + 'k' + chr(69) + chr(code.length) + code + chr(0); // code39

            /*  const data = ['KuberLaxmi Lottery(Pune)\n',
               'Four Digit Online Weekly\n',
               'Dr. ' + drawDateTime + '\n',
               bets,
               'Qty : ' + this.ticketArr.length + ' Total : Rs. ' + totalAmt + '\n',
               'Ticket No. :' + result.ticket_no + '\n',
               barcode + '\n\n\n'
             ]; */

            const ticketDetails = '\x1B' + '\x45' + '\x0D' + 'KuberLaxmi Lottery(Pune)\n' + '\x1B' + '\x45' + '\x0A'
              + 'Four Digit Online Weekly\n'
              + 'Dr. ' + drawDateTime + '\n'
              + '\x1D' + '\x21' + '\x01' + bets + '\x1D' + '\x21' + '\x00'
              + 'Qty : ' + this.ticketArr.length + ' Total : Rs. ' + totalAmt + '\n'
              + '\x1B' + '\x45' + '\x0D' + 'Ticket No. :' + code + '\n' + '\x1B' + '\x45' + '\x0A'
              + barcode + '\n\n';

            const data = [
              ticketDetails + '\n'
            ];

            this.printTicket(data);

            this.getAgentData(false);
            this.resetFields();
            // this.alertDialogs.alertDialog('', result.message);

          } else {
            this.alertDialogs.alertDialog('', result.message);
          }

        } else if (result.status === 404) {
          /** If sataus 0 then logout the user */
          this.utility.setSessionObject(null);
          this.navController.navigateRoot('/login');
          // this.alertDialogs.alertDialog('', result.message);
        } else {
          this.alertDialogs.alertDialog('', result.message);
        }
      }
    );


  }

  async getLastFiveTickets() {

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

    const postData = 'agent_id=' + this.sessionData.data.id + '&agent_machine_id=' + this.sessionData.machine_id
      + '&ticket_no=' + '';

    // Clear array
    this.lastFiveTicketArr = [];
    this.isShowLastFiveTicketModel = false;

    this.apiService.postApi(this.appConstants.getLastFiveTicketsUrl, postData).subscribe(
      (result) => {
        // console.log(JSON.stringify(result));
        if (result.status === '1') {

          if (result.data != null) {

            this.lastFiveTicketArr = result.data;
            this.isShowLastFiveTicketModel = true;
          } else {
            this.alertDialogs.alertDialog('', result.message);
          }

        } else {
          this.alertDialogs.alertDialog('', result.message);
        }
      }
    );


  }

  async getLastTwentyTickets() {

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



  //  const postData = 'agent_id=' + this.sessionData.data.id + '&agent_machine_id=' + this.sessionData.machine_id;


    this.apiService.getApiWithoutProgress(this.appConstants.getLastResultsUrl).subscribe(
      (result) => {
        // console.log(JSON.stringify(result));
        if (result.status === 200) {

          if (result.body != null) {
            // this.alertDialogs.alertDialog('', result.message);
            this.lastRecordsArr = result.body;
          } else {
            // this.alertDialogs.alertDialog('', result.message);
          }

        } else {
          // this.alertDialogs.alertDialog('', result.message);
        }
      }
    );


  }

  async getTicketDetails() {

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

    if (this.utility.checkStringNullEmpty(this.barcodeNo)) {
      return;
    }

    // Hide ticket details dialog
    this.showTicketDetailsDialog = false;

    const postData = 'agent_id=' + this.sessionData.data.id + '&agent_machine_id=' + this.sessionData.machine_id
      + '&ticket_no=' + this.barcodeNo;


    this.apiService.postApi(this.appConstants.getTicketDetailsUrl, postData).subscribe(
      (result) => {
        // console.log(JSON.stringify(result));
        if (result.status === '1') {

          /** Clear barcode no */
          this.barcodeNo = '';

          if (result.data.length > 0) {

            // Show result dialog
            this.showResultDetails = true;

            const data = result.data[0];
            // tslint:disable-next-line: radix
            if (!this.utility.checkStringNullEmpty(data.winning_amount) && parseInt(data.winning_amount) > 0) {

              this.isUserWin = true;
              this.winingAmount = data.winning_amount;

              /** Play winnig sound */
              /*this.nativeAudio.play('winning_sound').then(() => {
                // console.log('success playing');
              }, (error) => {
                console.log(error);
              });*/
              this.winningSound.play();

            } else {
              this.isUserWin = false;
            }

            this.getAgentData(false);
            // this.alertDialogs.alertDialog('', result.message);
          } else {
            this.alertDialogs.alertDialog('', result.message);
          }

        } else {
          /** Clear barcode no */
          this.barcodeNo = '';

          this.alertDialogs.alertDialog('', result.message);
        }
      }
    );


  }

  async getAgentData(isCallSetTimeOut: boolean) {

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


    /** Get last 20 records */
    this.getLastTwentyTickets();
    this.showSubmitButton = true;
    this.showRefreshButton = true;

    // const postData = 'agent_id=' + this.utility.getSessionObject().data.id
    //   + '&agent_machine_id=' + this.sessionData.machine_id
    //   + '&agent_machine_name=' + this.sessionData.machine_name;

    this.apiService.getApiWithoutProgress(this.appConstants.getAgentDataUrl).subscribe(
      (result) => {
        if (result.status === 200) {

          if (result.body != null) {
            this.utility.setSessionObject(result.body);
            this.sessionData = this.utility.getSessionObject();

            const currentDateTime = this.utility.convertNoIntoDate(result.body.currentDateTime);
            const drawDateTime = this.utility.convertNoIntoDate(result.body.nextDrawId);
            console.log('currentDateTime ::::', currentDateTime);
            console.log('drawDateTime ::::', drawDateTime);

            setInterval(() => {
              this.time = this.datePipe.transform(new Date(), 'hh:mm:ss a');
            }, 1000);

            const remainingTimeInSec = this.utility.twoDateDiffInSeconds(currentDateTime, drawDateTime);
            console.log('diffInSec ::::', remainingTimeInSec);


            if (isCallSetTimeOut && remainingTimeInSec > 0) {

              /** Clear timeouts first */
              if (this.timeouts.length > 0) {
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < this.timeouts.length; i++) {
                  clearTimeout(this.timeouts[i]);
                }
                // quick reset of the timer array you just cleared
                this.timeouts = [];

              }


              /** Hide Submit button 15 sec before draw time */
              if (remainingTimeInSec > 15) {

                this.timeouts.push(
                  setTimeout(() => {
                    console.log('Hide Submit Button & Confirm ticket dialog');
                    this.showSubmitButton = false;
                    this.showConfirmTicketDialog = false;

                    this.showRefreshButton = false;
                    if (!this.showRefreshButton) {

                      this.timeouts.push(
                        setTimeout(() => {
                          console.log('Show Refresh Button');
                          this.showRefreshButton = true;
                        }, (remainingTimeInSec + 3) * 1000));

                    }


                  }, (remainingTimeInSec - 15) * 1000));

              } else {
                console.log('Hide Submit Button & Confirm ticket dialog');
                this.showSubmitButton = false;
                this.showConfirmTicketDialog = false;

                this.showRefreshButton = false;
                if (!this.showRefreshButton) {

                  this.timeouts.push(
                    setTimeout(() => {
                      console.log('Show Refresh Button');
                      this.showRefreshButton = true;
                    }, (remainingTimeInSec + 3) * 1000));

                }

              }

              /** Play alert song 10 sec before draw time */
              if (remainingTimeInSec > 10) {

                this.timeouts.push(
                  setTimeout(() => {
                    console.log('Play alert');
                    this.alertSound.play();

                  }, (remainingTimeInSec - 10) * 1000));

              } else if (remainingTimeInSec < 10) {
                console.log('Play alert');
                this.alertSound.play();
              }
              this.timeouts.push(
                setTimeout(() => {

                  /** Stop alert */
                  console.log('Get Wining no');
                  this.getWinningNo();

                  // tslint:disable-next-line: radix
                }, (remainingTimeInSec - 15) * 1000));

            }

          } else {
            // this.alertDialogs.alertDialog('', result.message);
          }

        } else if (result.status === '0') {
          /** If sataus 0 then logout the user */
          this.utility.setSessionObject(null);

          /** Clear timeouts first */
          if (this.timeouts.length > 0) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.timeouts.length; i++) {
              clearTimeout(this.timeouts[i]);
            }
            // quick reset of the timer array you just cleared
            this.timeouts = [];

          }

          this.navController.navigateRoot('/login');
          // this.alertDialogs.alertDialog('', result.message);
        } else {
          // this.alertDialogs.alertDialog('', result.message);
        }
      }
    );


  }

  async getWinningNo() {

    // await this.delay(4000);
    // Show wheel Page
    /*  this.isShowWheelModel = true;
     this.wheelImage = './assets/wheel/1.png'; */

    /** If Ticket Details Dialog is open then hide it at the time of Draw */
    this.showTicketDetailsDialog = false;

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

    const postData = 'drawId=' + this.sessionData.nextDrawId;

    this.apiService.getApiWithoutProgress(this.appConstants.getWinningNoUrl+"?"+postData).subscribe(
      async (result) => {
        // console.log(JSON.stringify(result));
        if (result.status === 200) {


          // tslint:disable-next-line: radix
          const winnningNo = result.body.winningNo;
          console.log('winnningNo ::::', winnningNo);

          if (this.utility.checkStringNullEmpty(winnningNo)) {
            this.getWinningNo();
            return;
          }

          // Show wheel Page
          this.isShowWheelModel = true;
          // this.wheelImage = './assets/wheel/1.png';
          this.alertSound.stop();
          this.wheelSound.play();

          const myWheel = new Winwheel({
            numSegments: 10,         // Number of segments
            textFontSize: 38,        // Font size.
            textOrientation: 'vertical',
            textFillStyle: '#ffffff',
            segments:            // Definition of all the segments.
              [
                { fillStyle: '#008a00', text: '1' },
                { fillStyle: '#1ba1e2', text: '2' },
                { fillStyle: '#6a00ff', text: '3' },
                { fillStyle: '#aa00ff', text: '4' },
                { fillStyle: '#d80073', text: '5' },
                { fillStyle: '#fa6800', text: '6' },
                { fillStyle: '#825a2c', text: '7' },
                { fillStyle: '#647687', text: '8' },
                { fillStyle: '#76608a', text: '9' },
                { fillStyle: '#87794e', text: '0' }
              ],
            animation:               // Definition of the animation
            {
              type: 'spinToStop',
              duration: 10,
              spins: 10,
              //  callbackFinished: alertPrize
            }
          });

          // tslint:disable-next-line: radix
          const stopAt = this.appConstants.wheelNoArr[parseInt(winnningNo)];

          // tslint:disable-next-line: radix
          /*  if (parseInt(winnningNo) === 0) {
             stopAt = myWheel.getRandomForSegment(10);
           } else {
             // tslint:disable-next-line: radix
             stopAt = this.appConstants.wheelNoArr[parseInt(winnningNo)];
             // stopAt = myWheel.getRandomForSegment(parseInt(winnningNo));
           } */

          // this.alertDialogs.alertDialog('Stop at ', stopAt + '  Win no ' + winnningNo);

          // Important thing is to set the stopAngle of the animation before stating the spin.
          myWheel.animation.stopAngle = stopAt;
          myWheel.startAnimation();
          // this.wheelSound.stop();

          setTimeout(() => {
            this.wheelSound.stop();
          }, (5000));


          this.resetFields();
          this.appConstants.totalDrawAmountArr = [];
          this.totalDrawAmt = 0;
          setTimeout(() => {
            console.log('Hide Wheel Screen');
            this.isShowWheelModel = false;
            this.getAgentData(true);
          }, (17000));

        } else {
          // this.alertDialogs.alertDialog('', result.message);\

          this.resetFields();
          this.appConstants.totalDrawAmountArr = [];
          this.totalDrawAmt = 0;
          setTimeout(() => {
            console.log('Hide Wheel Screen');
            this.isShowWheelModel = false;
            this.getAgentData(true);
          }, (50));
          // setTimeout(() => this.getAgentData(true), 5 * 1000);
        }
      }
    );


  }

  async cancelTicketByUser(ticketNo: any) {

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

    const postData = 'agent_id=' + this.sessionData.data.id
      + '&agent_machine_id=' + this.sessionData.machine_id
      + '&ticket_no=' + ticketNo;


    this.apiService.postApi(this.appConstants.cancelTicketUrl, postData).subscribe(
      (result) => {
        // console.log(JSON.stringify(result));
        if (result.status === '1') {

          // this.alertDialogs.alertDialog('', result.message);
          /** Get agent data */
          this.getAgentData(false);
        } else {
          this.alertDialogs.alertDialog('', result.message);
        }
      }
    );


  }

  async logout() {

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


    const postData = 'agent_machine_id=' + this.sessionData.machineId;


    // this.apiService.postApi(this.appConstants.logoutUrl, postData).subscribe(
    //   (result) => {
    //     if (result.status === 200) {
          this.utility.setSessionObject(null);
          
          /** Clear timeouts first */
          if (this.timeouts.length > 0) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.timeouts.length; i++) {
              clearTimeout(this.timeouts[i]);
            }
            // quick reset of the timer array you just cleared
            this.timeouts = [];

          }

          this.navController.pop();
          this.navController.navigateRoot('\login');
          setInterval(() => {
          }, 0);
        // } else {
        //   // this.alertDialogs.alertDialog('', result.message);\
        // }
    //  }
  //  );


  }

}
