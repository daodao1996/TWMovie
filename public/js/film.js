"use strict";

const BASE_URL = 'http://pi5abz.natappfree.cc';

$("#search").click(function () {
    let text = document.getElementById("keyWord");
    window.location.href=encodeURI(BASE_URL+'/searchResult.html?keyWord='+text.value);
});

$("#login").click(function () {
    window.location.href=BASE_URL+'/login.html';
});

$("#signUp").click(function () {
    window.location.href=BASE_URL+'/signup.html';
});

$("#signOut").click(function () {
    sessionStorage.removeItem("onlineUser");
    location.reload();
});

function order(ele) {     //用户点击排序按钮时调用，接收后台传回的有序数组，然后显示
    $.ajax(
        {
            type:'POST',
            url:BASE_URL+'/film.html/order',
            data:{
                kind:sessionStorage.getItem("kind"),
                att:ele.value,
                way:$("#wayOption").val()
            },
            datatype:'JSON',
            crossDomain:true,
            success:function (data) {
                $("#detail").empty();
                addPageDiv(data);
            }})
}

function hide() {       //用来监测用户是否登录，如果已经登录则显示用户名和退出按钮。如果没有登录则显示登录和注册按钮
    let flag = sessionStorage.getItem("onlineUser");
    if(flag===null){
        $("#login").show();
        $("#signUp").show();
        $("#loginState").hide();
        $("#signOut").hide();
    }
    else{
        $("#loginState").show();
        $("#loginState").html(sessionStorage.getItem("onlineUser")+"已登录");
        $("#signOut").show();
        $("#login").hide();
        $("#signUp").hide();
    }
}

function getKinds() {    //获得所有分类，自动显示在首页
    $.ajax(
        {
            type:'POST',
            url:BASE_URL+'/film.html',
            data:{
                kind:""
            },
            dataType:'JSON',
            crossDomain:true,
            success:function (data) {
                addEle(data);
                hide();
            }});
}

function addEle(kinds){      //根据存储分类的数组自动生成分类导航条
    let ul=$("#kindList");
    kinds.forEach(item=>{
        let li=document.createElement("li");
        li.innerHTML=`<a href="#">${item}</a>`;
        li.setAttribute("role","presentation");
        li.setAttribute("value",item);
        li.onclick= function(){
            sessionStorage.setItem("kind",item);
            $.ajax(
                {
                    type:'POST',
                    url:BASE_URL+'/film.html/fenlei',
                    data:{
                        kind:item
                    },
                    dataType:'JSON',
                    crossDomain:true,
                    success:function (data) {
                        console.log(data);
                        $("#detail").empty();
                        addPageDiv(data);
                    }});

        };
        ul.append(li);
    });

}

function addPageDiv(data) {    //根据传入的电影信息数组，自动生成电影列表
    let count = 0;
    while (count < data.length) {
        let divRow = document.createElement("div");
        divRow.setAttribute("class", "row");
        divRow.setAttribute("style", "width:80%;margin-left:10%;height:250px;");
        let n=0;
        if(data.length-count<4)
            n=data.length;
        else
            n=count+4;

        for (let i = count; i < n; i++) {
            let div = document.createElement("div");
            div.setAttribute("class", "col-xs-3");
            let divThum = document.createElement("div");
            divThum.setAttribute("class", "thumbnail");
            divThum.setAttribute("style", "height:210px;width:150px");
            divThum.setAttribute("value",data[i].id);
            divThum.onclick = function () {
                window.location.href = BASE_URL+'/detail.html?id='+data[i].id;
            };
            divThum.setAttribute("align", "center");
            let divImg = document.createElement("div");
            divImg.innerHTML = `<img src="${data[i].image}" style="height: 155px;width: 96px">`;
            let divCap = document.createElement("div");
            divCap.setAttribute("class", "caption");
            divCap.innerHTML = `<p>${data[i].title}</p >`;
            divThum.append(divImg);
            divThum.append(divCap);
            div.append(divThum);
            divRow.append(div);
        }
        count += 4;
        $("#detail").append(divRow);
    }

}