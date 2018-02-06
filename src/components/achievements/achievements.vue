<template>
  <div class="app">
    <el-row class="header">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>当月绩效</h3></el-row>
    <el-row class="section">
      <el-row>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">成员姓名<el-input v-model.trim="name" style="width: 180px;" :maxlength="20"></el-input></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">月份<el-date-picker v-model.trim="date" type="month" :picker-options="pickerOptions" placeholder="选择月份" format="yyyy-MM" :editable="false" @change="valueFormat"></el-date-picker></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4"> <el-button type="primary" @click="getAchievements">查询</el-button></el-col>
      </el-row>
      <el-row>
        <el-table v-loading.body="loading" :data="tableData" border max-height="651">
          <el-table-column label="成员姓名" prop="name" align="center" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="员工薪资" prop="price" align="center" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.price}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当月应打卡次数" prop="daycount" align="center" min-width="150" >
            <template slot-scope="scope">
              <div>{{ scope.row.daycount}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当月实际打卡次数" prop="count" align="center" min-width="170">
            <template slot-scope="scope">
              <div>{{ scope.row.count}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当月迟到打卡次数" prop="count1" align="center" min-width="170">
            <template slot-scope="scope">
              <div>{{ Number(scope.row.count) - Number(scope.row.count1)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当月请假次数" prop="holiday" align="center" min-width="140">
            <template slot-scope="scope">
              <div>{{ scope.row.holiday}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当月是否有全勤奖" sortable prop="createTime" align="center" width="180">
            <template slot-scope="scope">
              <div><span v-if="scope.row.daycount==scope.row.count?false:true">无</span></div>
            </template>
          </el-table-column>
          <el-table-column label="基础薪资" sortable prop="basics" align="center" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.basics | ToFixed}}</div>
            </template>
          </el-table-column>
          <el-table-column label="绩效薪资" sortable prop="achievements" align="center" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.achievements | ToFixed}}</div>
            </template>
          </el-table-column>
          <el-table-column label="应发薪资" sortable prop="answer" align="center" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.answer | ToFixed}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getAchievements} from '../api'
  export default {
    name: 'app',
    data () {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        name:'',
        date:'',
        datecount:'',   //当月应打卡次数
        tableData:null,    //数组

        loading:false,
      }
    },
    created:function(){
      this.date=this.chooseTime();
      this.getAchievements();
    },
    mounted: function () {

    },
    methods: {
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
      getAchievements(){
        this.loading=true;
        let params={name:this.name,date:this.date};
        this.month(this.date);
        getAchievements(params).then((res)=>{
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
              for(var j=0;j<res.data.holiday.length;j++){
                //判断打卡里面的uid  与正常打卡的uid是否相等  如果想等 把当月正常打卡的次数 赋值过去
                if(res.data.data[i].uid==res.data.holiday[j].uid){
                  res.data.data[i].holiday=res.data.holiday[j].count;
                }
              }
              if(res.data.data[i].count1==null){
                res.data.data[i].count1=0;
              }
              if(res.data.data[i].holiday==null){
                res.data.data[i].holiday=0;
              }
              //基础薪资
              res.data.data[i].basics=Number(res.data.data[i].price * 0.8 / res.data.data[i].daycount * res.data.data[i].count);
              //绩效薪资
              res.data.data[i].achievements=Number(res.data.data[i].price * 0.2 - (20 * (res.data.data[i].count-res.data.data[i].count1)) - 200*res.data.data[i].holiday);
              if(res.data.data[i].achievements<0){ res.data.data[i].achievements=0; }

              //应发薪资
              res.data.data[i].answer=res.data.data[i].basics+res.data.data[i].achievements;
              if(res.data.data[i].daycount==res.data.data[i].count){
                res.data.data[i].answer=res.data.data[i].basics+res.data.data[i].achievements+Number(res.data.data[i].attendance)
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
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
</style>
