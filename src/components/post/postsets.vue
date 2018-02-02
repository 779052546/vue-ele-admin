<template>
  <div class="app">
    <el-row class="header">
      <h3>岗位增改</h3>
    </el-row>
    <el-row class="section">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="成员姓名" prop="name">
          <el-input type="text" v-model.trim="ruleForm.name" auto-complete="off" class="required" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input type="text" v-model.trim="ruleForm.phone" auto-complete="off" :maxlength="11" class="required"></el-input>
        </el-form-item>
        <el-form-item label="成员密码" prop="pass">
          <el-input type="text" v-model.trim="ruleForm.pass" auto-complete="off" class="required" :maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择" class="required">
            <el-option :value="1" label="有效"></el-option>
            <el-option :value="2" label="无效"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="ruleForm.role" class="required">
            <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model.trim="ruleForm.memo" resize="none" :rows="3" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" @dblclick="false">提交</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      var validateRoles = (rule, value, callback) => {
        if (this.ruleForm.role < 1) {
          callback(new Error('请选择角色'));
        } else {
          callback();
        }
      };
      var validateStatus = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择状态'));
        } else {
          callback();
        }
      };
      var reg2=/^[0-9A-Za-z]{6,16}$/;
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(!reg2.test(value)){
          callback(new Error('密码应为6~16位字母数字组合'));
        } else {
          callback();
        }
      };
      var reg=/^(13|14|15|17|18)[0-9]{9}$/;
      var reg1=/^(1)[0-9]{10}$/;
      var validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号码'));
        }
        if(!reg1.test(value)){
          callback(new Error('请输入以1开头的11位手机号码'));
        }else{
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
          pass:'',   //成员密码
          status:'',     //状态
          role:[],  //角色
          memo:'',  //备注
        },
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          status: [
            { validator: validateStatus, trigger: 'blur' }
          ],
          roles: [
            { validator: validateRoles, trigger: 'blur' }
          ],
        },
        title:'新增',
        loading:false,
        roleList:[]
      };
    },
    created:function(){
      if (this.$route.query.id){

      }
    },
    mounted: function () {
    },
    methods: {
      submitForm(formName) {
        this.loading=true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading=false;
          } else {
            console.log('error submit!!');
            this.loading=false;
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
</style>
