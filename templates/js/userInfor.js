
setCookie("revise-legal","false");
//及时检测参数
setInterval(function(){
  if(getCookie("login") === 'false'){
      window.location.href = "index.html";
      $("#account").html("");
  }
  if(!$("#account").html() || getCookie("changeMyInfor")){
      $("#account").html(getCookie("username"));
      let infor = localStorage.getItem("userInfor").split("|");
      $("#phone").html(infor[1]);
      $("#email").html(infor[2]);
      $("#address").html(infor[3]);
      $("#money").html(infor[4]);
      setCookie("changeMyInfor",false);
  }
  if(getCookie("getOrders") + "" === "true"){
      setCookie("getOrders",false);
      showOrders();
  }
},100);

//初始化表单
document.ready = function(){
    //设置足迹
    let foot = JSON.parse(getCookie("foot"));
    let temp = {};
    for(let i in foot){
        if(foot[i] === "个人信息"){
            break;
        }
        temp[i] = foot[i];
        let html = "<li><a class='hv-under' href='"+ footArry[foot[i]]  + "'> "+ foot[i] + "</a></li>>";
        $("ol.crumbs").html($("ol.crumbs").html() + html)
    }
    let html = "<li>个人信息</li>";
    $("ol.crumbs").html($("ol.crumbs").html() + html);
    temp[Object.getOwnPropertyNames(temp).length] = "个人信息";
    footArry["个人信息"] = window.location.search;
    setCookie("foot",JSON.stringify(temp));

    showUploadWorks();
    showOrders();
    showSales();
};
//充值按钮
$("#recharge").click(function(){
  $("#dialog1").dialog({
    height: 300,
    width: 300,
  })
});

//充值确认按钮
$("#dialog1 button").click(function(){
    $("#dialog1").dialog("close");
    //充值金额判断
    if($("#dialog1 input").val() && parseInt($("#dialog1 input").val()) > 0){
        remind("充值成功");
        //ajax请求,更新数据库
        $.ajax({
            url:"userInfor.php",//后台查询验证的方法
            data:{"balance": parseInt($("#dialog1 input").val()) + parseInt($("#money").html())},//携带的参数
            type: "POST",
            success(msg){
                if(parseInt(msg)){
                    let balance = parseInt($("#dialog1 input").val()) + parseInt($("#money").html());
                    let userInfor = "true|" + $("#phone").html() + "|" + $("#email").html() +
                        "|" + $("#address").html() + "|" + balance;
                    localStorage.setItem("userInfor",userInfor);
                    setCookie("changeMyInfor",true);
                }
            }
        });
      }else{
          remind("充值失败");
      }
});

//修改个人信息，不含密码
$("#changeInfor").click(function () {
    modal_dialog("修改个人信息",500);
});

//修改信息的表单的判断
let code = "123456";//模拟邮箱验证码
let right = [false,false,false,false,false,false];
let inputName = ["用户名","电话号码","邮箱","地址","验证码"];

//用户名注册判断
$(".rform-account").blur(function(){

    //清除提示信息
    $($(".rform .i-status")[0]).css("display","none");

    //格式判断
    let tip = $($(".rform .tip")[0]);

    if(this.value){
        showResult(0, true);

        if(this.value.length < 6) {
            check(0,false);
            tip.html("用户名长度不能小于6位数");
            return;
        }else if( /^([0-9]+)$/.test(this.value) ||  /^([a-zA-Z]+)$/.test(this.value)){
            check(0,false);
            tip.html("不能为纯数字或纯字母");
            return;
        }

        //ajax请求
        $.ajax({
            url:"register.php",//后台查询验证的方法
            data:{"regName": this.value},//携带的参数
            type: "GET",
            success: function(msg){
                //根据后台返回前台的msg给提示信息加HTML
                let results = msg.split("?");
                if(!eval(results[0])){
                    check(0,false);
                    tip.html("用户已经存在");
                    right[0] = false;
                }else{
                    check(0,true);
                }
            }
        });
        right[0] = true;
    }else{
        showResult(0,false);

        //还原默认值
        this.placeholder='请输入用户名';
    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[0] = false;
    //清除默认值
    this.placeholder="";
    //格式判断输出清除
    $(".rform .tip")[0].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[0]).css("display","inline");
});

