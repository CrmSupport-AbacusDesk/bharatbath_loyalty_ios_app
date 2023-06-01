import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import {  PulmberCustomerDetailPage } from '../../plumber-camplaints/pulmber-customer-detail/pulmber-customer-detail';
import * as moment from 'moment/moment';

/**
* Generated class for the MyCamplaintsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-my-camplaints',
  templateUrl: 'my-camplaints.html',
})
export class MyCamplaintsPage {
  complaint_list : any=[];
  loading:Loading;
  filter:any={}
  complaint_count:any = '';
  flag:any='';
  data:any={};
  close_com:any;
  complaint: string = "Pending";
  datePipe:any =''
  
  
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dbService:DbserviceProvider,
    public loadingCtrl:LoadingController) {
      this.data.type = this.navParams.get('type');
      this.datePipe = moment().format('YYYY-MM-DD');
    }
    
    ionViewDidLoad() {
      this.dbService.presentLoading();
      this.getComplaintlist(this.data.type,this.complaint);
      this.filter.status='';

    }
    
    
    
    doRefresh(refresher, complaint)
    {
      this.getComplaintlist(this.data.type, complaint);
      refresher.complete();
    }
    
    getComplaintlist(type, complaint)
    {
      this.data.type =type;
      // this.dbService.presentLoading();
      this.flag=0;
      this.filter.status = complaint;
      
      
      this.filter.limit = 0;
      this.dbService.onPostRequestDataFromApi( {'plumber_id':this.dbService.userStorageData.id,'filter':this.filter,type:this.data.type },'app_karigar/getPlumberComplaintList', this.dbService.rootUrl).subscribe(response =>
        {
          this.dbService.onDismissLoadingHandler();
          this.complaint_list = response['plumberComplaintList'];
          this.complaint_count =response['complaint_count'];
        });
      }
      
      loadData(infiniteScroll)
      {
        console.log('loading');
        
        this.filter.limit=this.complaint_list.length;
        this.dbService.onPostRequestDataFromApi({'plumber_id':this.dbService.userStorageData.id,'filter' : this.filter, type:this.data.type},'app_karigar/getPlumberComplaintList', this.dbService.rootUrl).subscribe( r =>
          {
            console.log(r);
            if(r['plumberComplaintList']=='')
            {
              this.flag=1;
            }
            else
            {
              setTimeout(()=>{
                this.complaint_list=this.complaint_list.concat(r['plumberComplaintList']);
                console.log('Asyn operation has stop')
                infiniteScroll.complete();
              },1000);
            }
          });
        }
        
        
        plumberDetail(id)
        {
          this.navCtrl.push( PulmberCustomerDetailPage,{'id':id,'close_com':false});
          // for (let i = 0; i < this.complaint_list.length; i++) {
          //   if(this.complaint_list[i].complaintId == this.data.complaint){
          //     if(this.complaint_list[i].complaint_type == "service"){
          //       this.navCtrl.push(PulmberCustomerDetailPage,{type:'service', 'id':this.complaint_list[i].complaintId, 'close_com':false});
          //       // this.checkin(this.complaint_list[i].complaintId);
          //     }
          //     // else if(this.complaint_list[i].complaint_type == "service"){
          //     //     this.navCtrl.push(PulmberCustomerDetailPage,{type:'service', 'id':this.complaint_list[i].complaintId, 'close_com':true});
          //     //     this.checkin(this.complaint_list[i].complaintId);
          //     // }
          //     else{
          //       this.navCtrl.push(PulmberCustomerDetailPage,{type:'installation', 'id':this.complaint_list[i].complaintId, 'close_com':false});
          //       // this.checkin(this.complaint_list[i].complaintId);
          //     }
          
          //   }
          // }
        }

        
        dateFormat(date){
          return this.dbService.changeDateFormat(date)
          // return moment(date).format('YYYY-MM-DD');
        }
        
      }
      