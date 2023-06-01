import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { TermsPage } from '../terms/terms';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { GiftDetailPage } from '../gift-gallery/gift-detail/gift-detail';

@IonicPage()
@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {
  offer_id:any='';
  offer_detail:any={};
  gift_list:any='';
  balance_point:any='';
  loading:Loading;
  offer_balance:any='';
  total_balance:any;
  url:string='';


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController,
              private app : App) {
              this.url = dbService.upload_url3  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OffersPage');
    this.dbService.presentLoading();
    this.offer_id=this.navParams.get('id')
    this.getofferDetail(this.offer_id);
  }

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    this.getofferDetail(this.offer_id);
    refresher.complete();
  }

  goOntermsPage(id,action){
    this.navCtrl.push(TermsPage, {'id':id,'mode':action});
  }

  goOnGiftDetail(id){
    console.log(id);
  	this.navCtrl.push(GiftDetailPage,{'id':id})
  }

  goOnGiftDetail1(){
    // console.log(id);
  	this.navCtrl.push(GiftDetailPage)
  }

  toInt(i){
    console.log(i);

    return parseInt(i);
  }

  getofferDetail(offer_id)
  {
   console.log(offer_id);
   this.dbService.onPostRequestDataFromApi({'offer_id':offer_id,'karigar_id':this.dbService.userStorageData.id},'app_karigar/offerDetail', this.dbService.rootUrl).subscribe(r=>
    {
      console.log(r);
      this.dbService.onDismissLoadingHandler();
      this.offer_detail=r['offer'];
      // this.offer_balance=parseInt(r['gift'][0].offer_balance);
      this.total_balance = r.karigar.total_balance
      this.gift_list=r['gift'];
      this.balance_point=parseInt(r['karigar'].balance_point + parseInt(r['karigar'].reg_points));
      // for gift active class
      for (let i = 0; i < this.gift_list.length; i++)
      {
        this.gift_list[i].coupon_points = parseInt( this.gift_list[i].coupon_points);
      }
      // end
    });
  }
 
  ionViewDidLeave()
  {
   let nav = this.app.getActiveNav();
   if(nav && nav.getActive())
   {
       let activeView = nav.getActive().name;
       let previuosView = '';
       if(nav.getPrevious() && nav.getPrevious().name)
       {
          previuosView = nav.getPrevious().name;
       }
       console.log(previuosView);
       console.log(activeView);
       console.log('its leaving');
       if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
       {

           console.log(previuosView);
           this.navCtrl.popToRoot();
       }
   }
   }
}
