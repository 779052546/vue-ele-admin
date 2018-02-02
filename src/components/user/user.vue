<template>
  <div class="app">
    <el-row class="header"><el-breadcrumb separator="/" class="breadcrumb-inner">
      <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb><h3>信息查看</h3></el-row>
    <el-row class="section">
      <el-row>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">成员姓名<el-input v-model.trim="filters.name" style="width: 180px;" :maxlength="20"></el-input></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">手机号<el-input v-model.trim="filters.phone" style="width: 180px;" :maxlength="20"></el-input></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">部门<el-select v-model.trim="filters.depart">
          <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">性别<el-select v-model.trim="filters.sex">
          <el-option value="" label="全部">全部</el-option>
          <el-option value="0" label="男"></el-option>
          <el-option value="1" label="女"></el-option>
        </el-select></el-col>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">是否在线<el-select v-model.trim="filters.status">
          <el-option value="" label="全部">全部</el-option>
          <el-option value="1" label="在线"></el-option>
          <el-option value="0" label="不在线"></el-option>
        </el-select></el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8"> <el-button type="primary" @click="getUser">查询</el-button>&nbsp;<el-button type="primary" @click="dialogFormVisible = true" v-if="isTrue">增加</el-button></el-col>
      </el-row>
      <el-row>
        <el-table v-loading.body="loading" :data="tableData" border max-height="651">
          <el-table-column label="成员姓名" prop="name" align="center" min-width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="手机号码" prop="phone" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.phone}}</div>
            </template>
          </el-table-column>
          <el-table-column label="QQ" prop="qq" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.qq}}</div>
            </template>
          </el-table-column>
          <el-table-column label="E-mail" prop="Email" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.Email}}</div>
            </template>
          </el-table-column>
          <el-table-column label="性别" prop="sex" align="center" min-width="120" >
            <template slot-scope="scope">
              <div><span v-if="scope.row.sex==0">男</span><span v-if="scope.row.sex==1">女</span></div>
            </template>
          </el-table-column>
          <el-table-column label="个人签名" prop="textarea" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.textarea}}</div>
            </template>
          </el-table-column>
          <el-table-column label="生日" prop="birthday" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.birthday | StampChan}}</div>
            </template>
          </el-table-column>
          <el-table-column label="是否在线" prop="status" align="center" min-width="120" >
            <template slot-scope="scope">
              <div><span v-if="scope.row.status==0">不在线</span><span v-if="scope.row.status==1">在线</span></div>
            </template>
          </el-table-column>
          <el-table-column label="入职日期" prop="entry" align="center" min-width="120" >
            <template slot-scope="scope">
              <div>{{ scope.row.entry | StampChan}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="140px">
            <template slot-scope="scope">
              <div><el-button size="small" type="primary" @click="reset(scope.$index, scope.row)">重置密码</el-button><el-button size="small" type="danger" @click="deLete(scope.$index, scope.row)">删除此人</el-button></div>
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

    <el-dialog id="dialog" :visible.sync="dialogFormVisible">
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
          <el-form-item label="部门" prop="department">
            <el-select v-model="ruleForm.department" placeholder="请选择" class="required" @change="choosePostId">
              <el-option v-for="item in departList1" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位" prop="post">
            <el-select v-model="ruleForm.post" placeholder="请选择" class="required" @change="choosePost">
              <el-option v-for="item in postList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="power">
            <el-select v-model="ruleForm.power" placeholder="请选择" class="required">
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="leftBox">
          <el-form-item label="薪资" prop="price">
            <el-input type="text" placeholder="薪资自动计算" v-model.trim="ruleForm.price" auto-complete="off" class="required" :maxlength="16" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="基础工资" prop="basepay">
            <el-input type="text" v-model.trim="ruleForm.basepay" auto-complete="off" class="required" :maxlength="16" @change="price"></el-input>
          </el-form-item>
          <el-form-item label="岗位补贴" prop="postbt">
            <el-input type="text" v-model.trim="ruleForm.postbt" auto-complete="off" class="required" :maxlength="16" @change="price"></el-input>
          </el-form-item>
          <el-form-item label="全勤奖" prop="attendance">
            <el-input type="text" v-model.trim="ruleForm.attendance" auto-complete="off" class="required" :maxlength="16" @change="price"></el-input>
          </el-form-item>
          <el-form-item label="入职日期" prop="entry">
            <el-date-picker type="date" v-model.trim="ruleForm.entry" :editable="false" auto-complete="off" format="yyyy-MM-dd" @change="getStime" class="required" :maxlength="16"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading1" @dblclick="false">确 定</el-button>
          </el-form-item>
          <div style="height: 50px;">

          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {setCookie,getCookie} from '../../cookie'
  import {getDepart,getPower,getPost,getUser,postUserId,postUserpass,deleteUser,getPostId} from '../api'
  export default {
    name: 'app',
    data () {
      var validateRoles = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择角色'));
        } else {
          callback();
        }
      };
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
        filters:{
          name:'',  //成员姓名
          phone:'',
          status:'',
          sex:'',
          depart:''
        },
        tableData:null,    //数组
        page: 1,
        totalCount:0,   //总共多少条数据
        size:15,   //每页多少条数据
        loading:false,
        loading1:false,
        departList:[],   //部门列表
        departList1:[],
        postList:[],    //岗位
        roleList:[],
        dialogFormVisible:false,
        ruleForm: {
          name:'',   //成员姓名
          phone:'', //手机号码
          sex:'',  //性别
          department:'', //部门
          post:'',    //岗位
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
          power: [
            { validator: validateRoles, trigger: 'blur' }
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
        isTrue:false,   //是否为管理员
      }
    },
    created:function(){


      getPower().then((res)=>{
        if(res.data.code==10000){
          this.roleList=res.data.data;

          if(getCookie('power')==9999){
            this.isTrue=true;
          }else{
            this.isTrue=false;
          }
        }
      })

      getDepart().then((res)=>{
        if(res.data.code==10000){
          this.departList1=res.data.data;
          this.departList.push({"id":'',"name":'全部'});
          for(var i=0;i<res.data.data.length;i++){
            this.departList.push(res.data.data[i]);
          }
        }
      })

    },
    mounted: function () {
      this.getUser();
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getUser();
      },
      getUser(){
        this.loading=true;
        let params={page:this.page,name:this.filters.name,phone:this.filters.phone,status:this.filters.status,sex:this.filters.sex,depart:this.filters.depart};
        getUser(params).then((res)=>{
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading1=true;
            let params={name:this.ruleForm.name, phone:this.ruleForm.phone, sex:this.ruleForm.sex, birthday:this.ruleForm.birthday, textarea:this.ruleForm.textarea,department:this.ruleForm.department, post:this.ruleForm.post, jiguan:this.ruleForm.jiguan, address:this.ruleForm.address,education:this.ruleForm.education, qq:this.ruleForm.qq, email:this.ruleForm.email, power:this.ruleForm.power, price:this.ruleForm.price, entry:this.ruleForm.entry, basepay:this.ruleForm.basepay, postbt:this.ruleForm.postbt, attendance:this.ruleForm.attendance};
            postUserId(params).then((res)=>{
              if(res.data.code==10000){
                this.$message.success('添加成功!');
                this.loading1=false;
                this.dialogFormVisible=false;
                this.ruleForm={
                    name:'',   //成员姓名
                    phone:'', //手机号码
                    sex:'',  //性别
                    department:'', //部门
                    post:'',    //岗位
                    power:'',  //角色
                    price:'',
                    entry:'',  //入职日期
                    basepay:'', //基础工资
                    postbt:'',   //岗位补贴
                    attendance:'',  //全勤奖
                };
                this.getUser();
              }else if(res.data.code==10002){
                this.$message.error(res.data.data);
                this.loading1=false;
              }else{
                this.$message.error('添加失败!');
                this.loading1=false;
              }
            })
              .catch((err)=>{
                this.loading1=false;
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
      choosePostId(){
        this.ruleForm.post='';
        this.ruleForm.basepay=  ''; //基础工资
        this.ruleForm.postbt=  ''; //岗位补贴
        this.ruleForm.attendance= '';
        this.ruleForm.price= '';
        let params = {id:this.ruleForm.department};
        getPost(params).then((res)=>{
          if(res.data.code==10000){
            this.postList=res.data.data;
          }
        })
      },
      choosePost(){
        if( this.ruleForm.post==''){
          return false;
        }
        let params = {id:this.ruleForm.post};
        getPostId(params).then((res)=>{
          if(res.data.code==10000){
            this.ruleForm.basepay=  res.data.data[0].basepay; //基础工资
            this.ruleForm.postbt=  res.data.data[0].postbt; //岗位补贴
            this.ruleForm.attendance= res.data.data[0].attendance;  //全勤奖
            this.price();
          }
        })
      },
      deLete(can1,can2){
        if(can2.status==1){
          this.$message.error('该用户为在线状态,暂时无法删除!');
          return false;
        }
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {id:can2.id}
          deleteUser(params).then((res)=>{
            if(res.data.code==10000){
              this.$message.success('删除成功!');
              this.getUser();
            }
          })
        })
          .catch(()=>{
          })
      },
      reset(can1,can2){
        this.$confirm('此操作将密码重置为初始密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {id:can2.id}
          postUserpass(params).then((res)=>{
            if(res.data.code==10000){
              this.$message.success('重置成功!');
            }
          })
        })
          .catch(()=>{
          })
      },
      getStime(val){
        this.ruleForm.entry=val;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .el-table,.el-button,.el-select,.el-input{  margin-top: 10px;  margin-left:0;}
  .el-form .el-table,.el-form .el-button,.el-form .el-select,.el-form .el-input{  margin-top:0;  }
  .leftBox{  width: 50%;  float: left;  }
  #dialog{  width: 1500px;  margin: 0 auto;  }
  #dialog .el-dialog{  width: 100%;  display: inline-block;  }
  .el-table .el-button{
    margin-bottom: 10px;
  }
</style>
