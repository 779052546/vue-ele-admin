<template>
  <div class="app">
    <el-row class="header"><el-breadcrumb separator="/" class="breadcrumb-inner">
      <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb><h3>审批提醒</h3></el-row>
    <el-row class="section">
      <el-row>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">成员姓名<el-input v-model.trim="filters.name" style="width: 180px;" :maxlength="20"></el-input></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">月份<el-date-picker v-model.trim="filters.date" type="month"  placeholder="选择月份" format="yyyy-MM" :editable="false" @change="valueFormat"></el-date-picker></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">部门<el-select v-model.trim="filters.depart">
          <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">审批状态<el-select v-model.trim="filters.status">
          <el-option value="" label="全部">全部</el-option>
          <el-option value="0" label="待审批"></el-option>
          <el-option value="1" label="已通过"></el-option>
          <el-option value="2" label="未通过"></el-option>
        </el-select></el-col>

        <el-col :xs="8" :sm="8" :md="8" :lg="8"> <el-button type="primary" @click="getBatch">查询</el-button>&nbsp;</el-col>
      </el-row>
      <el-row>
        <el-table v-loading.body="loading" :data="tableData" border max-height="651">
          <el-table-column label="成员姓名" prop="name" align="center" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="手机号码" prop="phone" align="center" min-width="130" >
            <template slot-scope="scope">
              <div>{{ scope.row.phone}}</div>
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="dname" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.dname}}</div>
            </template>
          </el-table-column>
          <el-table-column label="请假类型" prop="tname" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.tname}}</div>
            </template>
          </el-table-column>
          <el-table-column label="请假时间" prop="timebegin" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.timebegin | StampChanYear}}</div>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" prop="timeover" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.timeover | StampChanYear}}</div>
            </template>
          </el-table-column>
          <el-table-column label="请假事由" prop="reason" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.reason}}</div>
            </template>
          </el-table-column>
          <el-table-column label="审批状态" prop="status" align="center" min-width="120" >
            <template slot-scope="scope">
              <div><span v-if="scope.row.status==0">待审核</span><span v-if="scope.row.status==1">已通过</span><span v-if="scope.row.status==2">未通过</span></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="120" >
            <template slot-scope="scope">
              <div><el-button size="small" type="primary" @click="reset(scope.$index, scope.row)" :disabled="scope.row.status!=0"><span v-if="scope.row.status!=0">已审核</span><span v-if="scope.row.status==0">审核</span></el-button></div>
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


      <!--修改-->
      <el-dialog title="" v-model="editFormVisible" :close-on-click-modal="false" id="dialog">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm content">
          <el-form-item label="审批状态" prop="activeStatus">
            <el-select v-model="ruleForm.activeStatus">
              <el-option :value="1" label="通过"></el-option>
              <el-option :value="2" label="拒绝"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="拒绝理由" prop="callback" v-if="ruleForm.activeStatus==2">
            <el-input type="textarea" v-model.trim="ruleForm.callback" resize="none" :rows="4" :maxlength="100"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-row>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getBatch,getDepart,putBatchholiday} from '../api'
  export default {
    name: 'app',
    data() {
      var validateStatus = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择审批状态'));
        } else {
          callback();
        }
      };
      var validateCallback= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写拒绝理由'));
        } else {
          callback();
        }
      };
      return {
        filters:{
          name:'',
          depart:'',
          status:'',
          date:'',
        },
        ruleForm:{
          activeStatus:'',//选择审批状态
          callback:''
        },
        rules: {
          activeStatus: [
            { validator: validateStatus, trigger: 'blur' }
          ],
          callback: [
            { validator: validateCallback, trigger: 'blur' }
          ],
        },
        editFormVisible:false,

        departList:[],   //部门列表

        loading:false,
        tableData:null,    //数组
        page: 1,
        totalCount:0,   //总共多少条数据
        size:15,   //每页多少条数据

        id:'',  //审核id
      };
    },
    created:function(){

      getDepart().then((res)=>{
        if(res.data.code==10000){
          this.departList.push({"id":'',"name":'全部'});
          for(var i=0;i<res.data.data.length;i++){
            this.departList.push(res.data.data[i]);
          }
        }
      })
      this.filters.date=this.chooseTime();
      this.getBatch();
    },
    mounted: function () {
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getBatch();
      },
      getBatch(){
        this.loading=true;
        let params={page:this.page,name:this.filters.name,status:this.filters.status,department:this.filters.depart,date:this.filters.date};
        getBatch(params).then((res)=>{
          if(res.data.code==10000){
            this.loading=false;
            this.tableData=res.data.data;
            this.totalCount=res.data.total;
          }else{
            this.loading=false;
            this.$message.error('系统异常!');
          }
        })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })
      },
      valueFormat:function(val){
        this.filters.date=val;
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
      reset(can1,can2){
        this.editFormVisible=true;
        this.ruleForm.activeStatus='';
        this.ruleForm.callback='';
        this.id=can2.id;
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.activeStatus==1){
              this.ruleForm.callback='';
            }
            let params={id:this.id,status:this.ruleForm.activeStatus,callback:this.ruleForm.callback};
            putBatchholiday(params).then((res)=>{
              if(res.data.code==10000){
                this.$message.success('审批成功!');
                this.editFormVisible=false;
                this.getBatch();
              }else{
                this.$message.error('审批失败!');
                this.editFormVisible=false;
              }
            })
              .catch((err)=>{
                this.editFormVisible=false;
                this.$message.error('网络异常,请稍后再试!');
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .el-select,.el-input{  margin-bottom: 10px;  }
  #dialog{  width: 1100px;  margin:0px auto;  }
  .content{  width: 340px;  margin: 0 auto;  }
</style>
