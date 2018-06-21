//设置cookie
function setCookie(c_name,value,expiredays)
{
    let exdate=new Date();
    exdate.setTime(exdate.getTime() + expiredays);
    document.cookie = c_name+ "=" + value +
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}


//通过关键词访问艺术品
function getInfoByKey(key, value){//key为获取信息的关键词，value为值

    if(key === "artworkID" && localStorage.getItem("work" + value)){
        return JSON.parse(localStorage.getItem("work" + value));
    }

    //查询商品详情信息
    let defer = $.Deferred();
    $.ajax({
        url:"workInfor.php",
        data:{"key":key, "value":value},//携带的参数
        type: "GET",
        success(msg){
            msg = JSON.parse(msg);
            if(!msg){
                window.location = "index.html";
            }
            localStorage.setItem("work" + msg["artworkID"], JSON.stringify(msg));
            defer.resolve(msg);
        },
    });
    return defer.promise();
}

//获得url参数
function getUrlParam(name,s = ""){

    //构造一个含有目标参数的正则表达式对象
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = "";
    if(s === "")
    //匹配目标参数
        r = window.location.search.substr(1).match(reg);
    else
        r = s.substr(1).match(reg);
    //返回参数值
    if (r!=null) return unescape(r[2]);
    return null;
}

//获得cookie
function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start !==-1 )
        {
            c_start=c_start + c_name.length+1;
            c_end = document.cookie.indexOf(";",c_start);
            if (c_end===-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return ""
}

//对话框提示信息
function remind(information){
    $("#dialog h2").html(information);
    $("#dialog").dialog({
        height:340,
        width:330,
        show: {
            effect: "blind",
            duration: 500
        },
        hide:{
            effect: "explode",
            duration: 1000
        }
    });
}

//模态框弹窗
function modal_dialog(title1,height = 600){
    $("#dialog-modal").dialog({
        height:height,
        width:500,
        title:title1,
        show: {
            effect: "blind",
            duration: 500
        },
        hide:{
            effect: "explode",
            duration: 1000
        }
    });
}

//获得购物车信息
function getMyCartInfor(){
    let defer = $.Deferred();
    $.ajax({
        url:"handleCart.php",
        type: "GET",
        success(msg){
            if(!msg){//为空
                localStorage.setItem("goodsNumber",0);
                localStorage.setItem("mycart", JSON.stringify({}));
                return;
            }
            msg = JSON.parse(msg);
            let temp = {};
            for(let i in msg){
                temp[i] = msg[i];
            }
            localStorage.setItem("goodsNumber",Object.getOwnPropertyNames(temp).length);
            localStorage.setItem("mycart", JSON.stringify(temp));
            defer.resolve(msg);
        }
    });
    return defer.promise()
}

//更新购物车数据库
function updateMyDB(){
    if(!localStorage.getItem("mycart")){
        return;
    }
    $.ajax({
        url:"handleCart.php",
        data:{"value":localStorage.getItem("mycart")},//携带的参数
        type: "POST"
    });
}

//购买权限判断
function getRoot(artworkIDs,timeReleased){
    console.log(timeReleased);
    let defer = $.Deferred();
    $.ajax({
        url:"order.php",
        data:{"artworkID":artworkIDs,"timeReleased":timeReleased},//携带的参数
        type: "GET",
        success(msg){
            defer.resolve(msg);
            console.log(msg);
        }
    });
    return defer.promise();
}