//输入验证码判断
$(".rform-code").blur(function(){

    //清除提示信息
    $($(".rform .i-status")[4]).css("display","none");

    let tip = $($(".rform .tip")[4]);

    if(this.value){

        if(this.value !== code){
            tip.html("验证码错误");
            return;
        }
        right[4] = true;
    }
    else{
        //还原默认值
        this.placeholder='验证码';
    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[4] = false;
    //还原默认值
    this.placeholder="";
    //
    //格式判断输出清除
    $(".rform .tip")[4].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[4]).css("display","inline");
});

//输入地址
$(".rform-address").blur(function(){

    //清除提示信息
    $($(".rform .i-status")[3]).css("display","none");

    let tip = $($(".rform .tip")[3]);

    if(this.value){
        //没设计正确的地址格式判断
        right[3] = true;
    }
    else{
        //还原默认值
        this.placeholder='请输入地址';
    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[3] = false;
    //还原默认值
    this.placeholder="";
    //
    //格式判断输出清除
    $(".rform .tip")[3].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[3]).css("display","inline");
});


//输入手机号码判断
$(".rform-mobile").blur(function(){
    //格式判断输出清除
    $($(".rform .i-status")[1]).css("display","none");


    let tip = $($(".rform .tip")[1]);

    if(this.value){
        showResult(1,true);

        if(this.value[0] !== "1" || this.value.length !== 11 || !/\d+/.test(this.value)) {
            tip.html("手机号码默认为11位纯数字,请输入正确格式");
            check(3,false);
            return;
        }
        check(1,true);
        right[1] = true;
    }
    else{
        showResult(1,false);

        //还原默认值
        this.placeholder='请输入手机号码';
    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[1] = false;

    //还原默认值
    this.placeholder="";

    //格式判断输出清除
    $(".rform .tip")[1].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[1]).css("display","inline");
});

//输入邮箱判断
$(".rform-email").blur(function(){
    //格式判断输出清除
    $($(".rform .i-status")[2]).css("display","none");


    let tip = $($(".rform .tip")[2]);

    if(this.value){
        showResult(2,true);

        let myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
        if( !myReg.test(this.value)) {
            tip.html("邮箱格式错误");
            check(4,false);
            return;
        }
        check(2,true);
        right[2] = true;
    }
    else{
        showResult(2,false);

        //还原默认值
        this.placeholder='请输入邮箱';
    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[2] = false;

    //还原默认值
    this.placeholder="";

    //格式判断输出清除
    $(".rform .tip")[2].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[2]).css("display","inline");
});

//获取验证码判断
$(".rcode").click(function(){
    if(!right[2]){
        $(".rform-email").focus();
        $(".rform .tip")[2].innerHTML="请输入邮箱";
        $($(".rform .i-status")[2]).css("display","none");
        check(2,false);
        return;
    }
    $(".rform .i-status")[4].innerHTML = "验证码已发送，60s内有效";

    $(".rform .tip")[4].innerHTML = "";
    let code = this;
    let time = 60;
    let h = setInterval(function(){
        code.innerHTML = --time + "s后重新获取";
    },1000);
    setTimeout(function(){
        clearInterval(h);
        code.innerHTML = "获取验证码";
    },60000);
});

