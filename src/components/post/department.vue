<template>
  <div class="app">
    <el-row class="header">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>部门查看</h3></el-row>
    <el-row class="section">
      <div id="myChart" :style="{width: '700px', height: '600px' }"></div>
      <el-col><el-button @click="dialogBtn">添加部门</el-button></el-col>
    </el-row>

    <!--添加-->
    <el-dialog title="" v-model="editFormVisible" :close-on-click-modal="false" id="dialog">
      <div class="content">
        部门名称 &nbsp;<el-input type="text" v-model.trim="name" auto-complete="off" :maxlength="20"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBtn">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getCookie} from '../../cookie'
  import {getDepart1,postDepart} from '../api'
  export default {
    name: 'app',
    data () {
      return {
        editFormVisible:false,
        name:''
      }
    },
    created:function(){

    },
    mounted: function () {
      this.drawLine();
    },
    methods: {
      drawLine(){
        getDepart1().then((res)=>{
            var arr=[];
          for(var i=0;i<res.data.total.length;i++){
            arr.push(res.data.total[i].name)
            for(var j=0;j<res.data.data.length;j++){
              if(res.data.total[i].name==res.data.data[j].name){
                res.data.total[i].value=res.data.data[j].count;
              }
            }
            if(res.data.total[i].value==null){
              res.data.total[i].value=0;
            }
          }

          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart'))
          // 绘制图表
          myChart.setOption({
            title : {
              text: '部门人数分布图',
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: arr
            },
            series : [
              {
                name: '部门人数',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:res.data.total,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          });
        })
          .catch((err)=>{
            this.$message.error('网络异常,请稍后重试!');
          })
      },
      dialogBtn(){
        this.editFormVisible=true;
        this.name='';
      },
      submitBtn(){
        if(this.name==''){
          this.$message.error('部门名称不能为空!');
          return false;
        }
        let params={name:this.name};
        postDepart(params).then((res)=>{
            if(res.data.code==10000){
              this.$message.success('添加成功!');
              this.drawLine();
              this.editFormVisible=false;
            }else{
              this.$message.error(res.data.data);
              this.name='';
            }
        })
          .catch((err)=>{
            this.$message.error('网络异常,请稍后重试!');
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
  .section>div{  margin: 0 auto;  }
  #dialog{  width: 900px;  margin:0px auto;  }
  .content{  width: 300px;  margin: 0 auto;  }
</style>
