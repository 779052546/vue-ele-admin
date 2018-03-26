<template>
  <div class="app">
    <el-row class="header"><el-breadcrumb separator="/" class="breadcrumb-inner">
      <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb><h3>登录密码修改</h3></el-row>
    <el-row class="section">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oriPassword">
          <el-input type="password" v-model.trim="ruleForm.oriPassword" auto-complete="off" :maxlength="16" class="required" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model.trim="ruleForm.newPassword" auto-complete="off" :maxlength="16" class="required" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" :maxlength="16" class="required" @keyup.enter.native="submitForm('ruleForm')" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">提交</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {putPass} from '../api'
  export default {
    name: 'app',
    data() {
      var reg =/^[0-9A-Za-z]{6,16}$/;
      var validateoriDeviceSeriaNo = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('旧密码不能为空'));
        }else if (!reg.test(value)) {
          return callback(new Error('密码应为6~16位字母数字组合'));
        }else{
          callback();
        }
      };
      var validatenewDeviceSeriaNo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('新密码不能为空'));
        }else if (!reg.test(value)) {
          return callback(new Error('密码应为6~16位字母数字组合'));
        }else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          oriPassword:'',       //旧密码
          newPassword:'',       //新密码
          checkPass:'',      //二次确认密码
        },
        rules: {
          oriPassword: [
            { validator: validateoriDeviceSeriaNo, trigger: 'blur' }
          ],
          newPassword: [
            { validator: validatenewDeviceSeriaNo, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass, trigger: 'blur' }
          ],
        },
        title:'添加',
        loading:false,
      };
    },
    created:function(){

    },
    mounted: function () {
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              if(this.ruleForm.newPassword=='123456'){
                this.$message.error('修改新密码不能为123456!');
                return;
              }
            this.loading=true;
            let params = {id:getCookie('account'),oriPassword:this.ruleForm.oriPassword,newPassword:this.ruleForm.newPassword};
            putPass(params).then((res)=>{
                if(res.data.code==10000){
                  this.loading=false;
                  this.$message.success('修改密码成功!');
                  this.ruleForm={
                    oriPassword:'',       //旧密码
                    newPassword:'',       //新密码
                    checkPass:'',      //二次确认密码
                  }
                }else if(res.data.code==10003){
                  this.loading=false;
                  this.$message.error('原始密码错误!');
                  this.ruleForm={
                    oriPassword:'',       //旧密码
                    newPassword:'',       //新密码
                    checkPass:'',      //二次确认密码
                  }
                }else{
                  this.loading=false;
                  this.$message.error('系统异常!');
                }
            })
              .catch((err)=>{
                this.loading=false;
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
  .el-form{  max-width: 340px;  padding: 20px;  margin:0px auto;  }
  .el-select, .el-input {  width: 180px  }
</style>
