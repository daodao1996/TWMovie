'use strict';

const BASE_URL = 'http://pi5abz.natappfree.cc';

function getValue() {  //从后台获取相应电影的详细信息
    $.ajax(
        {
            type:'POST',
            url:BASE_URL+'/detail.html',
            data:{
              id:window.location.search.split("=")[1]
            },
            datatype:'JSON',
            crossDomain:true,
            success:function (data) {
                //console.log(data);
                showValue(data[0][0]);
                showComments(data[1]);
                hide();
            }})
};

function hide() {      //监测用户是否登录，然后选择性显示相应的按钮
    let flag = sessionStorage.getItem("onlineUser");
    $("#pingfen").attr("disabled",true);
    $("#niandai").attr("disabled",true);
    $("#wayOption").attr("disabled",true);
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
let score;
$("#giveMark").click(function () {     //用户点击“我要打分”按钮的监听函数
    let flag = sessionStorage.getItem("onlineUser");
    if(flag===null){
        alert("请先登录");
        window.location.href=BASE_URL+'/login.html';
    }
    else{
        score = getScore();
       // console.log(score);
    }
});

$("#writeComment").click(function () {     //用户需要登陆后才能评论
    let flag = sessionStorage.getItem("onlineUser");
    if(flag===null){
        alert("请先登录");
        window.location.href=BASE_URL+'/login.html';
    }
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

function submitComment() {        //确认提交评论的监听函数
    console.log($("#comment").val());
    $.ajax(
        {
            type:'POST',
            url:BASE_URL+'/detail.html/comment',
            data:{
                movieid:window.location.search.split("=")[1],
                username:sessionStorage.getItem("onlineUser"),
                comment:$("#comment").val()
            },
            datatype:'JSON',
            crossDomain:true,
            success:function (data) {
                //console.log(data);
                location.reload();
            }})
};

function gotoSearch() {     //搜索按钮的监听函数
    let text = document.getElementById("keyWord");
    window.location.href=encodeURI(BASE_URL+'/searchResult.html?keyWord='+text.value);
};

$("#subScore").click(function () {      //确认提交分数按钮的监听函数
    var GradList = document.getElementById("QuacorGrading").getElementsByTagName("input");
    let count=0;
    for(var Qi=0;Qi<GradList.length;Qi++){
       if(GradList[Qi].style.backgroundPosition === 'left center')
           count++;
    }
    $.ajax(
        console.log("ajax"),
        {
            type:'POST',
            url:BASE_URL+'/detail.html/rating',
            data:{
                id:window.location.search.split("=")[1],
                score:count
            },
            datatype:'JSON',
            crossDomain:true,
            success:function (data) {
                if(data===true){
                    alert("评价成功！");
                    location.reload();
                }
            }})
});

function getScore() {    //控制星星打分的函数
    var GradList = document.getElementById("QuacorGrading").getElementsByTagName("input");
    let i=0;
    for(var di=0;di<parseInt(document.getElementById("QuacorGradingValue").getElementsByTagName("font")[0].innerHTML);di++){
        GradList[di].style.backgroundPosition = 'left center';
    }

    for(i=0;i < GradList.length;i++){
        GradList[i].onmouseover = function(){
            for(var Qi=0;Qi<GradList.length;Qi++){
                GradList[Qi].style.backgroundPosition = 'right center';
            }
            for(var Qii=0;Qii<this.name;Qii++){
                GradList[Qii].style.backgroundPosition = 'left center';
            }
            document.getElementById("QuacorGradingValue").innerHTML = '<b><font size="5" color="#fd7d28">'+this.name+'</font></b>分';
        }
    }
}

function showComments(comArray) {   //生成评论区的内容
    if(comArray.length<1){
        let p =document.createElement("p");
        p.innerHTML="还没有人评论过,快来留下你的评论吧～";
        $("#userComments").append(p);
    }
    else{
        comArray.forEach(item => {
            let divRow = document.createElement("div");
            divRow.setAttribute("class","row");
            divRow.setAttribute("style","border-top:0.5px solid lightskyblue");
            let divC = document.createElement("div");
            divC.setAttribute("class","col-xs-8 col-md-8");
            let i = document.createElement("i");
            i.setAttribute("class","glyphicon glyphicon-user");
            let h3 = document.createElement("h3");
            h3.innerHTML=item.username;
            h3.append(i);
            //i.append(h3);
            let h4 = document.createElement("h4");
            h4.innerHTML=item.comment;
            divC.append(h3);
            divC.append(h4);
            divRow.append(divC);
            $("#userComments").append(divRow);
        });
    }
}

function showValue(data) {   //控制div显示相应的内容
    addLi(data.directors,"directors");
    addLi(data.casts,"casts");
    addLi(data.genres,"genres");
    showRecommend(data.genres.split(","));
    $("#title").html(data.title);
    $("#ftitle").html(data.original);
    $("#summary").html(data.summary);
    $("#moviePic").html("<img src='"+data.image+"'>");
    $("#year").html(data.year);
    $("#rating").html(data.rating+"分");
    $("#ratingCount").html(data.ratingCount+"人打过分");
}

function showRecommend(kindArray) {   //根据当前电影的分类随机选择一个分类进行相似电影推荐
    let n = rndNum(kindArray.length);
    let movieid = window.location.search.split("=")[1];
    $.ajax(
        {
            type:'POST',
            url:BASE_URL+'/detail.html/recommend',
            data:{
                kind:kindArray[n]
            },
            datatype:'JSON',
            crossDomain:true,
            success:function (data) {
                 addRecommend(data,movieid);
            }})
}

function rndNum(n) {    //生成随机数的函数
    let rnd = Math.floor(Math.random()*n);
    return rnd;
}

function addRecommend(data,movieid) {   //随机选择四部电影给用户推荐
        let count = data.length;
        let divRow = document.createElement("div");
        divRow.setAttribute("class", "row");
        divRow.setAttribute("style", "width:80%;margin-left:10%");
        let index=[];
        if(count<4){      //如果总数不足四部则全部推荐不用生成随机数
            for(let iter=0;iter<count;iter++)
                index.push(iter);
        }
        else{       //如果总数大于四部则随机选择四部推荐
            do{
                let num=rndNum(count);
                if(index.indexOf(num)===-1)
                    index.push(num);
            }while(index.length<=4);
        }
        let recommendCount=0;
        for(let item of index){
            if(data[item].id!==movieid){
                recommendCount++;
                let div = document.createElement("div");
                div.setAttribute("class", "col-xs-3");
                let divThum = document.createElement("div");
                divThum.setAttribute("class", "thumbnail");
                divThum.setAttribute("align", "center");
                divThum.setAttribute("style", "height:220px;width:150px;");
                divThum.setAttribute("value",data[item].id);
                divThum.onclick = function () {
                    window.location.href = BASE_URL+'/detail.html?id='+data[item].id;
                };
                let divImg = document.createElement("div");
                divImg.innerHTML = `<img width="96px" height="155px" src="${data[item].image}">`;
                let divCap = document.createElement("div");
                divCap.setAttribute("class", "caption");
                divCap.innerHTML = `<p>${data[item].title}</p>`;
                divThum.append(divImg);
                divThum.append(divCap);
                div.append(divThum);
                divRow.append(div);
            }

            if(recommendCount>=4)
                break;
        }
        $("#recommend").append(divRow);
};

function addLi(data,name) {    //自动生成li
    let ol = document.getElementById(name);
    let array = data.split(",");
    array.forEach(item =>{
        let li = document.createElement("li");
        li.innerHTML=item;
        ol.append(li);
    });
}