$(".btn-register").click(function(){
    for(let i = 0; i < 5; i++){
        if(!right[i]){
            $(".form-item input")[i].focus();
            $($(".rform .input-tip i")[i]).css("display","none");
            if(!$(".rform input")[i].value){
                $(".rform .tip")[i].innerHTML = inputName[i] + "为空";
            }
            else{
                $(".rform .tip")[i].innerHTML = inputName[i] + "有误";
            }
            return false;
        }
    }
    $(".loading").css("display","inline");
    $(".btn-register span").html("");
    try{
        //ajax请求
        $.ajax({
            url:"userInfor.php",//后台查询验证的方法
            data:{"regName": $(".rform input")[0].value,"tel": $(".rform input")[1].value,
                "email": $(".rform input")[2].value,"address":$(".rform input")[3].value},//携带的参数
            type: "POST",
            success(msg){
                if(parseInt(msg)){
                    let balance = localStorage.getItem("userInfor").split("|")[4];
                    let userInfor = "true|" + $(".rform input")[1].value + "|" + $(".rform input")[2].value +
                        "|" + $(".rform input")[3].value + "|" + balance;
                    localStorage.setItem("userInfor",userInfor);
                    setCookie("username", $(".rform input")[0].value);
                    setCookie("login","true");
                    setCookie("changeMyInfor",true);
                    $(".loading").css("display","none");
                    $(".btn-signin span").html("修改信息");
                    $("#dialog-modal").dialog("close");
                    remind("修改成功");
                }
            }
        });
    }catch (e) {
        console.log(e.message);
        remind("修改信息失败");
        return;
    }
    return false;
});

//检测图标的变化
function check(index , right){
    if(right){
        $($(".check")[index]).css("backgroundColor","#4ccd61");
        $($(".check")[index]).attr("src","templates/img/web_img/check.png");
    }else{
        $($(".check")[index]).css("backgroundColor","red");
        $($(".check")[index]).attr("src","templates/img/web_img/error.png");
    }
}

//隐藏和显示图标检测
function showResult(index,right){
    if(right){
        $($(".check")[index]).css("display","inline");
    }else{
        $($(".check")[index]).css("display","none");
    }
}

//关闭对话框
$("#dialog button").click(function(){
    $("#dialog").dialog("close");
    $("form.rform")[0].reset();
    if($("#type").val() === "page"){
        window.location = "index.html";
    }
});
function setEvent(){
    $(".remove-work").click(function(){
        setCookie("index",$(".remove-work").index($(this)));
        $.when(checkUploadWork($($(".uplo-title")[getCookie("index")]).attr("href").split("id=")[1])).done(function (msg) {
            if(parseInt(msg) !== 1){
                remind("操作无效，作品已经被购买");
                setCookie("del-legal",false);
            }else {
                setCookie("del-legal",true);
            }
        });
        if(getCookie("del-legal") + "" === "true"){
            remind("您将删除自己上传的作品！");
        }
    });

    $(".revise-work").click(function(){
        setCookie("index",$(".revise-work").index($(this)));
        let id = $($(".uplo-title")[getCookie("index")]).attr("href").split("id=")[1];
        $.when(checkUploadWork(id)).done(function (msg) {
            if(parseInt(msg) !== 1){
                remind("操作无效，作品已经被购买");
                setCookie("revise-legal",false);
            }else {
                window.location.href = "revise.php?id=" + id;
            }
        });
    });

    $("#dialog button").click(function(){
        if(getCookie("del-legal") + ""  === "true"){
            deleteUploadWork($($(".uplo-title")[getCookie("index")]).attr("href").split("id=")[1]);
            $($("#upload tr")[parseInt(getCookie("index")) + 1]).remove();
            if($("#upload tr").length === 1){
                $("#upload table").css("display","none");
                $("#upload-none").css("display","inline");
            }
        }else{
            $("#dialog").dialog("close");
        }
    });
}

