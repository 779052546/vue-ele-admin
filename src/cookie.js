/**
 * Created by Administrator on 2018/1/16.
 */
/**
 * Created by Administrator on 2017/10/31.
 */
export function setCookie(c_name,value,expire) {

  // var date=new Date()
  // date.setSeconds(date.getSeconds()+expire)
  // document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
  document.cookie=c_name+ "="+escape(value)
}

export function setcookie(c_name,value,expire) {

  var date=new Date()
  date.setSeconds(date.getSeconds()+expire)
  document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
}


/*获取cookie*/
export function getCookie(c_name){
  if (document.cookie.length>0){
    let c_start=document.cookie.indexOf(c_name + "=")
    if (c_start!=-1){
      c_start=c_start + c_name.length+1
      let c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(document.cookie.substring(c_start,c_end))
    }
  }
  return ""
}

/*删除cookie*/
export function delCookie(c_name){
  setCookie(c_name, "", -1)
}

//forword
export function forword(c1,c2,c3,c4){
  // request_scope
  var str='id='+c2+'&request_scope='+JSON.stringify(c3)+'&redircet_url='+c4;
  let url=window.location.href;
  let location= url.replace(url.substring(url.lastIndexOf('/')+1, url.length),c1);
  window.location.href = location+'?'+str;
}

//redircet
export function redircet(){
  var url=window.location.href;
  var request_scope = url.substring(url.lastIndexOf('request_scope'), url.length);
  request_scope = decodeURIComponent(request_scope);
  let scope = request_scope.split('&redircet_url=')[0].split('=')[1];
  let redircet = request_scope.split('&redircet_url=')[1];
  window.location.href = redircet +'?request_scope='+scope;
}

