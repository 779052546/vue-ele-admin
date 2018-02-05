<template>
  <div class="app">
    <el-row class="header"><h3>生日提醒</h3></el-row>
    <el-row class="section" v-if="!power">
      <el-card :body-style="{ padding: '0px' }">
        <img src="/static/img/timg.jpg" class="image">
        <div style="padding: 14px;">
          <span>{{birthdayId.name}}</span>
          <div class="bottom clearfix">
            <time class="time">生日：{{ birthdayId.birthday | Birthday}}</time>
          </div>
        </div>
      </el-card>
    </el-row>
    <el-row class="section" v-if="power">
      <p style="min-width: 370px;">生日月份<el-select v-model="date" placeholder="选择月份"><el-option v-for="item in 12" :key="item" :value="item" :label="item+'月'"></el-option></el-select><el-button type="primary" @click="getWorkbirthday">查询</el-button></p>
      <div v-for="(item, index) in tableData" :key="item.id" :offset="index > 0 ? 2 : 0">
          <el-card :body-style="{ padding: '0px' }">
            <img src="/static/img/timg.jpg" class="image">
            <div style="padding: 14px;">
              <span>{{item.name}}</span>
              <div class="bottom clearfix">
                <time class="time">生日：{{ item.birthday | Birthday}}</time>
              </div>
            </div>
          </el-card>
        </div>
      <p v-if="isBirthday">该月暂无同事过生日</p>
    </el-row >
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getWorkbirthday1,getWorkbirthdayId} from '../api'
  export default {
    name: 'app',
    data() {
      return {
        tableData:[],

        birthdayId:'',

        power:false,

        date:'',  //月份
        isBirthday:false  //若当月无人生日
      };
    },
    created:function(){

      if(getCookie('power')==9999){
        this.date=this.chooseTime();
        this.power=true;
        this.getWorkbirthday()
      }else{
        this.power=false;
        this.getWorkbirthdayId();
      }
    },
    mounted: function () {

    },
    methods: {
      valueFormat:function(val){
        this.date=val;
      },
      chooseTime(){
        var val=new Date();
        var month=val.getMonth()+1;
        return month;
      },
      getWorkbirthday(){
        if(this.date<10){
          var birthday='0'+this.date;
        }else{
          var birthday=this.date;
        }
        let params = {birthday:birthday};
        getWorkbirthday1(params).then((res)=>{
         if(res.data.code==10000){
           this.isBirthday=false;
           this.tableData=res.data.data;
           var arr=[];
           for(var i=0;i<this.tableData.length;i++){
             if (this.tableData[i].birthday!=null){
               arr.push(this.tableData[i])
             }
           }
           this.tableData=arr;
         }else if(res.data.code==10001){
             this.isBirthday=true;
             this.tableData=[];
         }
        })
      },

      getWorkbirthdayId(){
        let params={id:getCookie('account')}
        getWorkbirthdayId(params).then((res)=>{
          this.birthdayId=res.data.data;
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .section>div{  width: 280px;  float: left;  margin-left:10px;  margin-bottom: 10px;}
  .section img{  width: 280px;  }
  .section{  padding: 50px;  }
  .el-button{  margin-left: 10px;  }
</style>
