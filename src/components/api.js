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
export const getWorkbirthday1 = params =>{ return axios.get(url+'/workbirthday1',{params:params})}
//工作提醒-个人查询
export const getWorkbirthdayId = params =>{ return axios.get(url+'/workbirthdayid',{params:params})}
//工作提醒 -审批提醒
export const getBatch = params =>{ return axios.get(url+'/batch',{params:params})}
//工作提醒 -请假单批准
export const putBatchholiday = params =>{ return axios.put(url+'/batchholiday',params)}

//薪资管理
//薪资管理 -查看
export const getPrice = params =>{ return axios.get(url+'/price',{params:params})}
export const getPriceId = params =>{ return axios.get(url+'/priceid',{params:params})}
//薪资管理- 修改薪资
export const putPrice = params =>{ return axios.put(url+'/price',params)}

//岗位管理
//部门管理 -查看
export const getDepart1 = params =>{ return axios.get(url+'/depart')}
//部门管理 -添加
export const postDepart = params =>{ return axios.post(url+'/depart',params)}
//岗位管理 -查看
export const getPost1 = params =>{ return axios.get(url+'/post1',{params:params})}
//岗位管理 -添加
export const postPost1 = params =>{ return axios.post(url+'/post1',params)}
//岗位管理 -全勤调整
export const putPost1 = params =>{ return axios.put(url+'/post1',params)}

//信息交流
//信息交流 -查看
export const getMessage = params =>{ return axios.get(url+'/message',{params:params})}
export const getMessageUser = params =>{ return axios.get(url+'/messageuser',{params:params})}
//信息交流 -添加
export const postMessage = params =>{ return axios.post(url+'/message',params)}
//信息交流 -修改状态
export const putMessage = params =>{ return axios.put(url+'/message',params)}
//信息交流 -删除留言
export const deleteMessage = params =>{ return axios.delete(url+'/message',{params:params})}


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
//获取学历信息
export const getEducation = params =>{ return axios.get(url+'/education',{params:params})}
