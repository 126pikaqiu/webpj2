if(getUrlParam("status")){
    if(getUrlParam("status") === "error"){
        remind('作品发布失败，请尝试重新发布');
    }else{
        remind('作品发布成功');
        let temp = {};
        temp["title"] = getCookie("up-title");
        temp["genre"] = getCookie("up-genre");
        temp["height"] = getCookie("up-height");
        temp["width"] = getCookie("up-width");
        temp["price"] = getCookie("up-price");
        temp["description"] = getCookie("up-description");
        temp["artist"] = getCookie("up-artist");
        temp["view"] = 0;
        temp["artworkID"] = getUrlParam("id").split(".")[0];
        temp["imageFileName"] = getUrlParam("id");
        localStorage.setItem("work" + temp["artworkID"],JSON.stringify(temp))
    }
}
//及时检测参数
setInterval(function(){
    if(getCookie("login") === 'false'){
        window.location.href = "index.html";
        $("#account").html("");
    }
},100);
document.ready = function () {
    $("ol.crumbs").html("");
    //设置足迹
    let foot = JSON.parse(getCookie("foot"));
    let temp = {};
    for(let i in foot){
        if(foot[i] === "上传艺术品"){
            break;
        }
        temp[i] = foot[i];
        let html = "<li><a class='hv-under' href='"+ footArry[foot[i]]  + "'> "+ foot[i] + "</a></li>>";
        $("ol.crumbs").html($("ol.crumbs").html() + html)
    }
    let html = "<li>上传艺术品</li>";
    $("ol.crumbs").html($("ol.crumbs").html() + html);
    temp[Object.getOwnPropertyNames(temp).length] = "上传艺术品";
    footArry["上传艺术品"] = window.location.search;
    setCookie("foot",JSON.stringify(temp));
};

$('#chooseImage').on('change',function(){
    let filePath = $(this).val(),         //获取到input的value，里面是文件的路径
        fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase(),
            src = window.URL.createObjectURL(this.files[0]); //转成可以在本地预览的格式
        // 检查是否是图片
        if( !fileFormat.match(/.png|.jpg|.jpeg/) ) {
        showerror('上传错误,文件格式必须为：png/jpg/jpeg');
        return;
    }

    $('#cropedBigImg').attr('src',src);
});

$("#cancel").click(function () {
    remind("您将放弃发布?");
    return false;
});
$("#submit").click(function(){
    if(!($("#chooseImage").val() || getUrlParam("id"))){
        showerror("请选择图片");
        return false;
    }else if(!$("#title").val()){
        showerror("请输入标题");
        return false;
    }else if(!$("#author").val()){
        showerror("请输入作品作者");
        return false;
    }else if(!$("#yearOfWork").val() || parseInt($("#yearOfWork").val()) <= 0){
        showerror("请输入正确的年份");
        return false;
    }else if(!$("#genre").val()){
        showerror("请输入流派");
        return false;
    }else if(!parseInt($("#height").val()) || parseInt($("#height").val()) <= 0){
        showerror("请输入正确的高度");
        return false;
    }else if(!parseInt($("#width").val()) || parseInt($("#width").val()) <= 0){
        showerror("请输入正确的宽度");
        return false;
    }else if(!$("#price").val()){
        showerror("请输入正确的价格");
        return false;
    }else if(!$("#description").val()){
        showerror("请输入商品简介");
        return false;
    }
    setCookie("up-title",$("#title").val());
    setCookie("up-genre",$("#genre").val());
    setCookie("up-height",$("#height").val());
    setCookie("up-width",$("#width").val());
    setCookie("up-price",$("#price").val());
    setCookie("up-description", $("#description").val());
    setCookie("up-artist",$("#author").val());
});

function showerror(s){
    $("#error").html(s);
    setTimeout(function(){
        $($("p")[7]).html("")
    },2000);
}
