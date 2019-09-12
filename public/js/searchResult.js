'use strict';

const BASE_URL = 'http://pi5abz.natappfree.cc';
function load() {     //解析url将搜索关键字传给后台，接收后台传来的电影数组，显示在页面上
    $.ajax(
        {
            type:'POST',
            url:BASE_URL+'/searchResult.html',
            data:{
                keyWord:decodeURI(window.location.search.split("=")[1])
            },
            datatype:'JSON',
            crossDomain:true,
            success:function (data) {
                console.log(data);
                $("#result").empty();
                getMovie(data);
                hide();
            }})
}

function gotoSearch() {    //搜索按钮的监听函数
    let text = document.getElementById("keyWord");
    window.location.href=encodeURI(BASE_URL+'/searchResult.html?keyWord='+text.value);
};

function order(ele) {       //排序按钮的监听函数
        $.ajax(
            {
                type:'POST',
                url:BASE_URL+'/searchResult.html/sort',
                data:{
                    keyWord:decodeURI(window.location.search.split("=")[1]),
                    att:ele.value,
                    way:$("#wayOption").val()
                },
                datatype:'JSON',
                crossDomain:true,
                success:function (data) {
                    //console.log(data);
                    $("#result").empty();
                    getMovie(data);
                }})
};

function hide() {     //实现监测用户登录状态，选择显示哪些功能按钮
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


function getMovie(data) {     //根据传入的电影信息数组，自动生成div显示在页面上
    let count = 0;
    let rows=0;
    let brcount=0;
    while (count < data.length) {
        let divRow = document.createElement("div");
        divRow.setAttribute("class", "row");
        divRow.setAttribute("style", "width:80%;margin-left:10%");
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
            divThum.setAttribute("align", "center");
            divThum.setAttribute("style", "height:220px;width:150px;");
            divThum.setAttribute("value",data[i].id);
            divThum.onclick = function () {
              window.location.href = BASE_URL+'/detail.html?id='+data[i].id;
            };
            let divImg = document.createElement("div");
            divImg.innerHTML = `<img width="96px" height="155px" src="${data[i].image}">`;
            let divCap = document.createElement("div");
            divCap.setAttribute("class", "caption");
            divCap.innerHTML = `<p>${data[i].title}</p>`;
            divThum.append(divImg);
            divThum.append(divCap);
            div.append(divThum);
            divRow.append(div);
        }
        count += 4;
        rows++;
        $("#result").append(divRow);
    }

    if(rows===0)
        brcount=28;
    else if(rows===1)
        brcount=16;
    else if(rows===2)
        brcount=4;

    for(let iter=0;iter<brcount;iter++){
        let br = document.createElement("br");
        $("#buquan").append(br);
    }
}