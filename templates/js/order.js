
//及时检测参数
setInterval(function(){
    if(getCookie("login") === 'false'){
        window.location.href = "index.html";
        $("#account").html("");
    }
},100);

document.ready = function () {
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