import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HomePage } from '../home/home';

/**
 * Generated class for the ScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html',
})
export class ScannerPage {
  [x: string]: any;
  alertMsg:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams,  private barcodeScanner: BarcodeScanner,  public dbService:DbserviceProvider, public translate :TranslateService, public alertCtrl:AlertController,) {
  this.scanQr();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScannerPage');
  }

  showSuccessPoint(text)
  {
      this.translate.get(text)
      .subscribe(resp=>{
          this.text = resp;
      })
      this.translate.get('Success!')
      .subscribe(resp=>{
          this.sucess = resp;
      })
      this.translate.get('Scan More')
      .subscribe(resp=>{
          this.scan_more = resp;
      })
      this.translate.get('Ok')
      .subscribe(resp=>{
          this.ok = resp;
      })
      let alert = this.alertCtrl.create({
          title: this.sucess,
          cssClass:'sucess-alert',
          message: `<img src="assets/imgs/sucess.gif"  alt="sucess">`,
          enableBackdropDismiss:false,
          subTitle: this.text,
          buttons: [ {
              text: this.scan_more,
              //   role: 'cancel',
              handler: () => {
                  this.scanQr();
              }
          },
          {
              text: this.ok,
              handler: () => {
                this.navCtrl.setRoot(HomePage);
                  
              }
          }
      ]
      
      
  });
  alert.present();
}


  showAlert(text, alertTilte, img )
  {
      this.translate.get("OK")
      .subscribe(resp=>{
          this.ok = resp;
      })
      
      let alert = this.alertCtrl.create({
          title:alertTilte,
          cssClass:'alert-alert',
          message: img,
          enableBackdropDismiss:false,
          subTitle: text,
          buttons: [
              {
                  text: 'Scan Again',
                  role: 'cancel',
                  handler: () => {
                      this.scanQr();
                  }
              },
              {
                  text: this.ok,
                  handler: () => {
                    this.navCtrl.setRoot(HomePage);
                  }
              }
          ]
          // buttons: ['OK']
      });
      alert.present();
  }


  // showSuccess(text)
  //       {
  //           let alert = this.alertCtrl.create({
  //               title:'Success!',
  //               cssClass:'action-close',
  //               enableBackdropDismiss:false,
  //               subTitle: text,
  //               buttons: [ {
  //                   text: 'Scan More',
  //                   //   role: 'cancel',
  //                   handler: () => {
  //                       this.scanQr();
  //                   }
  //               },
  //               {
  //                   text: 'Okay',
  //                   handler: () => {
  //                       this.navCtrl.setRoot(HomePage);
  //                   }
  //               }
  //           ]
  //           });
  //           alert.present();
  //       }
  


  scanQr() {
    this.translate.get("Oops! You have scanned an incorrect product code. This may not be a valid QR code.")
    .subscribe(resp=>{
        this.invalid = resp;
    })
    this.translate.get("INVALID")
    .subscribe(resp=>{
        this.invalid1 = resp;
    })
    this.translate.get("Coupon Already Used")
    .subscribe(resp=>{
        this.USED = resp;
    })
    this.translate.get("points has been added into your wallet")
    .subscribe(resp=>{
        this.point_add = resp;
    })
    this.barcodeScanner.scan().then(resp => {
      console.log(resp);
      this.qr_code=resp.text;
      console.log( this.qr_code);
      if(resp.text != '')
      {
          this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'qr_code':this.qr_code},'app_karigar/karigarCoupon', this.dbService.rootUrl)
          .subscribe((r:any)=>
          {
              console.log(r);
              
              if(r['status'] == 'INVALID'){
                  this.translate.get("Invalid Coupon Code")
                  this.showAlert('' , this.invalid1, `<img src="assets/imgs/cancel.gif"  alt="cancel"> <p>${this.invalid}</p>`);
                  return;
              }
              else if(r['status'] == 'USED'){
                  this.alertMsg.scan_date=r.scan_date;
                  this.alertMsg.karigar_data=r.karigar_data;
                  this.alertMsg.scan_date = moment(this.alertMsg.scan_date).format("D-M-Y");
                  this.translate.get("Coupon Already Used")
                  this.showAlert( `<img src="assets/imgs/alert.gif"  alt="alert">`,this.USED+ '' + '','' );
                  return;
              }
              else if(r['status'] == 'UNASSIGNED OFFER'){
                  this.translate.get("Your Account Under Verification")
                  .subscribe(resp=>{
                      this.showAlert(resp, this.UNASSIGNED, `<img src="assets/imgs/alert.gif"  alt="alert">`);
                      // setTimeout(() => {
                      //     this.scan(); 
                      // }, 2000);
                      
                  })
                  return;
              }
              else if(r['status'] == 'REQUIRED'){
                  this.showSecondAlert("Please Enter the coupon code");
                  return;
              }
              
              else if(r['status'] == 'VALID'){
                  this.translate.get(" point  have been added into your wallet")
                  .subscribe(resp=>{
                      this.showSuccessPoint( r['coupon_value'] + ' ' + resp);
                      // setTimeout(() => {
                      //     this.scan(); 
                      // }, 2000);
                  })
                  
              }
              
          });
      }
      else
      {
          console.log('not scanned anything');
      }
  });
    
    
    
    
}

}
