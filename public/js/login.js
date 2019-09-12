'use strict';

const BASE_URL = 'http://pi5abz.natappfree.cc';

$("#login").click(function () {
    $.ajax(
        console.log("ajax"),
        {
        type:'POST',
        url:BASE_URL+'/login.html',
        data:{
            username:$("#username").val(),
            password:$("#password").val()
        },
        datatype:'JSON',
        crossDomain:true,
        success:function (data) {    //后台进行密码的比对
            //console.log(data);
            if(data===true){
                sessionStorage.setItem("onlineUser",$("#username").val());
                alert("登录成功");
                var lastUrl=document.referrer;
                location.href=lastUrl;
            }
            else {
                alert("用户名或密码错误");
            }
        }})
});
function signUp() {
    sessionStorage.setItem("beforeLogin",document.referrer);
    location.href=BASE_URL+"/signup.html";
}


