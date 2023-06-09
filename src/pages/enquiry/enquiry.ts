import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, Loading, ModalController  } from 'ionic-angular';
// LoadingController
// import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-enquiry',
  templateUrl: 'enquiry.html',
})
export class EnquiryPage {
  contactDetails:any={};
  loading:Loading;
  today_date:any;
  product_id;

  constructor(public dbService:DbserviceProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl:AlertController,
              public actionSheetController: ActionSheetController,
              public modalCtrl: ModalController,
              // private storage:Storage
              ) {
    // this.data.gender="male";
    this.today_date = new Date().toISOString().slice(0,10);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnquiryPage');
    this.product_id = this.navParams.get('id');
   this.contactDetails.customerName = this.dbService.userStorageData.first_name;
   this.contactDetails.customerMobileNo = this.dbService.userStorageData.mobile_no;
  }

  submit()
  {

    this.contactDetails.product_id = this.product_id;
    this.dbService.onPostRequestDataFromApi({'contactDetails' : this.contactDetails},'app_karigar/enquiryForProduct', this.dbService.rootUrl).subscribe( result =>
      {
        console.log(result);
        // this.loading.dismiss();

        if(result['status'] == 'Product Enquiry successfully.')
        {
              console.log('enquiry');

              this.showSuccess("Your Enquiry mail has been successfully sent");
              this.navCtrl.setRoot(HomePage);
              // this.navCtrl.push(ProductsPage);
        }
      });

  }

  namecheck(event: any)
  {
    const pattern = /[A-Z\+\-\a-z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar))
    {event.preventDefault(); }
  }
  showAlert(text) {
    let alert = this.alertCtrl.create({
      title:'Alert!',
      cssClass:'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();

  }

  showSuccess(text)
  {
    let alert = this.alertCtrl.create({
      title:'ThankYou!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
