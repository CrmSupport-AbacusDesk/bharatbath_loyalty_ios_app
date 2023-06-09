import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-news-detail',
  templateUrl: 'news-detail.html',
})
export class NewsDetailPage {
  news_id:any='';
  news_detail:any={};
  loading:Loading;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController,
              private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsDetailPage');
    this.news_id = this.navParams.get('id');
    this.getNewsDetail(this.news_id);
    this.dbService.presentLoading();
  }

  getNewsDetail(news_id)
  {
    this.dbService.onPostRequestDataFromApi({'news_id' :news_id},'app_master/newsDetail', this.dbService.rootUrl).subscribe( r =>
      {
        console.log(r);
        this.dbService.onDismissLoadingHandler();
        this.news_detail=r['news'];
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
