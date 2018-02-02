<template>
  <div class="app">
    <el-row class="header"><h3>生日提醒</h3></el-row>
    <el-row class="section">
      <div v-for="(item, index) in tableData" :key="item.id" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }">
          <img src="/static/img/timg.jpg" class="image">
          <div style="padding: 14px;">
            <span>{{item.name}}</span>
            <div class="bottom clearfix">
              <time class="time">生日：{{ item.birthday | Birthday}}</time>
            </div>
          </div>
        </el-card>
      </div>
    </el-row>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getWorkbirthday} from '../api'
  export default {
    name: 'app',
    data() {
      return {
        tableData:[],
      };
    },
    created:function(){
      this.getWorkbirthday()
    },
    mounted: function () {

    },
    methods: {
      getWorkbirthday(){
        getWorkbirthday().then((res)=>{
          this.tableData=res.data.data;
          var arr=[];
          for(var i=0;i<this.tableData.length;i++){
            if (this.tableData[i].birthday!=null){
                arr.push(this.tableData[i])
            }
          }
          this.tableData=arr;
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .section>div{  width: 280px;  float: left;  margin-left:10px;  margin-bottom: 10px;}
  .section img{  width: 280px;  }
  .section{  padding: 50px;  }
</style>
