<template>
  <div class="app">
    <el-row class="header">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>考勤表</h3></el-row>
    <el-row class="section">
      <el-col v-if="power">月份<el-date-picker v-model.trim="date" type="month" placeholder="选择月份" :picker-options="pickerOptions" format="yyyy-MM" :editable="false" @change="valueFormat"></el-date-picker> <el-button type="primary" @click="drawLine">查询</el-button></el-col>
      <el-col class="elcol">
        <div id="myChart" :style="{width: '700px', height: '300px'}"></div>
        <div id="myChart1" :style="{width: '700px', height: '300px'}"></div>
        <div id="myChart2" :style="{width: '700px', height: '300px'}"></div>
        <div id="myChart3" :style="{width: '700px', height: '300px'}"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getAttdentype,getChecktype,getChecktf,getDepartCheck} from '../api'
  export default {
    name: 'app',
    data () {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        date:'',
        power:false
      }
    },
    created:function(){
      if(getCookie('power')==9999){
        this.power=true;
      }else{
        this.power=false;
      }
    },
    mounted: function () {
      this.date=this.chooseTime();
      this.drawLine();
    },
    methods: {
      drawLine(){
        let params={date: this.date}
        getAttdentype(params).then((res)=>{
          var arr=[];
          var arr1=[];
          for(var i=0;i<res.data.total.length;i++){
            arr1.push('0');
            for(var j=0;j<res.data.data.length;j++){
              if(res.data.total[i].name==res.data.data[j].name){
                arr1[i]=res.data.data[j].count;
              }
            }
            arr.push(res.data.total[i].name)
          }
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart'))
          // 绘制图表
          myChart.setOption({
            title: { text: '请假统计' },
            tooltip: {},
            xAxis: {
              data: arr
            },
            yAxis: {},
            series: [{
              name: '请假人数',
              type: 'bar',
              data: arr1
            }]
          });
          })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })

        getChecktype(params).then((res)=>{
          var arr=[];
          var arr1=[];
          for(var i=0;i<res.data.total.length;i++){
            arr1.push('0');
            for(var j=0;j<res.data.data.length;j++){
              if(res.data.total[i].name==res.data.data[j].name){
                arr1[i]=res.data.data[j].count;
              }
            }
            arr.push(res.data.total[i].name)
          }
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart1'))
          // 绘制图表
          myChart.setOption({
            title: { text: '打卡统计' },
            tooltip: {},
            xAxis: {
              data: arr
            },
            yAxis: {},
            series: [{
              name: '打卡次数',
              type: 'bar',
              data: arr1
            }]
          });
        })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })

        getChecktf(params).then((res)=>{
          var str,str1;
          if(res.data.data.length==0){
            str=null;
            str1=null;
          }else{
            if(res.data.data.length<2){
              if(res.data.data[0].status==0){
                str=res.data.data[0].count;
              }
              if(res.data.data[0].status==1){
                str1=res.data.data[0].count;
              }
              if(str==null){
                str=0;
              }
              if(str1==null){
                str1=0;
              }
            }else{
              if(res.data.data[0].status==0){
                str=res.data.data[0].count;
              }
              if(res.data.data[1].status==1){
                str1=res.data.data[1].count;
              }
              if(res.data.data[1].status==0){
                str=res.data.data[1].count;
              }
              if(res.data.data[0].status==1){
                str1=res.data.data[0].count;
              }
            }
          }

          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart2'))
          // 绘制图表
          myChart.setOption({
            title: {
              text: '考勤情况'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
              {
                name: '考勤情况',
                type: 'pie',
                radius: '55%',
                data:[
                  {value:str, name:'迟到打卡'},
                  {value:str1, name:'正常打卡'},
                ],
                roseType: 'angle',
                label: {
                  normal: {
                    textStyle: {
                      color: '#000'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    lineStyle: {
                      color: '#000'
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          });
        })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })

        getDepartCheck(params).then((res)=>{
          var arr=res.data.total;
          if(res.data.data.length==0){
            for(var i=0;i<arr.length;i++){
              arr[i].value=0;
            }
          }else{
            for(var i=0;i<arr.length;i++){
              for(var j =0;j<res.data.data.length;j++){
                if(arr[i].name==res.data.data[j].name){
                  arr[i].value=res.data.data[j].count;
                }
              }
            }
          }

          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart3'))
          // 绘制图表
          myChart.setOption({
            title: {
              text: '各部门迟到情况'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
              {
                name: '迟到情况',
                type: 'pie',
                radius: '55%',
                data:arr,
                roseType: 'angle',
                label: {
                  normal: {
                    textStyle: {
                      color: '#000'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    lineStyle: {
                      color: '#000'
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
              }
            ]
          });
        })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })

      },
      valueFormat:function(val){
        this.date=val;
      },
      chooseTime(){
        var val=new Date();
        var year=val.getFullYear();
        var month=val.getMonth()+1;
        if (month < 10) {
          month = '0' + month;
        }
        return year+"-"+month;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .elcol{  width: 100%;  }
  .elcol>div{  width: 50%;  float: left;  margin-top: 10px;  }
  .el-select, .el-input {  width: 180px  }
</style>
