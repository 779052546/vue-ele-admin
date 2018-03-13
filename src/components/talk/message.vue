<template>
  <div class="app">
    <el-row class="header">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>留言</h3></el-row>
    <el-row class="section">
      <el-button @click="openDialog">我要留言</el-button>
      <el-table v-loading.body="loading" :data="tableData" border max-height="651">
        <el-table-column label="序列号" type="index" align="center" width="120"></el-table-column>
        <el-table-column label="姓名" prop="name" align="center" min-width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="部门" prop="department" align="center" min-width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.department}}</div>
          </template>
        </el-table-column>
        <el-table-column label="留言时间" prop="time" align="center" min-width="120" >
          <template slot-scope="scope">
            <div>{{ scope.row.time | StampChanYear}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" min-width="120" >
          <template slot-scope="scope">
            <div><span v-if="scope.row.status==0">未读</span><span v-if="scope.row.status==1">已读</span></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140px">
          <template slot-scope="scope">
            <div><el-button size="small" type="primary" @click="blockMessage(scope.$index, scope.row)" style="margin-top: 10px;">打开留言</el-button><el-button size="small" type="danger" @click="deleteMessage(scope.$index, scope.row)">删除</el-button></div>
          </template>
        </el-table-column>
      </el-table>
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

    <!--留言-->
    <el-dialog title="" v-model="editFormVisible" :close-on-click-modal="false" class="dialog">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm content">

        <el-form-item label="所属部门" prop="department">
          <el-select v-model.trim="ruleForm.department" class="required" @change="changeUser">
            <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="uid">
          <el-select v-model.trim="ruleForm.uid" class="required">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="留言" prop="textarea">
          <el-input type="textarea" v-model.trim="ruleForm.textarea" auto-complete="off" class="required" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" @dblclick="false">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--打开留言-->
    <el-dialog title="" v-model="dialogVisible" :close-on-click-modal="false" class="dialog">
      <div class="content1">{{content}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getMessage,getDepart,getMessageUser,getUserDepat,postMessage,putMessage,deleteMessage} from '../api'
  export default {
    name: 'app',
    data() {
      var validateDepartment = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择所属部门'));
        } else {
          callback();
        }
      };
      var validateUid = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择姓名'));
        } else {
          callback();
        }
      };
      var validateTextarea = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入留言内容'));
        } else {
          callback();
        }
      };
      return {
        tableData:null,    //数组
        page: 1,
        totalCount:0,   //总共多少条数据
        size:15,   //每页多少条数据
        loading:false,
        editFormVisible:false, //留言
        dialogVisible:false, //打开留言
        content:'',    //临时内容

        departList:[],  //部门列表
        userList:[],   //用户列表

        ruleForm:{
          department:'',
          textarea:'',
          uid:'',
        },
        rules: {
          uid: [
            { validator: validateUid, trigger: 'blur' }
          ],
          textarea: [
            { validator: validateTextarea, trigger: 'blur' }
          ],
          department: [
            { validator: validateDepartment, trigger: 'blur' }
          ],
        },
      };
    },
    created:function(){
      this.ruleForm.name=getCookie(('name'));
      getDepart().then((res)=>{
        if(res.data.code==10000){
          this.departList=res.data.data;
        }
      })
    },
    mounted: function () {
      this.getMessage();
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getMessage();
      },
      openDialog(){
        this.editFormVisible=true;
        this.ruleForm.department='';
        this.ruleForm.uid='';
        this.ruleForm.textarea='';
        let param={id:getCookie('account')}
        getUserDepat(param).then((res)=>{
          if(res.data.code==10000){
            this.ruleForm.depart=res.data.data.name;
          }
        })
      },
      getMessage(){
        this.loading=true;
        let params={page:this.page,uid:getCookie('account')};
        getMessage(params).then((res)=>{
          this.loading=false;
          this.tableData=res.data.data;
          this.totalCount=res.data.total;
        })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })
      },
      changeUser(){
        this.userList=[];
        this.ruleForm.uid='';
        let params={department:this.ruleForm.department,id:getCookie(('account'))}
        getMessageUser(params).then((res)=>{
            if(res.data.code==10000){
              this.userList=res.data.data;
            }
        })

        let param={id:getCookie('account')}
        getUserDepat(param).then((res)=>{
          if(res.data.code==10000){
            this.ruleForm.phone=res.data.data.phone;
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let time = this.chooseYear();
            let params = {name:this.ruleForm.name,department:this.ruleForm.depart,uid:this.ruleForm.uid,textarea:this.ruleForm.textarea,time};
            postMessage(params).then((res)=>{
              if(res.data.code==10000){
                this.$message.success('留言成功!');
                this.editFormVisible=false;
              }else{
                this.$message.error(res.data.data);
                this.editFormVisible=false;
              }
            })
              .catch((err)=>{
                this.editFormVisible=false;
                this.$message.error('网络异常,请稍后重试!');
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
      },
      blockMessage(can1,can2){
        this.dialogVisible=true;
        this.content=can2.textarea;
        let params={id:can2.id}
        putMessage(params).then((res)=>{
            if(res.data.code==10000){
              this.getMessage();
            }
        })
          .catch((err)=>{
            this.$message.error('网络异常,请稍后重试!');
          })
      },
      deleteMessage(can1,can2){
        if(can2.status==0){
          this.$message.error('该留言未读不能删除!');
          return false;
        }
        let params={id:can2.id}
        deleteMessage(params).then((res)=>{
          if(res.data.code==10000){
            this.$message.success('删除成功!');
            this.getMessage();
          }
        })
          .catch((err)=>{
            this.$message.error('网络异常,请稍后重试!');
          })
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .dialog{  width: 1100px;  margin:0px auto;  }
  .dialog .content{  width: 340px;  margin: 0 auto;  margin-left: 60px; }
  .dialog .content1{  width: 100%;  text-align: center;  }
  .el-table .el-button{  margin-bottom: 10px;  margin-left:0; }
  .el-select, .el-input {  width: 180px  }
</style>