//构建订单html
function showOrders(){
    $("#order tbody tr").remove();
    $.when(getOrders(1)).done(function (msg) {
        for(let i = 0; i < msg.length && i < 5; i++){//只显示最多五次订单
            if(localStorage.getItem("work" + msg[i]["artworkID"])){
                $("#order #order-none").css("display","none");
                let html = "<tr><td>" + msg[i]["orderID"] + "</td>" +
                    "<td><a class='hv-under' href='store.html?id=" + msg[i]["artworkID"] + "'>" + JSON.parse(localStorage.getItem("work" + msg[i]["artworkID"]))["title"] + "</a></td>" +
                    "<td>"+ msg[i]["timeCreated"] + "</td>" +
                    "<td>" + "$" + JSON.parse(localStorage.getItem("work" + msg[i]["artworkID"]))["price"] + "</td></tr>";
                $("#order tbody").html($("#order tbody").html() + html);
                $("#order table").css("display","block");
            }
        }
    })
}

//构建售货单html
function showSales(){
    $("#sale tbody").html("");
    $.when(getOrders(0)).done(function (msg) {
        for(let i = 0; i < msg.length && i < 5; i++){//只显示最多五次售货单
            if(msg[i]){
                $("#sale #sale-none").css("display","none");
                let html = "<tr><td><a class='hv-under' href='order.html?orderID=" + msg[i]["orderID"] + "'>" + msg[i]["orderID"] + "</a></td>" +
                    "<td><a class='hv-under' href='store.html?id=" + msg[i]["artworkID"] + "'>" + JSON.parse(localStorage.getItem("work" + msg[i]["artworkID"]))["title"] + "</a></td>" +
                    "<td>"+ msg[i]["timeCreated"] + "</td>" +
                    "<td>"+ "$" + JSON.parse(localStorage.getItem("work" + msg[i]["artworkID"]))["price"] + "</td></tr>";
                $("#sale tbody").html($("#sale tbody").html() + html);
                $("#sale table").css("display","block");
            }
        }
    })
}

//构建上传作品的清单html
function showUploadWorks(){
    $("#upload tbody").html("");
    $.when(getUploadWorks()).done(function (msg) {
        for(let i = 0; i < msg.length && i < 5; i++){//只显示最多十次售货单，pj要求显示全部
            if(localStorage.getItem("work" + msg[i]['artworkID'])){
                $("#upload-none").css("display","none");
                let html = "<tr><td><a class='hv-under uplo-title' href='store.html?id=" + msg[i]["artworkID"] + "'>"+ msg[i]["title"] + "</a></td>" +
                    "<td>"+ msg[i]["timeReleased"] + "</td>" +
                    "<td><a class='hv-under revise-work' href='javascript:;'>修改作品信息</a><br><a class='remove-work hv-under' href='javascript:;'>删除作品</a>" + "</td></tr>";
                $("#upload tbody").html($("#upload tbody").html() + html);
                $("#upload table").css("display","block");
            }
        }
        setEvent();
    })
}

//从数据库获得订单
function getOrders(type){
    let defer = $.Deferred();
    //ajax请求
    $.ajax({
        url:"order.php",//后台查询验证的方法
        data:{"type":type},
        type: "GET",
        success(msg){
            defer.resolve(JSON.parse(msg))
        }
    });
    return defer.promise();
}

//获得上传的作品
function getUploadWorks(){
    let defer = $.Deferred();
    //ajax请求
    $.ajax({
        url:"workInfor.php",//后台查询验证的方法
        data:{"order":"getUpload"},
        type: "GET",
        success(msg){
            defer.resolve(JSON.parse(msg))
        }
    });
    return defer.promise();
}

//删除上传的作品
function deleteUploadWork(artworkID){
    //ajax请求
    $.ajax({
        url:"workInfor.php",//后台查询验证的方法
        data:{"order":"delWork","artworkID":artworkID},
        type: "POST",
        success(msg){
            console.log(msg);
        }
    });
}

function checkUploadWork(artworkID){
    let defer = $.Deferred();
    //ajax请求
    $.ajax({
        url:"workInfor.php",//后台查询验证的方法
        data:{"order":"checkWork","artworkID":artworkID},
        type: "GET",
        success(msg){
            defer.resolve(msg)
        }
    });
    return defer.promise();
}


