function setCookie(c_name,value,expiredays)
{
    let exdate=new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name+ "=" + value +
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

//通过关键词访问艺术品
function getInfoByKey(key, value, index = 0){//key为获取信息的关键词，value为值，index是为搜索专门设置的索引

    if(key === "artworkID" && localStorage.getItem("work" + value)){
        return JSON.parse(localStorage.getItem("work" + value));
    }

    //查询商品详情信息
    let defer = $.Deferred();
    if(key === "search"){
        $.ajax({
            url:"search.php",
            data:{"key":value, "index": index},//携带的参数
            type: "GET",
            success(msg){
                defer.resolve(JSON.parse(msg));
            }
        });
    }else{
        $.ajax({
            url:"workInfor.php",
            data:{"key":key, "value":value},//携带的参数
            type: "GET",
            success(msg){
                console.log(key);
                console.log(msg);
                msg = JSON.parse(msg);
                if(!msg){
                    window.location = "index.html";
                }
                if(!localStorage.getItem("work" + msg["artworkID"])){
                    localStorage.setItem("work" + msg["artworkID"], JSON.stringify(msg));
                }
                defer.resolve(msg);
            },
        });
    }
    return defer.promise();
}
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
        height:300,
        width:300,
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
function modal_dialog(title1){
    $("#dialog-modal").dialog({
        height:600,
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
