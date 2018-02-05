<template>
  <div class="app">
    <el-row class="header"><h3>薪资调整</h3></el-row>
    <el-row class="section" v-if="!power">

    </el-row>
    <el-row class="section" v-if="power">
      <el-row>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">成员姓名<el-input v-model.trim="name" style="width: 180px;" :maxlength="20"></el-input></el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8"> <el-button type="primary" @click="getPrice">查询</el-button></el-col>
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
          <el-table-column label="工资" prop="price" align="center" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.price}}</div>
            </template>
          </el-table-column>
          <el-table-column label="角色" prop="attendance" align="center" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.attendance}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <div><el-button size="small" type="primary" @click="skipBtn(scope.$index, scope.row)">调整薪资</el-button></div>
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


    <!--修改-->
    <el-dialog title="" v-model="editFormVisible" :close-on-click-modal="false" id="dialog">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm content">
        <el-form-item label="成员姓名" prop="name">
          <el-input type="text" v-model.trim="ruleForm.name" auto-complete="off" class="required" :maxlength="20" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input type="text" v-model.trim="ruleForm.phone" auto-complete="off" :maxlength="11" class="required" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="薪资" prop="price">
          <el-input type="text" v-model.trim="ruleForm.price" auto-complete="off" :maxlength="10" class="required"></el-input>
        </el-form-item>
        <el-form-item label="全勤奖" prop="attendance">
          <el-input type="text" v-model.trim="ruleForm.attendance" auto-complete="off" :maxlength="5" class="required"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" @dblclick="false">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getPrice,putPrice} from '../api'
  export default {
    name: 'app',
    data () {
      var reg= /^[0-9]+$/;
      var validateAttendance = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入薪资'));
        } else if(!reg.test(value)){
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      };
      var validatePrice = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入薪资'));
        } else if(!reg.test(value)){
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      };
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else {
          callback();
        }
      };
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入姓名'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          name:'',   //成员姓名
          phone:'', //手机号码
          attendance:'',   //全勤奖
          price:'',     //薪资
        },
        rules: {
          attendance: [
            { validator: validateAttendance, trigger: 'blur' }
          ],
          price: [
            { validator: validatePrice, trigger: 'blur' }
          ],
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
        },
        name:'',  //成员姓名
        tableData:null,    //数组
        page: 1,
        totalCount:0,   //总共多少条数据
        size:15,   //每页多少条数据
        loading:false,

        power:false,
        editFormVisible:false,
        id:'',
      }
    },
    created:function(){
      if(getCookie('power')==9999){
        this.power=true;
        this.getPrice();
      }else{
        this.power=false;
      }
    },
    mounted: function () {

    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getPrice();
      },
      getPrice(){
        this.loading=true;
        let params={name:this.name,page:this.page};
        getPrice(params).then((res)=>{
          if(res.data.code==10000){
            this.tableData=res.data.data;
            this.totalCount=res.data.total;
            this.loading=false;
          }else{
            this.loading=false;
            this.$message.error('系统异常,请稍后重试!');
          }
        })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })
      },
      skipBtn(can1,can2){
        this.editFormVisible=true;
        this.id=can2.id;
        this.ruleForm.name=can2.name,   //成员姓名
        this.ruleForm.phone=can2.phone, //手机号码
        this.ruleForm.attendance=can2.attendance;  //全勤奖
        this.ruleForm.price=can2.price;  //薪资
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {id:this.id,price:this.ruleForm.price,attendance:this.ruleForm.attendance}
            putPrice(params).then((res)=>{
              if(res.data.code==10000){
                this.$message.success('调整成功!');
                this.editFormVisible=false;
                this.getPrice();
              }else{
                this.editFormVisible=false;
                this.$message.error('系统异常,请稍后重试!');
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
  #dialog{  width: 1100px;  margin:0px auto;  }
  .content{  width: 340px;  margin: 0 auto;  }
</style>
