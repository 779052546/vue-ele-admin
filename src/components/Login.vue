<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号" :maxlength="11" @keyup.enter.native="handleSubmit"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码" :maxlength="16" @keyup.enter.native="handleSubmit"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {postAccount,putStatus} from './api'
  import {setCookie,getCookie} from '../cookie'
  export default {
    data() {
      var validateaccount= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        }else{
          callback();
        }
      };
      var validatecheckPass= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else{
          callback();
        }
      };
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { validator: validateaccount, trigger: 'blur' },
          ],
          checkPass: [
            { validator: validatecheckPass, trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    created:function(){
      if(getCookie('account')&&getCookie('power')){
        this.$router.push('/Home/User');
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            var params = { phone: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            postAccount(params).then((res)=>{
              if(res.data.code==10000){
                this.logining=false;
                setCookie('account',res.data.data.id);
                setCookie('power',res.data.data.power);
                setCookie('name',res.data.data.name);
                let params = {id : getCookie('account'),status:1} ;
                putStatus(params).then((res)=>{
                  this.$router.push('/Home/User')
                })

              }else if(res.data.code==10001){
                this.logining=false;
                this.$message.error(res.data.data);
              }else if(res.data.code==10002){
                this.logining=false;
                this.$message.error(res.data.data);
              }else{
                this.logining=false;
                this.$message.error('系统异常!');
              }
            })
              .catch((err)=>{
                this.logining=false;
                this.$message.error('网络异常,请稍后重试!');
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login-container .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .login-container .remember {
    margin: 0px 0px 35px 0px;
  }
  .el-input{
    width: 100%;
  }
  .el-button:hover,.el-button:focus{  color: #fff;  background-color: #3F7191;  border-color:#3F7191}
</style>
