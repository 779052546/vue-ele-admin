<template>
  <div class="app">
    <el-row class="header">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>月打卡统计</h3></el-row>
    <el-row class="section">
      <el-row>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">成员姓名<el-input v-model.trim="name" style="width: 180px;" :maxlength="20"></el-input></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;" v-if="power">打卡月份<el-date-picker v-model.trim="date" type="month" :picker-options="pickerOptions" placeholder="选择月份" format="yyyy-MM" :editable="false" @change="valueFormat"></el-date-picker></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4"> <el-button type="primary" @click="getCheckMonth">查询</el-button></el-col>
      </el-row>
      <el-row>
        <el-table v-loading.body="loading" :data="tableData" border max-height="651">
          <el-table-column label="成员姓名" prop="name" align="center" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当月应打卡次数" prop="daycount" align="center" min-width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.daycount}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当月实际打卡次数" sortable prop="phone" align="center" min-width="170" >
            <template slot-scope="scope">
              <div>{{ scope.row.count}}</div>
            </template>
          </el-table-column>
          <el-table-column label="正常打卡次数" prop="status" align="center" min-width="130">
            <template slot-scope="scope">
              <div>{{ scope.row.count1}}</div>
            </template>
          </el-table-column>
          <el-table-column label="迟到打卡次数" prop="status" align="center" min-width="130">
            <template slot-scope="scope">
              <div>{{ Number(scope.row.count) - Number(scope.row.count1)}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getCheckMonth} from '../api'
  export default {
    name: 'app',
    data () {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        name:'',  //成员姓名
        date:'',
        datecount:'',   //当月应打卡次数
        tableData:null,    //数组
        loading:false,

        power:false
      }
    },
    created:function(){
      if(getCookie('power')==9999){
        this.power=true;
      }else{
        this.power=false;
      }

      this.date=this.chooseTime();
      this.getCheckMonth();
    },
    mounted: function () {

    },
    methods: {
      getCheckMonth(){
        this.loading=true;
        let params={name:this.name,date:this.date};
        this.month(this.date);
        getCheckMonth(params).then((res)=>{
          if(res.data.code==10000){
            this.loading=false;
            for(var i=0;i<res.data.data.length;i++){
              res.data.data[i].daycount=this.datecount;
              for(var j=0;j<res.data.resl.length;j++){
                  //判断打卡里面的uid  与正常打卡的uid是否相等  如果想等 把当月正常打卡的次数 赋值过去
                if(res.data.data[i].uid==res.data.resl[j].uid){
                  res.data.data[i].count1=res.data.resl[j].count;
                }
              }
              if(res.data.data[i].count1==null){
                res.data.data[i].count1=0;
              }
            }
            this.tableData=res.data.data;
          }else{
            this.loading=false;
            this.tableData=res.data.data;
          }
        })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })
      },
      valueFormat:function(val){
        this.date=val;
      },
      chooseTime(){
        var val=new Date();
        var year=val.getFullYear();
        var month=val.getMonth()+1;
        if (month < 10) {
          month = '0' + month;
        }
        return year+"-"+month;
      },
      month(val){
        //空数组 用于存取当月天数
        var arr=[];
        //获取当前月份
        var year = new Date(val).getFullYear();
        //获取当前月份
        var month = new Date(val).getMonth()+1;
        if (month < 10) {
          month = '0' + month;
        }
        var daycount='';
        if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
          daycount=31;
        }else if(month==4||month==6||month==9||month==11){
          daycount=30;
        }else if(isLeapYear(year)){
          daycount=29; //闰年2月29天
        }else{
          daycount=28;
        }
        for(var i=1;i<daycount+1;i++){
          var str='';
          if(i<10){
            str= year+'-'+month+'-0'+i;
          }else{
            str= year+'-'+month+'-'+i;
          }
          arr.push(str);
        }

        var reduceLength=0;
        for(var i=0;i<arr.length;i++){
          if(new Date(arr[i]).getDay()==6||new Date(arr[i]).getDay()==0){
            reduceLength++;
          }
        }
        this.datecount = arr.length-reduceLength;

        function isLeapYear(year) {
          var cond1 = year % 4 == 0;  //条件1：年份必须要能被4整除
          var cond2 = year % 100 != 0;  //条件2：年份不能是整百数
          var cond3 = year % 400 ==0;  //条件3：年份是400的倍数
          //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
          //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
          //所以得出判断闰年的表达式：
          var cond = cond1 && cond2 || cond3;
          if(cond) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
</style>
