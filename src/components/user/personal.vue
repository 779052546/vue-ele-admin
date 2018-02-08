<template>
  <div class="app">
    <el-row class="header"><el-breadcrumb separator="/" class="breadcrumb-inner">
      <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
      <h3>个人信息管理</h3>
    </el-row>
    <el-row class="section">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
       <div class="leftBox">
         <el-form-item label="姓名" prop="name">
           <el-input type="text" v-model.trim="ruleForm.name" auto-complete="off" class="required" :maxlength="20"></el-input>
         </el-form-item>
         <el-form-item label="手机号码" prop="phone">
           <el-input type="text" v-model.trim="ruleForm.phone" auto-complete="off" :maxlength="11" class="required"></el-input>
         </el-form-item>
         <el-form-item label="性别" prop="sex">
           <el-select v-model="ruleForm.sex" placeholder="请选择" class="required">
             <el-option :value="0" label="男"></el-option>
             <el-option :value="1" label="女"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="生日" prop="birthday">
           <el-date-picker type="date" v-model.trim="ruleForm.birthday" :editable="false" auto-complete="off" :maxlength="16" format="yyyy-MM-dd" @change="getStime"></el-date-picker>
         </el-form-item>
         <el-form-item label="个人签名" prop="textarea">
           <el-input type="textarea" v-model.trim="ruleForm.textarea" resize="none" :rows="4" :maxlength="100"></el-input>
         </el-form-item>
         <el-form-item label="部门" prop="department">
           <el-select v-model="ruleForm.department" placeholder="请选择" class="required" :disabled="true">
             <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="籍贯" prop="jiguan">
           <el-input type="text" v-model.trim="ruleForm.jiguan" auto-complete="off" :maxlength="16"></el-input>
         </el-form-item>
         <el-form-item label="住址" prop="address">
           <el-input type="text" v-model.trim="ruleForm.address" auto-complete="off" :maxlength="16"></el-input>
         </el-form-item>
       </div>
       <div class="leftBox">
         <el-form-item label="学历" prop="education">
           <el-select v-model="ruleForm.education" placeholder="请选择">
             <el-option v-for="item in educationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="QQ" prop="qq">
           <el-input type="text" v-model.trim="ruleForm.qq" auto-complete="off" :maxlength="16"></el-input>
         </el-form-item>
         <el-form-item label="E-mail" prop="email">
           <el-input type="text" v-model.trim="ruleForm.email" auto-complete="off" :maxlength="50"></el-input>
         </el-form-item>
         <el-form-item label="薪资" prop="price">
           <el-input type="text" v-model.trim="ruleForm.price" auto-complete="off" class="required" :maxlength="16" :disabled="true"></el-input>
         </el-form-item>
         <el-form-item label="基础工资" prop="basepay">
           <el-input type="text" v-model.trim="ruleForm.basepay" auto-complete="off" class="required" :maxlength="16" @change="price" :disabled="true"></el-input>
         </el-form-item>
         <el-form-item label="岗位补贴" prop="postbt">
           <el-input type="text" v-model.trim="ruleForm.postbt" auto-complete="off" class="required" :maxlength="16" @change="price" :disabled="true"></el-input>
         </el-form-item>
         <el-form-item label="全勤奖" prop="attendance">
           <el-input type="text" v-model.trim="ruleForm.attendance" auto-complete="off" class="required" :maxlength="16" @change="price" :disabled="true"></el-input>
         </el-form-item>
         <el-form-item label="入职日期" prop="entry">
           <el-date-picker type="date" v-model.trim="ruleForm.entry" :editable="false" auto-complete="off" class="required" :maxlength="16" format="yyyy-MM-dd" @change="getStime" :disabled="true"></el-date-picker>
         </el-form-item>
       </div>
        <div class="leftBoxA">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" @dblclick="false">提交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import {getDepart,getPower,getPost,getPostId,getUserPhone,putUserId,getEducation} from '../api'
  import {getCookie} from '../../cookie'
  export default {
    name: 'app',
    data() {
      var validateEntry= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择入职日期'));
        } else {
          callback();
        }
      };
      var validateAttendance= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写全勤奖'));
        } else {
          callback();
        }
      };
      var validatePostbt= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写岗位补贴'));
        } else {
          callback();
        }
      };
      var validateBasepay= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写基础工资'));
        } else {
          callback();
        }
      };
      var validatePrice= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写薪资'));
        } else {
          callback();
        }
      };
      var validatePost= (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择岗位'));
        } else {
          callback();
        }
      };
      var validateDepartment = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择部门'));
        } else {
          callback();
        }
      };
      var validateSex = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择性别'));
        } else {
          callback();
        }
      };
      var reg=/^(13|14|15|17|18)[0-9]{9}$/;
      var validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号码'));
        }
        if(!reg.test(value)){
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
          sex:'',  //性别
          birthday:'',  //生日
          textarea:'',  //个人签名
          department:'', //部门
          post:'',    //岗位
          jiguan:'',   //籍贯
          address:'',  //现住址
          education:'',  //学历
          qq:'',
          email:'',
          power:'',  //角色
          price:'',
          entry:'',  //入职日期
          basepay:'', //基础工资
          postbt:'',   //岗位补贴
          attendance:'',  //全勤奖
        },
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          sex: [
            { validator: validateSex, trigger: 'blur' }
          ],
          department: [
            { validator: validateDepartment, trigger: 'blur' }
          ],
          post: [
            { validator: validatePost, trigger: 'blur' }
          ],
          price: [
            { validator: validatePrice, trigger: 'blur' }
          ],
          basepay: [
            { validator: validateBasepay, trigger: 'blur' }
          ],
          postbt: [
            { validator: validatePostbt, trigger: 'blur' }
          ],
          attendance: [
            { validator: validateAttendance, trigger: 'blur' }
          ],
          entry: [
            { validator: validateEntry, trigger: 'blur' }
          ],
        },
        loading:false,
        roleList:[],
        departList:[],  //部门列表
        educationList:[], //学历列表
        id:''
      };
    },
    created:function(){
      getDepart().then((res)=>{
        if(res.data.code==10000){
          this.departList=res.data.data;
        }
      })
      getPost().then((res)=>{
        if(res.data.code==10000){
          this.postList=res.data.data;
        }
      })
      getPower().then((res)=>{
        if(res.data.code==10000){
          this.roleList=res.data.data;
        }
      })
      getEducation().then((res)=>{
        if(res.data.code==10000){
          this.educationList=res.data.data;
        }
      })

      let params = {id:getCookie('account')};
      getUserPhone(params).then((res)=>{
        if(res.data.code==10000){
          this.ruleForm.name=res.data.data.name;
          this.ruleForm.phone=res.data.data.phone;
          this.ruleForm.sex=res.data.data.sex;
          this.ruleForm.birthday=res.data.data.birthday;
          this.ruleForm.textarea=res.data.data.textarea;
          this.ruleForm.department=res.data.data.department;
          this.ruleForm.post=res.data.data.post;
          this.ruleForm.jiguan=res.data.data.jiguan;
          this.ruleForm.address=res.data.data.address;
          if(res.data.data.education==null||res.data.data.education==''){
            this.ruleForm.education='';
          }else{
            this.ruleForm.education=Number(res.data.data.education);
          }
          this.ruleForm.qq=res.data.data.qq;
          this.ruleForm.email=res.data.data.email;
          this.ruleForm.power=Number(res.data.data.power);
          this.ruleForm.price=Number(res.data.data.price);
          this.ruleForm.entry=res.data.data.entry;
          this.ruleForm.basepay=res.data.data.basepay;
          this.ruleForm.postbt=res.data.data.postbt;
          this.ruleForm.attendance=res.data.data.attendance;
        }
      })
    },
    mounted: function () {

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading=true;
            if(this.ruleForm.birthday==''){
              this.ruleForm.birthday=null;
            }
            let params={id:this.$route.query.id,name:this.ruleForm.name, phone:this.ruleForm.phone, sex:this.ruleForm.sex, birthday:this.ruleForm.birthday, textarea:this.ruleForm.textarea,department:this.ruleForm.department, post:this.ruleForm.post, jiguan:this.ruleForm.jiguan, address:this.ruleForm.address,education:this.ruleForm.education, qq:this.ruleForm.qq, email:this.ruleForm.email, power:this.ruleForm.power, price:this.ruleForm.price, entry:this.ruleForm.entry, basepay:this.ruleForm.basepay, postbt:this.ruleForm.postbt, attendance:this.ruleForm.attendance};
            putUserId(params).then((res)=>{
              if(res.data.code==10000){
                this.$message.success('修改成功!');
                this.loading=false;
              }else if(res.data.code==10002){
                this.$message.error(res.data.data);
                this.loading=false;
              }else{
                this.$message.error('修改失败!');
                this.loading=false;
              }
            })
              .catch((err)=>{
                this.loading=false;
                this.$message.error('网络异常,请稍后再试!');
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      price(){
        this.ruleForm.price='';
        this.ruleForm.price=Number(this.ruleForm.basepay)+ Number(this.ruleForm.postbt);
      },
      getStime(val){
        this.ruleForm.birthday=val;
      },
      getStime1(val){
        this.ruleForm.entry=val;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .el-form{  max-width: 640px;  padding: 20px;  margin:0px auto;  overflow: hidden}
  .el-table,.el-button,.el-input{  margin-top: 0px; }
  .el-textarea{  width: 180px;  }
  .el-date-editor{  width: 180px;  }
  .leftBox{  width: 50%;  float: left; height: 550px; }
  .leftBoxA{  width: 100%;float: left;  text-align: center;margin-left: -50px }
</style>
