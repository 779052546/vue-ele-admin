/**
 * Created by Administrator on 2018/1/23.
 */

import axios from 'axios';

var url = process.env.API_ROOT;
//登陆账号
export const postAccount = params =>{ return axios.post(url+'/account',params)}

//获取人员信息
export const getUser = params =>{ return axios.get(url+'/user',{params:params})}
//修改登录状态
export const putStatus = params =>{ return axios.put(url+'/userStatus',params)}
//重置登录密码
export const postUserpass = params =>{ return axios.post(url+'/passreset',params)}
//删除该用户
export const deleteUser = params =>{ return axios.delete(url+'/deleteuser',{params:params})}
//获取单人详细信息
export const getUserPhone = params =>{ return axios.get(url+'/userphone',{params:params})}
//获取单人人员权限信息
export const getUserId = params =>{ return axios.get(url+'/userid',{params:params})}
//添加人员信息
export const postUserId = params =>{ return axios.post(url+'/user',params)}
//修改人员信息
export const putUserId = params =>{ return axios.put(url+'/user',params)}
//修改密码
export const putPass = params =>{ return axios.put(url+'/pass',params)}



//个人上班打卡
export const postCheck = params =>{ return axios.post(url+'/check',params)}
//今日打卡查询
export const getCheck = params =>{ return axios.get(url+'/check',{params:params})}
export const getCheckUser = params =>{ return axios.get(url+'/checkuser',{params:params})}
//请假单查询
export const getHoliday = params =>{ return axios.get(url+'/holiday',{params:params})}
//请假单添加
export const postHoliday = params =>{ return axios.post(url+'/holiday',params)}
//删除请假单
export const deleteHoliday = params =>{ return axios.delete(url+'/deleteholiday',{params:params})}
//打卡月统计查询
export const getCheckMonth = params =>{ return axios.get(url+'/checkmonth',{params:params})}
//考勤统计--各部门请假数量
export const getAttdentype = params =>{ return axios.get(url+'/attdentype',{params:params})}
//考勤统计--各部门打卡数量
export const getChecktype = params =>{ return axios.get(url+'/checktype',{params:params})}
//考勤统计--迟到打卡与正常打卡
export const getChecktf = params =>{ return axios.get(url+'/checktf',{params:params})}
//考勤统计--各部门迟到打卡
export const getDepartCheck = params =>{ return axios.get(url+'/departcheck',{params:params})}

//当月绩效
export const getAchievements = params =>{ return axios.get(url+'/achievements',{params:params})}

//工作提醒
export const getWorkbirthday = params =>{ return axios.get(url+'/workbirthday',{params:params})}
//工作提醒-个人查询
export const getWorkbirthdayId = params =>{ return axios.get(url+'/workbirthdayid',{params:params})}

//工作提醒 -审批提醒
export const getBatch = params =>{ return axios.get(url+'/batch',{params:params})}










//获取部门信息
export const getDepart = params =>{ return axios.get(url+'/department',{params:params})}
//获取请假类型信息
export const getType = params =>{ return axios.get(url+'/type',{params:params})}
//获取岗位信息
export const getPost = params =>{ return axios.get(url+'/post',{params:params})}
//获取岗位信息
export const getPostId = params =>{ return axios.get(url+'/postid',{params:params})}
//获取权限信息
export const getPower = params =>{ return axios.get(url+'/power',{params:params})}
//左联查询查询用户哪个部门 用于请假
export const getUserDepat = params =>{ return axios.get(url+'/userdepartment',{params:params})}
