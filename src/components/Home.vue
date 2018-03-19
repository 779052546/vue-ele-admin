<template>
  <div class="app">
    <el-row class="header">
      <span>公司信息管理系统</span>
      <div class="header-right">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">欢迎您,{{name}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="message">我的留言</el-dropdown-item>
            <el-dropdown-item @click.native="personal">个人信息管理</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-row>
    <el-row class="aside">
      <el-menu :default-active="$route.path" :unique-opened="true" class="el-menu-vertical-demo" router>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">人员档案</span>
          </template>
          <el-menu-item index="/Home/User" style="padding-left: 53px;" class="skipbtn">信息查看</el-menu-item>
          <el-menu-item index="/Home/Personal" style="padding-left: 53px;" class="skipbtn">个人信息管理</el-menu-item>
          <el-menu-item index="/Home/Password" style="padding-left: 53px;" class="skipbtn">登录密码修改</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">考勤管理</span>
          </template>
          <el-menu-item index="/Home/Check" style="padding-left: 53px;" class="skipbtn">个人打卡</el-menu-item>
          <el-menu-item index="/Home/Checkday" style="padding-left: 53px;" class="skipbtn">打卡每日统计</el-menu-item>
          <el-menu-item index="/Home/Holiday" style="padding-left: 53px;" class="skipbtn">请假单</el-menu-item>
          <el-menu-item index="/Home/Checkmonth" style="padding-left: 53px;" class="skipbtn">月打卡统计</el-menu-item>
          <el-menu-item index="/Home/Attendance" style="padding-left: 53px;" class="skipbtn" v-if="power">考勤统计表</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">薪资管理</span>
          </template>
          <el-menu-item index="/Home/Price" style="padding-left: 53px;" class="skipbtn">个人薪资</el-menu-item>
          <el-menu-item index="/Home/Pricesets" style="padding-left: 53px;" class="skipbtn" v-if="power">薪资调整</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">岗位管理</span>
          </template>
          <el-menu-item index="/Home/Depart" style="padding-left: 53px;" class="skipbtn">部门查看</el-menu-item>
          <el-menu-item index="/Home/Post" style="padding-left: 53px;" class="skipbtn">岗位查看</el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">信息交流</span>
          </template>
          <el-menu-item index="/Home/Message" style="padding-left: 53px;" class="skipbtn">留言</el-menu-item>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">工作提醒</span>
          </template>
          <el-menu-item index="/Home/Work" style="padding-left: 53px;" class="skipbtn">合同到期提醒</el-menu-item>
          <el-menu-item index="/Home/Birthday" style="padding-left: 53px;" class="skipbtn">生日提醒</el-menu-item>
          <el-menu-item index="/Home/Batch" style="padding-left: 53px;" class="skipbtn" v-if="power">审批提醒</el-menu-item>
        </el-submenu>
        <el-submenu index="7" v-if="power">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">绩效管理</span>
          </template>
          <el-menu-item index="/Home/Achievements" style="padding-left: 53px;" class="skipbtn">当月绩效</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-row>
   <el-row class="sectionT">
     <router-view class="router"></router-view>
   </el-row>
  </div>
</template>

<script>
import {setCookie,getCookie,delCookie} from '../cookie'
import {putStatus,getMessage0,getBatch0} from './api'
export default {
  name: 'app',
  data () {
    return {
      isCollapse: false,
      power:false,
      name:''
    }
  },
  created:function(){
    this.changeIdx(this.$route.path)
    if(getCookie('account')){
      if(getCookie('power')==9999){
        this.power=true;
      }else{
        this.power=false;
      }
      this.name=getCookie('name')
      let params={uid:getCookie('account')}
      getMessage0(params).then((res)=>{
          if(res.data.data!=0){
            this.$notify.info({
              title: '消息',
              message: '您有'+res.data.data+'条未读留言,请到信息交流模块下查看!',
            });
          }
      })
      if(this.power){
        getBatch0(params).then((res)=>{
          if(res.data.data!=0){
            this.$notify.info({
              title: '消息',
              message: '您有'+res.data.data+'条审批提醒,请到工作提醒模块下查看!',
              duration: 0,
            });
          }
        })
      }
    }
  },
  mounted:function(){
    this.init();
  },
  methods: {
    init:function(){
      if(getCookie('index')){
        $('.skipbtn').eq(getCookie('index')).css({'color':'#fff','background-color':'#C2AA5D'})
      }
      $('.skipbtn').each(function(i){
        $(this).on('click',function(){
          $('.skipbtn').css({'color':'#48576A','background-color':'#D9DEEA'});
          $(this).css({'color':'#fff','background-color':'#C2AA5D'});
          setCookie('index',i);
        })
      })
      var that = this;
      $(document).ready(function(e) {
        if (window.history && window.history.pushState) {
          $(window).on('popstate', function () {
            that.changeIdx(that.$route.path)
            $('.skipbtn').css({'color':'#48576A','background-color':'#D9DEEA'});
            $('.skipbtn').eq(getCookie('index')).css({'color':'#fff','background-color':'#C2AA5D'});
          });
        }
      });
    },
    logout:function(){
      let params = {id : getCookie('account'),status:0} ;
      putStatus(params).then((res)=>{})
      delCookie('account');
      delCookie('power');
      delCookie('name');
      delCookie('index');
      this.$router.push('/');
    },
    message:function(){
      this.$router.push({path:'/Home/Message'});
    },
    personal:function(){
      this.$router.push({path:'/Home/Personal'});
    },
    changeIdx:function(can1){
      if(can1=='/Home/User'){
        setCookie('index',0);
      }else if(can1=='/Home/Personal'){
        setCookie('index',1);
      }else if(can1=='/Home/Password'){
        setCookie('index',2);
      }else if(can1=='/Home/Check'){
        setCookie('index',3);
      }else if(can1=='/Home/Checkday'){
        setCookie('index',4);
      }else if(can1=='/Home/Holiday'){
        setCookie('index',5);
      }else if(can1=='/Home/Checkmonth'){
        setCookie('index',6);
      }else if(can1=='/Home/Attendance'){
        setCookie('index',7);
      }else if(can1=='/Home/Price'){
        setCookie('index',8);
      }else if(can1=='/Home/Pricesets'){
        setCookie('index',9);
      }else if(can1=='/Home/Depart'){
        setCookie('index',10);
      }else if(can1=='/Home/Post'){
        setCookie('index',11);
      }else if(can1=='/Home/Message'){
        setCookie('index',12);
      }else if(can1=='/Home/Work'){
        setCookie('index',13);
      }else if(can1=='/Home/Birthday'){
        setCookie('index',14);
      }else if(can1=='/Home/Batch'){
        setCookie('index',13);
      }else if(can1=='/Home/Achievements'){
        setCookie('index',14);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .app{  padding-top: 60px;  padding-left: 234px;  transition: all 0.2s ease 0s ;  }
  .header{  position: absolute;  height: 60px;  line-height: 60px;  width: 100%;  top: 0;  left: 0;  background-color: #0F4D76; border-bottom:1px solid #ccc; color: #fff;z-index: 1;  }
  .header>span{  font-size: 22px;  padding-left: 12px;float:left;}
  .header .header-right{  float: right;  }
  .header span{  color: #fff;  }
  .aside{  width: 234px;  height: 100%;  position: absolute;  top: 0px;  left: 0;  padding-top: 60px; background-color: #EEF1F6;  }
  .app .router{  padding: 10px;  margin:0;  }
  .breadcrumb-inner{  padding-left: 10px;  padding-top: 10px;  }
  .sectionT{  height: 100%;  overflow: auto;  }
</style>
