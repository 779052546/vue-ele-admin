<template>
  <div class="app">
    <el-row class="header">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>打卡</h3></el-row>
    <el-row class="section">
      <p>每天八点半之前上班打卡</p>
      <el-button type="primary" :loading="loading" @click="submitForm" :disabled="isTrue"><span v-if="!isTrue">打卡 {{time}}</span><span v-if="isTrue">今日已打卡{{isTime}}</span></el-button>
    </el-row>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {postCheck,getCheckUser} from '../api'
  export default {
    name: 'app',
    data() {
      return {
        title:'添加',
        loading:false,
        time:'',
        date:'',   //打卡时间日期
        status:'',   //上班状态 1为正常打卡 0为迟到打卡
        isTrue:true,   //是否已打卡
        isTime:'',    //若已打卡,打卡时间
      };
    },
    created: function () {
      if(getCookie('account')==''){
        return false;
      }
      let date=this.chooseYearFullar();
      let params={date,uid:getCookie('account')};
      getCheckUser(params).then((res)=>{
          if(res.data.code==10000){
            this.isTrue=true;
            this.isTime=this.chooseTime1(res.data.data[0].date);
          }else{
            this.isTrue=false;
          }
      })
        .catch((err)=>{
          this.$message.error('网络异常,请稍后再试!');
        })
      var self = this;
      /**
       * 异步请求模拟
       */
      setInterval(function () {
        self.time=self.chooseTime();
      }, 100);
    },
    mounted: function () {

    },
    methods: {
      submitForm() {
        this.loading=true;
        if(this.time<'09:00:00'){
          this.status=1;
        }else{
          this.status=0;
        }
        if(getCookie('account')==''||getCookie('name')==''){
            return false;
        }
        let params={uid:getCookie('account'),name:getCookie('name'),date:this.chooseYear(),status:this.status};
        postCheck(params).then((res)=>{
          if(res.data.code==10000){
            this.$message.success('打卡成功!');
            this.loading=false;
            this.isTrue=true;
            this.isTime=this.chooseTime1(this.date);
          }else{
            this.$message.error('系统异常,打卡失败!');
            this.loading=false;
          }
        })
          .catch((err)=>{
            this.$message.error('网络异常,请稍后再试!');
            this.loading=false;
          })
      },
      chooseTime(){
        let hours = new Date().getHours();
        if(hours<10){
          hours='0'+hours;
        }
        let minutes = new Date().getMinutes();
        if(minutes<10){
          minutes='0'+minutes;
        }
        let seconds = new Date().getSeconds();
        if(seconds<10){
          seconds='0'+seconds;
        }
        return hours+":"+minutes+":"+seconds;
      },
      chooseTime1(val){
        let hours = new Date(val).getHours();
        if(hours<10){
          hours='0'+hours;
        }
        let minutes = new Date(val).getMinutes();
        if(minutes<10){
          minutes='0'+minutes;
        }
        let seconds = new Date(val).getSeconds();
        if(seconds<10){
          seconds='0'+seconds;
        }
        return hours+":"+minutes+":"+seconds;
      },
      chooseYear(){
        var val=new Date();
        var year=val.getFullYear();
        var month=val.getMonth()+1;
        var date=val.getDate();
        var hour=val.getHours();
        var minute=val.getMinutes();
        var second=val.getSeconds();
        if (month < 10) {
          month = '0' + month;
        }
        if (date < 10) {
          date = '0' + date;
        }
        if (hour < 10) {
          hour = '0' + hour;
        }
        if (minute < 10) {
          minute = '0' + minute;
        }
        if (second < 10) {
          second = '0' + second;
        }
        return this.date=year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
      },
      chooseYearFullar(){
        var val=new Date();
        var year=val.getFullYear();
        var month=val.getMonth()+1;
        var date=val.getDate();
        if (month < 10) {
          month = '0' + month;
        }
        if (date < 10) {
          date = '0' + date;
        }
        return year+"-"+month+"-"+date;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .section{  text-align: center;  padding: 100px 0;  }
  .section .el-button{  width: 200px;  height: 200px;  border-radius: 50%;  }
</style>
