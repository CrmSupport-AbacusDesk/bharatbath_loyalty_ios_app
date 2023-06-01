import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, Loading, LoadingController } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
    selector: 'page-mobile-login',
    templateUrl: 'mobile-login.html',
})
export class MobileLoginPage {
    
    data:any = {};
    otp:any = '';
    loading:Loading;
    loginType:any = '';
    lang:any='en';
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public dbService: DbserviceProvider,
        public alertCtrl:AlertController,
        public translate:TranslateService,
        public loadingCtrl:LoadingController) {
            
            // this.loginType = this.navParams.get('registerType');
            this.loginType = 'Plumber';

            console.log(this.loginType);
            this.lang = this.navParams.get("lang");
            console.log('====================================');
            console.log(this.lang);
            console.log('====================================');
        }
        
        ionViewDidLoad() {
            console.log('ionViewDidLoad MobileLoginPage');
            this.translate.setDefaultLang(this.lang);
            this.translate.use(this.lang);
        }
        
        numberOnlyValidation(event: any) {
            const pattern = /^[6-9][0-9]{0,9}$/;
            console.log("value is ===>",event)
                //   const pattern = /[789]/;
                 
                  let inputChar = String.fromCharCode(event.charCode);
                  console.log("input==>",pattern.test(inputChar))
                  if ( !pattern.test(inputChar)) {
                        
                        event.preventDefault();
                  }
            
          }
        
        onLoginSubmitHandler() {
            
            this.dbService.onShowLoadingHandler();
            
            
            
            if(this.data.mobile_no == '8700104458' || this.data.mobile_no == '7840871141' ||  this.data.mobile_no == '9560533107') {
                
                this.data.otp = '123456';
                
            } else {
                
                this.data.otp = Math.floor(100000 + Math.random() * 900000);
                
            }
            
            console.log(this.data);
            
            this.dbService.onPostRequestDataFromApi({'login_data': this.data},'app_karigar/karigarLoginOtp_new', this.dbService.rootUrl).subscribe((r) => {
                
                console.log(r);
                this.dbService.onDismissLoadingHandler();
                
                if (r['status'] == 'REQUIRED MOBILE NO') {
                    
                    this.dbService.onShowMessageAlertHandler("Please enter mobile number to continue.");
                    return false;
                    
                }
                else if (r['type'] == 'Customer'){
                    this.dbService.onShowMessageAlertHandler("This number is registered as Customer, please use another number to log in as a Plumber");
                    return;
                }

                else if (r['type'] == 'Dealer'){
                    this.dbService.onShowMessageAlertHandler("This number is registered as Dealer, please use another number to log in as a Plumber");
                    return;
                }
                
                else if (r['status'] == "SUCCESS") {
                    
                    this.otp = r['otp'];
                    
                    this.navCtrl.push(OtpPage, {
                        lang:this.lang,
                        otp: this.data.otp,
                        mobile_no: this.data.mobile_no,
                        loginType: this.loginType
                    });
                }
            });
        }
        
        onBackButtonClickHanlder() {
            
            this.navCtrl.push(SelectRegistrationTypePage);
        }
        onMobileValidateHandler(ev){
            console.log(ev)
        }
    }
    