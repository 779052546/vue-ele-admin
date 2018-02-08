<template>
  <div class="app">
    <el-row class="header">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>岗位查看</h3></el-row>
    <el-row class="section">
      <div> <el-button @click="addAttendance" v-if="power">添加岗位</el-button></div>
      <el-table v-loading.body="loading" :data="tableData" border max-height="651">
        <el-table-column label="序列号" type="index" align="center" width="120"></el-table-column>
        <el-table-column label="岗位" prop="pname" align="center" min-width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.pname}}</div>
          </template>
        </el-table-column>
        <el-table-column label="全勤奖" prop="attendance" align="center" min-width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.attendance}}</div>
          </template>
        </el-table-column>
        <el-table-column label="隶属部门" prop="name" align="center" min-width="120" >
          <template slot-scope="scope">
            <div>{{ scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="power" width="140px">
          <template slot-scope="scope">
            <div><el-button size="small" type="primary" @click="resetAttendance(scope.$index, scope.row)">调整全勤奖</el-button></div>
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

    <!--添加-->
    <el-dialog title="" v-model="editFormVisible" :close-on-click-modal="false" class="dialog">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm content">
        <el-form-item label="岗位名称" prop="name">
          <el-input type="text" v-model.trim="ruleForm.name" auto-complete="off" class="required" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="dtid">
          <el-select v-model.trim="ruleForm.dtid" class="required">
            <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基础工资" prop="basepay">
          <el-input type="text" v-model.trim="ruleForm.basepay" auto-complete="off" :maxlength="8" class="required"></el-input>
        </el-form-item>
        <el-form-item label="岗位补贴" prop="postbt">
          <el-input type="text" v-model.trim="ruleForm.postbt" auto-complete="off" :maxlength="5" class="required"></el-input>
        </el-form-item>
        <el-form-item label="全勤奖" prop="attendance">
          <el-input type="text" v-model.trim="ruleForm.attendance" auto-complete="off" :maxlength="5" class="required"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" @dblclick="false">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--调整-->
    <el-dialog title="" v-model="editFormVisible1" :close-on-click-modal="false" class="dialog">
      <div class="content">
        全勤奖&nbsp;<el-input type="text" v-model.trim="ruleForm.attendance" auto-complete="off" :maxlength="5"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="submitBtn">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getPost1,getDepart,postPost1,putPost1} from '../api'
  export default {
    name: 'app',
    data () {
      var reg= /^[0-9]+$/;
      var validateAttendance = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入全勤奖'));
        } else if(!reg.test(value)){
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      };
      var validatePostbt = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入岗位补贴'));
        } else if(!reg.test(value)){
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      };
      var validateBasepay = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入基础工资'));
        } else if(!reg.test(value)){
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      };
      var validateDtid = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择所属部门'));
        } else {
          callback();
        }
      };
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入岗位名称'));
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
        editFormVisible:false,
        editFormVisible1:false,
        ruleForm:{
          name:'',
          dtid:'',
          basepay:'',
          postbt:'',
          attendance:''
        },
        rules: {
          attendance: [
            { validator: validateAttendance, trigger: 'blur' }
          ],
          postbt: [
            { validator: validatePostbt, trigger: 'blur' }
          ],
          basepay: [
            { validator: validateBasepay, trigger: 'blur' }
          ],
          dtid: [
            { validator: validateDtid, trigger: 'blur' }
          ],
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
        },
        departList:[],  //部门列表
        id:'',
        power:false
      }
    },
    created:function(){
      if(getCookie('power')==9999){
        this.power=true;
      }else{
        this.power=false;
      }

      getDepart().then((res)=>{
        if(res.data.code==10000){
          this.departList=res.data.data;
        }
      })
    },
    mounted: function () {
      this.getPost1();
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getPost1();
      },
      getPost1(){
        this.loading=true;
        let params={page:this.page};
        getPost1(params).then((res)=>{
          this.loading=false;
          this.tableData=res.data.data;
          this.totalCount=res.data.total;
        })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })
      },
      //调整全勤
      resetAttendance(can1,can2){
        this.id=can2.id;
        this.editFormVisible1=true;
        this.ruleForm.attendance=can2.attendance;
      },
      //调整全勤
      submitBtn(){
        let reg = /^[0-9]+$/;
        if(this.ruleForm.attendance==''){
          this.$message.error('请输入全勤奖!');
          return false;
        }
        if(!reg.test(this.ruleForm.attendance)){
          this.$message.error('请输入数字!');
          return false;
        }
        let params={id:this.id,attendance:this.ruleForm.attendance};
        putPost1(params).then((res)=>{
          if(res.data.code==10000){
            this.$message.success('调整成功!');
            this.editFormVisible1=false;
            this.getPost1();
          }else{
            this.editFormVisible1=false;
            this.$message.error('系统异常,请稍后重试!');
          }
        })
          .catch((err)=>{
            this.editFormVisible1=false;
            this.$message.error('网络异常,请稍后重试!');
          })
      },
      //添加岗位
      addAttendance(){
        this.editFormVisible=true;
        this.ruleForm={
          name:'',
          dtid:'',
          basepay:'',
          postbt:'',
          attendance:''
        }
      },
      //添加岗位
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {name:this.ruleForm.name,dtid:this.ruleForm.dtid,basepay:this.ruleForm.basepay,postbt:this.ruleForm.postbt,attendance:this.ruleForm.attendance};
            postPost1(params).then((res)=>{
              if(res.data.code==10000){
                this.$message.success('添加成功!');
                this.editFormVisible=false;
                this.getPost1();
              }else{
                this.$message.error(res.data.data);
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

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .dialog{  width: 1100px;  margin:0px auto;  }
  .content{  width: 340px;  margin: 0 auto;  margin-left: 130px; }
</style>
