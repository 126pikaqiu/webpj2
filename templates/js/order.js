
//及时检测参数
setInterval(function(){
    if(getCookie("login") === 'false'){
        window.location.href = "index.html";
        $("#account").html("");
    }
},100);

document.ready = function () {

    //设置足迹
    let foot = JSON.parse(getCookie("foot"));
    let temp = {};
    for(let i in foot){
        if(foot[i] === "订单详情"){
            break;
        }
        temp[i] = foot[i];
        let html = "<li><a class='hv-under' href='"+ footArry[foot[i]]  + "'> "+ foot[i] + "</a></li>>";
        $("ol.crumbs").html($("ol.crumbs").html() + html)
    }

    let html = "<li>订单详情</li>";
    $("ol.crumbs").html($("ol.crumbs").html() + html);
    temp[Object.getOwnPropertyNames(temp).length] = "订单详情";
    footArry["订单详情"] = window.location.search;
    setCookie("foot",JSON.stringify(temp));

    if(!getUrlParam("orderID")){
        window.location.href = "index.html";
    }
    $.when(init()).done(function(msg){
        $("#orderID").html(getUrlParam("orderID"));
        $("#title").html(JSON.parse(localStorage.getItem("work" + msg["artworkID"]))["title"]);
        $("#timeCreated").html(msg["timeCreated"]);
        $("#price").html("$" + JSON.parse(localStorage.getItem("work" + msg["artworkID"]))["price"]);
        $.when(custormInfor(msg["userID"])).done(function(msg){
            $("#order-account").html(msg["name"]);
            $("#order-email").html(msg["email"]);
            $("#order-tel").html(msg["tel"]);
            $("#order-address").html(msg["address"]);
        });
    });
};


function init() {
    //查询商品详情信息
    let defer = $.Deferred();
    $.ajax({
        url:"order.php",
        data:{"orderID":getUrlParam("orderID")},//携带的参数
        type: "GET",
        success(msg){
            msg = JSON.parse(msg);
            if(!msg){
                window.location.href = "index.html";
            }
            defer.resolve(msg);
        },
    });
    return defer.promise();
}

function custormInfor(userID){
    //查询商品详情信息
    let defer = $.Deferred();
    $.ajax({
        url:"userInfor.php",
        data:{"userID":userID,"type":"byID"},//携带的参数
        type: "GET",
        success(msg){
            msg = JSON.parse(msg);
            if(!msg){
                window.location.href = "index.html";
            }
            defer.resolve(msg);
        },
    });
    return defer.promise();
}