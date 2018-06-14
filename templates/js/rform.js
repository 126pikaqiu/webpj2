let code = "123456";//模拟手机验证码
let right = [false,false,false,false,false,false];
let inputName = ["用户名","设置密码","确认密码","电话号码","邮箱","地址","验证码"];

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
    $($(".rform .i-status")[6]).css("display","none");

    let tip = $($(".rform .tip")[6]);

    if(this.value){

        if(this.value !== code){
            tip.html("验证码错误");
            return;
        }
        right[6] = true;
    }
    else{
        //还原默认值
        this.placeholder='验证码';
    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[6] = false;
    //还原默认值
    this.placeholder="";
    //
    //格式判断输出清除
    $(".rform .tip")[6].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[6]).css("display","inline");
});
//输入验证码判断
$(".rform-address").blur(function(){

    //清除提示信息
    $($(".rform .i-status")[5]).css("display","none");

    let tip = $($(".rform .tip")[5]);

    if(this.value){
    //没设计正确的地址格式判断
        right[5] = true;
    }
    else{
        //还原默认值
        this.placeholder='请输入地址';
    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[5] = false;
    //还原默认值
    this.placeholder="";
    //
    //格式判断输出清除
    $(".rform .tip")[5].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[5]).css("display","inline");
});

//确认密码判断
$(".rform-equalTopwd").blur(function(){

    //清除提示信息
    $($(".rform .i-status")[2]).css("display","none");

    let tip = $($(".rform .tip")[2]);
    if(this.value){
        showResult(2,true);
        this.placeholder='确认密码';

        if(this.value !== $(".rform-pwd").val()) {
            check(2,false);
            tip.html("前后两次密码不一致");
            return;
        }
        check(2,true);
        right[2] = true;
    }
    else{
        showResult(2,false);

        //还原默认值
        this.placeholder='确认密码';

    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[2] = false;
    //还原默认值
    this.placeholder="";
    //
    //格式判断输出清除
    $(".rform .tip")[2].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[2]).css("display","inline");
});
//设置密码判断
$(".rform-pwd").blur(function(){

    //清除提示信息
    $($(".rform .i-status")[1]).css("display","none");

    let tip = $($(".rform .tip")[1]);

    if(this.value){
        showResult(1,true);

        if(this.value.length < 6) {
            check(1,false);
            tip.html("密码长度不能小于6位数");
            return;
        }else if(this.value === $(".rform-account").val()){
            check(1,false);
            tip.html("密码不能与用户名相同");
            return;
        }
        check(1,true);
        right[1] = true;
    }
    else{
        showResult(1,false);

        //还原默认值
        this.placeholder='请设置密码';
    }

    tip.html("");//格式判断输出清除
}).focus(function(){
    right[1] = false;
    //还原默认值
    this.placeholder="";

    // //格式判断输出清除
    $(".rform .tip")[1].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[1]).css("display","inline");
});

//确认密码判断
$(".rform-equalTopwd").blur(function(){

    //清除提示信息
    $($(".rform .i-status")[2]).css("display","none");

    let tip = $($(".rform .tip")[2]);
    if(this.value){
        showResult(2,true);
        this.placeholder='确认密码';

        if(this.value !== $(".rform-pwd").val()) {
            check(2,false);
            tip.html("前后两次密码不一致");
            return;
        }
        check(2,true);
        right[2] = true;
    }
    else{
        showResult(2,false);

        //还原默认值
        this.placeholder='确认密码';

    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[2] = false;
    //还原默认值
    this.placeholder="";
    //
    //格式判断输出清除
    $(".rform .tip")[2].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[2]).css("display","inline");
});

//输入手机号码判断
$(".rform-mobile").blur(function(){
    //格式判断输出清除
    $($(".rform .i-status")[3]).css("display","none");


    let tip = $($(".rform .tip")[3]);

    if(this.value){
        showResult(3,true);

        if(this.value[0] !== "1" || this.value.length !== 11 || !/\d+/.test(this.value)) {
            tip.html("手机号码默认为11位纯数字,请输入正确格式");
            check(3,false);
            return;
        }
        check(3,true);
        right[3] = true;
    }
    else{
        showResult(3,false);

        //还原默认值
        this.placeholder='请输入手机号码';
    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[3] = false;

    //还原默认值
    this.placeholder="";

    //格式判断输出清除
    $(".rform .tip")[3].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[3]).css("display","inline");
});

//输入邮箱判断
$(".rform-email").blur(function(){
    //格式判断输出清除
    $($(".rform .i-status")[4]).css("display","none");


    let tip = $($(".rform .tip")[4]);

    if(this.value){
        showResult(4,true);

        let myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
        if( !myReg.test(this.value)) {
            tip.html("邮箱格式错误");
            check(4,false);
            return;
        }
        check(4,true);
        right[4] = true;
    }
    else{
        showResult(4,false);

        //还原默认值
        this.placeholder='请输入邮箱';
    }
    tip.html("");//格式判断输出清除
}).focus(function(){
    right[4] = false;

    //还原默认值
    this.placeholder="";

    //格式判断输出清除
    $(".rform .tip")[4].innerHTML="";

    //还原提示信息
    $($(".rform .i-status")[4]).css("display","inline");
});

//获取验证码判断
$(".rcode").click(function(){
    if(!right[4]){
        $(".rform-email").focus();
        $(".rform .tip")[4].innerHTML="请输入邮箱";
        $($(".rform .i-status")[4]).css("display","none");
        check(4,false);
        return;
    }
    $(".rform .i-status")[6].innerHTML = "验证码已发送，60s内有效";
    $(".rform .tip")[6].innerHTML = "";
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
    for(let i = 0; i < 6; i++){
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
            url:"register.php",//后台查询验证的方法
            data:{"regName": $(".rform input")[0].value,"pwd": $(".rform input")[1].value,"tel": $(".rform input")[3].value,
                "email": $(".rform input")[4].value,"address":$(".rform input")[5].value},//携带的参数
            type: "POST",
            success(msg){
                console.log(msg);
                msg = [$(".rform input")[3].value,$(".rform input")[4].value,$(".rform input")[5].value,0];
                localStorage.setItem("userInfor","true|" + msg.join("|"));S
            }
        });
    }catch (e) {
        console.log(e.message);
        remind("注册失败");
        return;
    }
    setCookie("username", $(".rform input")[0].value);
    setCookie("login","true");
    remind("注册成功");

    $(".loading").css("display","none");
    $(".btn-register span").html("立即注册");
    localStorage.setItem("mycart","");
    // //初始化购物车信息
    // $.ajax({
    //     url:"handleCart.php",
    //     data:{"order": "create","regName": getCookie("username")},//携带的参数
    //     type: "GET",
    //     success(msg){
    //         console.log(msg);
    //     }
    // });

    $("#dialog-modal").dialog("close");
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