<template>
  <div class="app">
    <el-row class="header"><h3>合同到期提醒</h3></el-row>
    <el-row class="section" style="height: 500px; padding-top: 100px" v-if="!power">
      <el-carousel type="card" height="260px" indicator-position="none">
        <el-carousel-item >
          <h3>{{ workId.name }} </h3>
          <div>到职日期{{ workId.entry | StampChan1}}</div>
        </el-carousel-item>
      </el-carousel>
    </el-row>
    <el-row class="section" style="height: 500px; padding-top: 100px" v-if="power">
      <el-carousel :interval="4000" type="card" height="260px" indicator-position="none">
        <el-carousel-item v-for="item in tableData" :key="item.id">
          <h3>{{ item.name }} </h3>
          <div>到职日期{{ item.entry | StampChan1}}</div>
        </el-carousel-item>
      </el-carousel>
    </el-row>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getWorkbirthday,getWorkbirthdayId} from '../api'
  export default {
    name: 'app',
    data() {
      return {
        tableData:[],

        workId:'',

        power:false
      };
    },
    created:function(){
      if(getCookie('power')==9999){
        this.power=true;
        this.getWorkbirthday()
      }else{
        this.power=false;
        this.getWorkId();
      }
    },
    mounted: function () {

    },
    methods: {
      getWorkbirthday(){
        getWorkbirthday().then((res)=>{
          this.tableData=res.data.data;
        })
      },
      getWorkId(){
        let params={id:getCookie('account')}
        getWorkbirthdayId(params).then((res)=>{
          this.workId=res.data.data;
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 180px;
    margin: 0;
  }
  .el-carousel__item{  text-align: center;  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
