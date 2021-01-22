import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/app.constants';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { NavController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { NetworkProviderService } from 'src/app/utility/network-provider.service';
import { Events } from '@ionic/angular';
import { ApiService } from 'src/app/utility/api.service';
import { ActivatedRoute } from '@angular/router';
import { AlertDialogs } from 'src/app/utility/alert-dialogs';
import { Storage } from '@ionic/storage';
import { Utility } from 'src/app/utility/utility';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_model/user';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [NetworkProviderService,
    Network
  ]
})
export class LoginPage implements OnInit {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public operatorId;
  public user:any ={
  };
  public showLogin = false;

  constructor(public appConstants: AppConstants,
              public navController: NavController,
              public network: Network,
              public events: Events,
              public networkProvider: NetworkProviderService,
              public authService: AuthService,
              private route: ActivatedRoute,
              public apiService: ApiService,
              private alertDialogs: AlertDialogs,
              private utility: Utility) {
                this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
                this.currentUser = this.currentUserSubject.asObservable();
               }

  ngOnInit() {
    if (this.utility.getSessionObject() !== null) {
      this.navController.navigateRoot('/home');
    }
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  async showLoginWindow() {
    this.showLogin = true;
  }

  closeLoginWindow() {
    this.showLogin = false;
  }


  // **************** Call api *****************
  async login() {

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


    // Validation
    /* if (this.utility.checkStringNullEmpty(this.operatorId)) {
      this.alertDialogs.alertDialog('', this.appConstants.enterOperatorId);
      return;
    } */

    if (this.utility.checkStringNullEmpty(this.user.userName)) {
      this.alertDialogs.alertDialog('', this.appConstants.enterMachineKey);
      return;
    }


    if (this.utility.checkStringNullEmpty(this.user.password)) {
      this.alertDialogs.alertDialog('', this.appConstants.enterPassword);
      return;
    }

   
    /* const postData = {
      username: 'agent1',
      password: 'mahesh',
      ipaddress: '1'
    }; */

   // const postData = 'password=' + this.password + '&machine_key=' + this.machineKey;

    this.apiService.postApi(this.appConstants.loginUrl, this.user).subscribe(
      (result) => {
        console.log(JSON.stringify(result));
        if (result.status === 200) {

          if (result.body != null) {
            this.utility.setSessionObject(result);
            localStorage.setItem('currentUser', JSON.stringify(result.body));
            this.utility.setSessionObject(result.body);
            this.authService.currentUserSubject.next(result.body);
            this.navController.pop();
            this.navController.navigateRoot('/home');
          } else {
            this.alertDialogs.alertDialog('', result.message);
          }

        } else {
          this.alertDialogs.alertDialog('', result.message);
        }
      }
    );


  }


}
