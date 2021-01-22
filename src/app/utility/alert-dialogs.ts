import { AlertController, ModalController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AlertDialogs {
    constructor(public alertCtrl: AlertController,
                public navCtrl: NavController) { }

    // Close window on click success
    async successAlert(headerTxt: any, msg: any) {

        const alert = await this.alertCtrl.create({
            header: headerTxt,
            message: msg,
            buttons: [
                {
                    text: 'Ok',
                    handler: async () => {
                        this.navCtrl.back();
                    }
                }
            ]
        });

        await alert.present();
    }



    // alert dialog
    async alertDialog(headerTxt: any, msg: any) {

        const alert = await this.alertCtrl.create({
            header: headerTxt,
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }
}


