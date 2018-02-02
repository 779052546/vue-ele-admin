<template>
  <div class="app">
    <el-row class="header"><h3>打卡日统计</h3></el-row>
    <el-row class="section">
      <el-row>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">成员姓名<el-input v-model.trim="name" style="width: 180px;" :maxlength="20"></el-input></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;" v-if="power">打卡日期<el-date-picker v-model.trim="date" type="date" placeholder="选择日期" format="yyyy-MM-dd" :editable="false" :picker-options="pickerOptions" @change="valueFormat"></el-date-picker></el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8"> <el-button type="primary" @click="getCheck">查询</el-button></el-col>
      </el-row>
      <el-row>
        <el-table v-loading.body="loading" :data="tableData" border max-height="651">
          <el-table-column label="成员姓名" prop="name" align="center" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="手机号码" prop="phone" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.phone}}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" align="center" min-width="120">
            <template slot-scope="scope">
              <div><span v-if="scope.row.status==0">迟到</span><span v-if="scope.row.status==1">正常</span></div>
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="dname" align="center" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.dname}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div style="overflow: hidden">
        <div class="block">
          <el-pagination @current-change="handleCurrentChange"
                         :current-page.sync="page"
                         :page-size="size"
                         layout="total, prev, pager, next"
                         :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getCheck} from '../api'
  export default {
    name: 'app',
    data () {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        name:'',  //成员姓名,
        date:'',  //查询日期 普通用户只能查看当天 管理员可以换天
        tableData:null,    //数组
        page: 1,
        power:false,   //是否显示日期菜单
        totalCount:0,   //总共多少条数据
        size:30,   //每页多少条数据
        loading:false,
      }
    },
    created:function(){
      if(getCookie('power')==9999){
        this.power=true;
      }else{
        this.power=false;
      }
      this.date=this.chooseTime();
      this.getCheck();
    },
    mounted: function () {

    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getCheck();
      },
      skipBtn:function(can1,can2){
//        this.$router.push({path:'/Home/Rolesets',query:{id:can2.id}})
      },
      valueFormat:function(val){
        this.date=val;
      },
      getCheck(){
        this.loading=true;
        let params={name:this.name,date:this.date,page:this.page};
        getCheck(params).then((res)=>{
          if(res.data.code==10000){
            this.tableData=res.data.data;
            this.totalCount=res.data.total;
            this.loading=false;
          }else{
            this.loading=false;
            this.tableData=null;
            this.totalCount=0;
          }
        })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })
      },
      chooseTime(){
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
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
</style>
