<template>
  <div class="app">
    <el-row class="header">
      <div class="header-right">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">{{name}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
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
          <el-menu-item index="/Home/Personal" style="padding-left: 53px;" class="skipbtn" @click="skipBtn">单人信息管理</el-menu-item>
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
          <el-menu-item index="/Home/Attendance" style="padding-left: 53px;" class="skipbtn">考勤统计表</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">绩效管理</span>
          </template>
          <el-menu-item index="/Home/Achievements" style="padding-left: 53px;" class="skipbtn">当月绩效</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">工作提醒</span>
          </template>
          <el-menu-item index="/Home/Work" style="padding-left: 53px;" class="skipbtn">合同到期提醒</el-menu-item>
          <el-menu-item index="/Home/Birthday" style="padding-left: 53px;" class="skipbtn">生日提醒</el-menu-item>
          <el-menu-item index="/Home/Batch" style="padding-left: 53px;" class="skipbtn">审批提醒</el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">薪资管理</span>
          </template>
          <el-menu-item index="/Home/Price" style="padding-left: 53px;" class="skipbtn">薪资查看</el-menu-item>
          <el-menu-item index="/Home/Pricesets" style="padding-left: 53px;" class="skipbtn">薪资调整</el-menu-item>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">岗位管理</span>
          </template>
          <el-menu-item index="/Home/Depart" style="padding-left: 53px;" class="skipbtn">部门查看</el-menu-item>
          <el-menu-item index="/Home/Post" style="padding-left: 53px;" class="skipbtn">岗位查看</el-menu-item>
          <el-menu-item index="/Home/Departsets" style="padding-left: 53px;" class="skipbtn">部门增改</el-menu-item>
          <el-menu-item index="/Home/Postsets" style="padding-left: 53px;" class="skipbtn">岗位增改</el-menu-item>
        </el-submenu>
        <el-submenu index="7">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">信息交流</span>
          </template>
          <el-menu-item index="/Home/Room" style="padding-left: 53px;" class="skipbtn">留言</el-menu-item>
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
import {getUserId,putStatus} from './api'
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
    if(getCookie('account')){
      let params = {id : getCookie('account')} ;
      getUserId(params).then((res)=>{
          if(res.data.code==10000){
            setCookie('power',res.data.data.power);
            setCookie('name',res.data.data.name);
            this.name=res.data.data.name;
            let params = {id : getCookie('account'),status:1} ;
            putStatus(params).then((res)=>{})
          }else if(res.data.code==9999){
            this.$message.error(res.data.data);
          }
      })
    }
  },
  mounted:function(){
    this.init();
  },
  methods: {
      init:function(){
        if(getCookie('inde')){
          $('.skipbtn').eq(getCookie('inde')).css({'color':'#fff','background-color':'#C2AA5D'})
        }

        $('.skipbtn').each(function(i){
          $(this).on('click',function(){
            $('.skipbtn').css({'color':'#48576A','background-color':'#D9DEEA'});
            $(this).css({'color':'#fff','background-color':'#C2AA5D'});
            setCookie('inde',i);
          })
        })
      },
    logout:function(){
      let params = {id : getCookie('account'),status:0} ;
      putStatus(params).then((res)=>{})
      delCookie('account');
      delCookie('power');
      delCookie('name');
      this.$router.push('/');
    },
    skipBtn:function(){
      this.$router.push({path:'/Home/Personal',query:{id:getCookie('account')}});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .app{  padding-top: 60px;  padding-left: 234px;  transition: all 0.2s ease 0s ;  }
  .header{  position: absolute;  height: 60px;  line-height: 60px;  width: 100%;  top: 0;  left: 0;  background-color: #0F4D76; border-bottom:1px solid #ccc; color: #fff;z-index: 1;  }
  .header .header-right{  float: right;  }
  .header span{  color: #fff;  }
  .aside{  width: 234px;  height: 100%;  position: absolute;  top: 0px;  left: 0;
    padding-top: 60px; background-color: #EEF1F6;  }
  .app .router{  padding: 10px;  margin:0;  }
  .breadcrumb-inner{  padding-left: 10px;  padding-top: 10px;  }
  .sectionT{
    height: 100%;
    overflow: auto;
  }
</style>
