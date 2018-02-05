<template>
  <div class="app">
    <el-row class="header"><h3>请假单</h3></el-row>
    <el-row class="section">
     <el-col>
       <el-button @click="openDialog">我要请假</el-button>
     </el-col>
      <el-col class="boxCol">
        <div style="padding: 14px;" v-for="item in holidayList">
          <el-button v-if="item.status==1 || item.status==2" @click="deleteButton(item.id)">删除</el-button>
          <p>{{item.name}}</p>
          <p>{{item.phone}}</p>
          <p>请假类型:{{item.tname}}</p>
          <p>请假时间:</p>
          <span>{{item.timebegin |StampChanYear}}</span>
          <p>结束时间:</p>
          <span>{{item.timeover | StampChanYear}}</span>
          <p>请假理由:</p>
          <span>{{item.reason}}</span>
          <p v-if="item.status==2">驳回理由:</p>
          <span v-if="item.status==2">{{item.callback}}</span>
          <div :class="{green:item.status==1,red:item.status==2}">
            <span v-if="item.status==0">待审批</span>
            <span v-if="item.status==1">已通过</span>
            <span v-if="item.status==2">未通过</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="请假单" id="dialog" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="ruleForm.name" auto-complete="off" class="required sizeA" :disabled="dialogFormVisible"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="ruleForm.phone" auto-complete="off" class="required sizeA" :disabled="dialogFormVisible"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model.trim="ruleForm.department1" auto-complete="off" class="required sizeA" :disabled="dialogFormVisible"></el-input>
        </el-form-item>
        <el-form-item label="请假类型" prop="type">
          <el-select v-model.trim="ruleForm.type" placeholder="请选择" class="required sizeA">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="timebegin">
          <el-date-picker type="datetime" :editable="false" v-model.trim="ruleForm.timebegin" auto-complete="off" format="yyyy-MM-dd HH:mm:ss" @change="getStime" class="required"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="timeover">
          <el-date-picker type="datetime" :editable="false" v-model.trim="ruleForm.timeover" auto-complete="off" format="yyyy-MM-dd HH:mm:ss" @change="getStime1" class="required"></el-date-picker>
        </el-form-item>
        <el-form-item label="理由" prop="reason">
          <el-input type="textarea" v-model.trim="ruleForm.reason" resize="none" :rows="3" :maxlength="100" class="required sizeA requiredA"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getHoliday,getDepart,getType,postHoliday,deleteHoliday,getUserDepat} from '../api'
  export default {
    name: 'app',
    data() {
      var validateReason = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('理由不能为空'));
        } else {
          callback();
        }
      };
      var validateOvertime = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('结束时间不能为空'));
        } else {
          callback();
        }
      };
      var validateBegintime = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('开始时间不能为空'));
        } else {
          callback();
        }
      };
      var validateType = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请假类型不能为空'));
        } else {
          callback();
        }
      };
      var validateDepartment = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('部门不能为空'));
        } else {
          callback();
        }
      };
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号不能为空'));
        } else {
          callback();
        }
      };
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('姓名不能为空'));
        } else {
          callback();
        }
      };
      return {
        title:'添加',
        loading:false,
        dialogFormVisible:false,
        ruleForm:{
          name:'',    //姓名
          phone:'',   //手机号
          department:'',  //部门
          department1:'',
          type:'',    //请假类型
          timebegin:'', //开始时间
          timeover:'',  //结束时间
          reason:''   //理由
        },
        rules: {
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          department: [
            { validator: validateDepartment, trigger: 'blur' }
          ],
          type: [
            { validator: validateType, trigger: 'blur' }
          ],
          timebegin: [
            { validator: validateBegintime, trigger: 'blur' }
          ],
          timeover: [
            { validator: validateOvertime, trigger: 'blur' }
          ],
          reason: [
            { validator: validateReason, trigger: 'blur' }
          ],
        },
        departList:[],  //部门列表
        typeList:[],   //请假列表
        holidayList:[],   //请假列表
      };
    },
    created:function(){
      //获取部门列表
      getDepart().then((res)=>{
        if(res.data.code==10000){
          this.departList=res.data.data;
        }
      })
      //获取请假类型
      getType().then((res)=>{
        if(res.data.code==10000){
          this.typeList=res.data.data;
        }
      })
      this.getHoliday();
    },
    mounted: function () {

    },
    methods: {
      getStime(val){
        this.ruleForm.timebegin=val;
      },
      getStime1(val){
        this.ruleForm.timeover=val;
      },
      openDialog(){
        if(!getCookie('name')||!getCookie('account')){
          return false;
        }
        let params={id:getCookie('account')};
        getUserDepat(params).then((res)=>{
            if(res.data.code==10000){
              this.ruleForm.department=res.data.data.department;
              this.ruleForm.department1=res.data.data.name;
              this.ruleForm.phone=res.data.data.phone;
            }
        })
        this.dialogFormVisible = true  ;
        this.ruleForm.name=getCookie('name');
      },
      getHoliday(){
        let params = {uid:getCookie('account')};
        getHoliday(params).then((res)=>{
          if(res.data.code==10000){
            this.holidayList=res.data.data;
          }else{
            this.$message.success('暂无请假记录!');
          }
        })
          .catch((err)=>{
            console.log(err)
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading=true;
            let params={uid:getCookie('account'),name:this.ruleForm.name,phone:this.ruleForm.phone,department:this.ruleForm.department,type:this.ruleForm.type,timebegin:this.ruleForm.timebegin,timeover:this.ruleForm.timeover,reason:this.ruleForm.reason };
            postHoliday(params).then((res)=>{
              if(res.data.code==10000){
                this.$message.success('请假成功,等待确认!');
                this.dialogFormVisible = false  ;
                this.loading=false;
                this.getHoliday();
                this.ruleForm={
                  name:'',    //姓名
                  phone:'',   //手机号
                  department:'',  //部门
                  type:'',    //请假类型
                  timebegin:'', //开始时间
                  timeover:'',  //结束时间
                  reason:''   //理由
                }
              }else{
                this.$message.error('请假失败,系统异常!');
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
      deleteButton(can1){
        this.$confirm('此操作该请假单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {id:can1}
          deleteHoliday(params).then((res)=>{
            if(res.data.code==10000){
              this.$message.success('删除成功!');
              this.getHoliday();
            }
          })
        })
          .catch(()=>{
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header{  width: 100%;  text-align: center;  border: 1px solid #ccc;  }
  .section{  width: 100%;  border:1px solid #ccc;  border-top:none;  padding: 10px;  }
  .breadcrumb-inner{  position: absolute;  top: 26px;  left: 10px;}
  .el-form{  max-width: 340px;  padding: 20px;  margin:0px auto;  }
  .required:after{  content: '*';  position: absolute;  color: #ff4949;  margin-left: 10px;  right: -20px;  top: 0;}
  .requiredA:after{  right: 20px;  }
  .sizeA,.el-date-editor{  width: 200px;  }
  .el-col>.el-button{  margin-bottom: 10px;  }
  .boxCol>div{  width: 320px;  float: left;  border: 1px solid #d9d9d9;  text-align: center;  position: relative;  overflow: hidden;  margin-right: 10px;  margin-bottom: 10px;}
  .boxCol>div>div{  width: 100px;  height: 50px;  line-height: 50px;  position: absolute;  right: -5px;  bottom: 20px;  transform:rotate(-45deg);  border: 1px solid #c9c9c9;  }
  .boxCol .green{  border: 1px solid green;  }
  .boxCol .red{  border: 1px solid red;  }
  .boxCol>div>.el-button{  position: absolute;  right: 10px;  }
</style>
