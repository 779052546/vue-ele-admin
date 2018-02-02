import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import User from '@/components/user/user.vue'
import Personal from '@/components/user/personal.vue'
import Password from '@/components/user/password.vue'
import Check from '@/components/check/check.vue'
import Checkday from '@/components/check/checkday.vue'
import Checkmonth from '@/components/check/checkmonth.vue'
import Holiday from '@/components/check/holiday.vue'
import Attendance from '@/components/check/attendance.vue'
import Achievements from '@/components/achievements/achievements.vue'
import Work from '@/components/work/work.vue'
import Birthday from '@/components/work/birthday.vue'
import Batch from '@/components/work/batch.vue'
import Price from '@/components/price/price.vue'
import Pricesets from '@/components/price/pricesets.vue'
import Depart from '@/components/post/department.vue'
import Departsets from '@/components/post/departmentsets.vue'
import Post from '@/components/post/post.vue'
import Postsets from '@/components/post/postsets.vue'
import Room from '@/components/talk/room.vue'
import {getCookie} from '../cookie'

Vue.use(Router)

const routes =[
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Home',
    component: Home,
    name:'人员档案',
    children:[
      {path:'User',component:User,name:'信息查看'},
      {path:'Personal',component:Personal,name:'单人信息管理'},
      {path:'Password',component:Password,name:'密码修改'},
    ]
  },
  {
    path: '/Home',
    component: Home,
    name:'考勤管理',
    children:[
      {path:'Check',component:Check,name:'个人打卡'},
      {path:'Checkday',component:Checkday,name:'打卡每日统计'},
      {path:'Checkmonth',component:Checkmonth,name:'月打卡统计'},
      {path:'Holiday',component:Holiday,name:'请假单'},
      {path:'Attendance',component:Attendance,name:'考勤统计表'},
    ]
  },
  {
    path: '/Home',
    component: Home,
    name:'绩效管理',
    children:[
      {path:'Achievements',component:Achievements,name:'当月绩效'},
    ]
  },
  {
    path: '/Home',
    component: Home,
    name:'工作提醒',
    children:[
      {path:'Work',component:Work,name:'合同到期提醒'},
      {path:'Birthday',component:Birthday,name:'生日提醒'},
      {path:'Batch',component:Batch,name:'审批提醒'},
    ]
  },
  {
    path: '/Home',
    component: Home,
    name:'薪资管理',
    children:[
      {path:'Price',component:Price,name:'薪资查看'},
      {path:'Pricesets',component:Pricesets,name:'薪资调整'},
    ]
  },
  {
    path: '/Home',
    component: Home,
    name:'岗位管理',
    children:[
      {path:'Depart',component:Depart,name:'部门查看'},
      {path:'Post',component:Post,name:'岗位查看'},
      {path:'Departsets',component:Departsets,name:'部门增改'},
      {path:'Postsets',component:Postsets,name:'岗位增改'},
    ]
  },
  {
    path: '/Home',
    component: Home,
    name:'信息交流',
    children:[
      {path:'Room',component:Room,name:'留言'},
    ]
  },
  {path:'*',redirect:'/Home/User'}
]

const router = new Router({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (getCookie('account')) {      //  拿到cookie 才允许进入页面
      next();
    }
    else {
      next({
        path: '/',
        query: {redirect: to.fullPath}
      })
    }
  }
  else {
    next();
  }
})

export default router;
