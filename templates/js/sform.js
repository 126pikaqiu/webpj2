let scode;//定义验证码
let account;
let pwd;

//对话框提示信息
function remind(information){
    $("#dialog h2").html(information);
    $("#dialog").dialog({
        height:300,
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


window.onload = changecode;//刷新页面时获得验证码


//随机生成验证码
function getcode(n){
    let all = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    scode="";
    for(let i = 0; i < n; i++){
        scode+=all.charAt(Math.floor(Math.random() * 52));
    }
    return scode;
}



//更换验证码
function changecode(){
    $(".scode")[0].innerHTML = getcode(4);
}

//注册表单提交函数
$(".btn-signin").click(function(){
    $(".sform .tip").html("");//清除提示信息
    let tips = $(".sform .tip");
    //验证用户名
    account = $(".sform-account")[0];
    if(!account.value){
        tips[0].innerHTML = "用户名不能为空";
        account.focus();
        return false;//不提交表单
    }

    //验证密码
    pwd = $(".sform-pwd")[0];
    if(!pwd.value){
        tips[1].innerHTML = "密码不能为空";
        pwd.focus();
        return false;//不提交表单
    }

    //验证验证码
    let form_code = $(".sform-code")[0];
    if(!form_code.value || form_code.value !== scode){
        tips[2].innerHTML = "验证码为空或错误";
        form_code.focus();
        return false;//不提交表单
    }
    $(".loading").css("display","inline");
    $(".btn-signin span").html("");
    $.ajax({
        url:"login.php",//后台查询验证的方法
        data:{"regName": account.value, "pwd": pwd.value},//携带的参数
        type: "post",
        success: function(msg){
            //根据后台返回前台的msg给提示信息加HTML
            let results = msg.split("?");
            if(results[0] === "true"){
                remind("登录成功");
                setCookie("username",account.value);
                setCookie("login", "true");
                if($("#dialog-modal"))
                    $("#dialog-modal").dialog("close");
                $(".loading").css("display","none");
                $(".btn-signin span").html("登  录");
                localStorage.setItem("addworkID","");
                localStorage.setItem("goodsNumber",0);
                getMyCartInfor();

                //获取个人基础信息
                $.ajax({
                    url:"userInfor.php",
                    data:{"regName": getCookie("username")},//携带的参数
                    type: "GET",
                    success(msg){
                        let infor = msg.split("|");
                        if(infor[0] === "true"){
                            localStorage.setItem("userInfor",msg);
                        }else{
                            localStorage.setItem("userInfor","");
                        }
                    }
                });
            }else{
                $(".loading").css("display","none");
                $(".btn-signin span").html("登  录");
                tips[0].innerHTML = results[1];
                tips[1].innerHTML = results[2];
            }
        }
    });

    return false;
});

$("#dialog button").click(function(){
    $("#dialog").dialog("close");
    $("form.sform")[0].reset();
    if($("#type").val() === "page"){
        window.location = "index.html";
    }
});

function signTip(e){
    e.placeholder = "";
    $(".sform .i-status").html("");//清除提示信息
    tip = e.getAttribute("default");
    switch (e.name) {
        case "regName":
            status[0].innerHTML = tip;break;
        case "pwd":
            status[1].innerHTML = tip;break;
        case "pwdRepeat":
            status[2].innerHTML = tip;break;
        case "mobilecode":
            status[3].innerHTML = tip;
    }
}