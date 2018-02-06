<template>
  <div class="app">
    <el-row class="header">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>薪资查看</h3>
    </el-row>
    <el-row class="section">
      <el-form status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="成员姓名">
          <el-input type="text" v-model.trim="ruleForm.name" auto-complete="off" :maxlength="20" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input type="text" v-model.trim="ruleForm.phone" auto-complete="off" :maxlength="11" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="薪资">
          <el-input type="text" v-model.trim="ruleForm.price" auto-complete="off" :maxlength="10" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="全勤奖">
          <el-input type="text" v-model.trim="ruleForm.attendance" auto-complete="off" :maxlength="5" :disabled="true"></el-input>
        </el-form-item>
        <p style="margin-top: 50px;">每月薪资中20%作为绩效考核</p>
        <p>每月打卡次数若为满勤,则发放全勤奖</p>
        <p>绩效20%会根据迟到,请假等计算</p>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getPriceId,putPrice} from '../api'
  export default {
    name: 'app',
    data() {
      return {
        ruleForm: {
          name:'',   //成员姓名
          phone:'', //手机号码
          attendance:'',   //全勤奖
          price:'',     //薪资
        },
        title:'新增',
        loading:false,
        roleList:[]
      };
    },
    created:function(){
      if (getCookie('account')){
        let params={id:getCookie('account')};
        getPriceId(params).then((res)=>{
          if(res.data.code==10000){
            this.ruleForm.name=res.data.data.name;
            this.ruleForm.phone=res.data.data.phone;
            this.ruleForm.price=res.data.data.price;
            this.ruleForm.attendance=res.data.data.attendance;
          }
        })
      }
    },
    mounted: function () {

    },
    methods: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .section{  padding:50px 0;  }
  .el-form{  width: 340px;  margin:0 auto;  }
  .el-form p{
    margin-left: 52px;
    font-size: 14px;
  }
</style>
