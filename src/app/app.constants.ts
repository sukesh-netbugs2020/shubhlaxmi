import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants {

    // Label
    operatorId = 'Operator Id';
    password = 'Password';
    submit = 'Submit';
    login = 'Login';
    update = 'Update';
    confirmAndPrint = 'Confirm And Print';
    print = 'Print';
    centerName = 'Center Name';
    drawDateTime = 'Draw Date Time';
    drawTime = 'Draw Time';
    date = 'Date';
    drawPurchaseTime = 'Draw Purchase Time';
    quantity = 'Quantity';
    selectedNo = 'Selected No';
    amount = 'Amount';
    total = 'Total';
    cancel = 'Cancel';
    reprint = 'Reprint';
    barcodeNo = 'Barcode Number';
    ticketNo = 'Ticket No / Barcode Scanner';
    ok = 'OK';
    opps = 'Oops';
    betterLuck = 'Better luck next time!';
    drawId = 'Draw Id';
    machineIdLabel = 'Machine Id';
    totalSale = 'Total Sale';
    winPoint = 'Win Point';
    winNumber = 'Win Number';
    agentShare = 'Agent Share';
    agentAmt = 'Agent Amount';
    netAmt = 'Net Amount';
    plAmt = 'PL Amount';
    companyAmt = 'Company Amount';
    srNo = 'Sr No.';
    toDate = 'To Date';
    fromDate = 'From Date';
    cancelTicketNo = 'Cancel Ticket No.: ';
    time = 'Time';
    billingNo = 'Billing No.';
    winningNo = 'Winning No.';
    machineAmt = 'Machine Amt';
    commission = 'Commission';

    // Hint
    enterOperatorId = 'Enter Your Operator Id';
    enterPassword = 'Enter Your Password';
    enterBarcodeNo = 'Enter Barcode No/Ticket No.';
    enterMachineKey = 'Enter Your Machine Key';
    negativeValueNotAllowed = 'Negative Value Not Allowed';
    zeroEntered = 'Zero Amount Not Allowed';


    // Msg
    checkInternet = 'Please check internet connction';
    cancelTicketMsg = 'Are you sure you want to cancel ticket?';

    // Url
    loginUrl = 'auth/login';
    getAgentDataUrl = 'machine/getMachineData';
    submitTicketUrl = 'ticket/ticketSubmit';
    getLastFiveTicketsUrl = 'ticket/getLastFiveTickets';
    getLastResultsUrl = 'result/getTop16ResultByDate';
    getTicketDetailsUrl = 'ticket/getTicketDetails';
    getReportsUrl = 'getReports';
    getReportsPrintUrl = 'getReportsPrint';
    getWinningNoUrl = 'result/getWinningNumber';
    logoutUrl = 'logout';
    cancelTicketUrl = 'ticket/cancelTicket';
    getMachineForAgentUrl = 'getMachineForAgent';
    getResultsByDatesUrl = 'result/getResultsByDates';
    getReportByDatesUrl = 'transaction/getReportByDates';
    getTransactionsByDatesUrl = 'transaction/getTransactionByDates'


    // Key
    loginSessionKey = 'LoginSession';


    // Arrays
    totalDrawAmountArr = [];
    wheelNoArr = [343, 20, 52, 92, 125, 163, 199, 235, 270, 305];
    // wheelNoArr = ['221', '200', '380', '361', '341', '321', '301', '281', '261', '241'];

    globalCalendarObject: any = {
        // inputDate: new Date('2018-08-10'), // default new Date()
        // fromDate: new Date('2016-12-08'), // default null
        toDate: new Date(), // default null
        showTodayButton: false, // default true
        // closeOnSelect: true, // default false
        // disableWeekDays: [4], // default []
        // mondayFirst: true, // default false
        setLabel: 'OK',  // default 'Set'
        // todayLabel: 'T', // default 'Today'
        // closeLabel: 'C', // default 'Close'
        // disabledDates: this.disabledDates, // default []
        titleLabel: 'Select To Date', // default null
        monthsList: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        weeksList: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        dateFormat: 'YYYY-MM-DD', // default DD MMM YYYY
        clearButton: false, // default true
        momentLocale: 'pt-BR', // Default 'en-US'
        yearInAscending: true, // Default false
        // btnCloseSetInReverse: true, // Default false
        btnProperties: {
            expand: 'block', // Default 'block'
            fill: '', // Default 'solid'
            size: '', // Default 'default'
            disabled: '', // Default false
            strong: '', // Default false
            color: '' // Default ''
        },
        arrowNextPrev: {
            nextArrowSrc: 'assets/images/arrow_right.svg',
            prevArrowSrc: 'assets/images/arrow_left.svg'
        } // This object supports only SVG files.
    };

}
