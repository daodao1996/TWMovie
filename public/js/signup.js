'use strict';

const BASE_URL = 'http://pi5abz.natappfree.cc';

$("#signup").click(function () {
    if(ifNUll()){
        username();
    }
});

function ifNUll() {
    let flag=true;
    if($("#username").val().length<1){
        alert("用户名不能为空");
        flag=false;
    }
    if($("#password").val().length<1){
        alert("密码不能为空");
        flag=false;
    }
    if($("#email").val().length<1){
        alert("邮箱不能为空");
        flag=false;
    }
    return flag;
}


function username() {
    let nname=$("#username").val();
    $.ajax({
        type:'POST',
        url:BASE_URL+'/signup.html/username',
        data:{
           name: nname
        },
        datatype:'JSON',
        crossDomain:true,
        success:function (data) {
            judge(data,nname);
        }})
}

function judge(nameArray,uname) {   //判断用户输入的邮箱格式和两次输入的密码是否一致,用户名是否被占用
    let flag=true;
    nameArray.forEach(item => {
        if(item.username === uname)
            flag=false;
    });
    if(flag){
        if ($("#password").val() === $("#enterPassword").val()) {
            if (!$("#email").val().match(/^[a-z0-9]+([._]*[a-z0-9]+)*@[a-z0-9]+([_.][a-z0-9]+)+$/gi))
                alert("邮箱格式不正确！请重新输入");
            else
                signUp();
        }
        else
            alert("两次密码输入不一致，请重新输入");
    }
    else{
        alert("用户名已被占用");
    }
}

function signUp() {
    $.ajax({
        type:'POST',
        url:BASE_URL+'/signup.html',
        data:{
            username:$("#username").val(),
            password:$("#password").val(),
            email:$("#email").val()
        },
        datatype:'JSON',
        crossDomain:true,
        success:function (data) {
            console.log(data);
            if(data===true){
                alert("注册成功");
                sessionStorage.setItem("onlineUser",$("#username").val());
                let url = sessionStorage.getItem("beforeLogin");
                if(url){
                    location.href=url;
                    sessionStorage.removeItem("beforeLogin");
                }
                else
                    location.href=document.referrer;

            }
            else {
                alert("注册失败，请稍后再试");
            }
        }})
};


