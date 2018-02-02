import Vue from 'vue'
Vue.filter('StampChan',function(val){
  if(val==null){
    return val;
  }
  var val=new Date(val);
  var year=val.getFullYear();
  var month=val.getMonth()+1;
  var date=val.getDate();
  var hour=val.getHours();
  var minute=val.getMinutes();
  var second=val.getSeconds();
  if (month < 10) {
    month = '0' + month;
  }
  if (date < 10) {
    date = '0' + date;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (second < 10) {
    second = '0' + second;
  }
  return year+"-"+month+"-"+date ;

})

Vue.filter('StampChanYear',function(val){
  if(val==null){
    return val;
  }
  var val=new Date(val);
  var year=val.getFullYear();
  var month=val.getMonth()+1;
  var date=val.getDate();
  var hour=val.getHours();
  var minute=val.getMinutes();
  var second=val.getSeconds();
  if (month < 10) {
    month = '0' + month;
  }
  if (date < 10) {
    date = '0' + date;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (second < 10) {
    second = '0' + second;
  }
  return year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;

})

Vue.filter('ToFixed',function(val){
  val= val.toFixed(2);
  return val;
})

Vue.filter('StampChan1',function(val){
  if(val==null){
    return val;
  }
  var val=new Date(val);
  var year=val.getFullYear()+2;
  var month=val.getMonth()+1;
  var date=val.getDate();
  var hour=val.getHours();
  var minute=val.getMinutes();
  var second=val.getSeconds();
  if (month < 10) {
    month = '0' + month;
  }
  if (date < 10) {
    date = '0' + date;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (second < 10) {
    second = '0' + second;
  }
  return year+"-"+month+"-"+date ;

})

Vue.filter('Birthday',function(val){
  if(val==null){
    return val;
  }
  var val=new Date(val);
  var month=val.getMonth()+1;
  var date=val.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (date < 10) {
    date = '0' + date;
  }
  return month+"-"+date ;

})
