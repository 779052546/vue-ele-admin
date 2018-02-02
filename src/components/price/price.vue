<template>
  <div class="app">
    <el-row class="header"><h3>薪资查看</h3></el-row>
    <el-row class="section">
      <el-row>
        <el-col :xs="4" :sm="6" :md="6" :lg="4" style="min-width: 270px;">成员姓名<el-input v-model.trim="filters.name" style="width: 180px;" :maxlength="20"></el-input></el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8"> <el-button type="primary" @click="getRole">查询</el-button></el-col>
      </el-row>
      <el-row>
        <el-table v-loading.body="loading" :data="tableData" border height="651">
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
          <el-table-column label="状态" prop="status" align="center" min-width="120">
            <template slot-scope="scope">
              <div><span v-if="scope.row.status==0">无效</span><span v-if="scope.row.status==1">有效</span></div>
            </template>
          </el-table-column>
          <el-table-column label="角色" prop="role" align="center" min-width="120">
            <template slot-scope="scope">
              <div><span v-for="(item,index) in scope.row.role">{{item.name}}<span v-if="index<scope.row.role.length-1?true:false">,</span></span></div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" sortable prop="createTime" align="center" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.createTime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" sortable prop="updateTime" align="center" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.updateTime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="110" fixed="right">
            <template slot-scope="scope">
              <div><el-button type="primary" size="small" @click="skipBtn(scope.$index, scope.row)">详情</el-button></div>
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
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        filters:{
          name:'',  //成员姓名
          order:'',   //排序字段名
          sort:'',   //排序规则（asc：升序，desc：降序）
        },
        tableData:null,    //数组
        page: 1,
        totalCount:0,   //总共多少条数据
        size:30,   //每页多少条数据
        loading:false,
      }
    },
    created:function(){

    },
    mounted: function () {

    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getRole();
      },
      skipBtn:function(can1,can2){
//        this.$router.push({path:'/Home/Rolesets',query:{id:can2.id}})
      },
      skipBtn1:function(){

      },
      getRole(){
        this.loading=true;
        let params={page:this.page,order:this.filters.order,sort:this.filters.sort,name:this.filters.name};
        getRoleList(params).then((res)=>{
          if(res.data.code==10000){
            this.loading=false;
          }
        })
          .catch((err)=>{
            this.loading=false;
            this.$message.error('网络异常,请稍后重试!');
          })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../public.css';
</style>
