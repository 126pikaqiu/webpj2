if(getUrlParam("status")){
    if(getUrlParam("status") === "error"){
        remind('作品发布失败，请尝试重新发布');
    }else{
        remind('作品发布成功。')
    }
}
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
    if(!$("#chooseImage").val()){
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
    }else if(!$("#height").val() || parseInt($("#height").val()) <= 0){
        showerror("请输入正确的高度");
        return false;
    }else if(!$("#width").val() || parseInt($("#width").val()) <= 0){
        showerror("请输入正确的宽度");
        return false;
    }else if(!$("#price").val()){
        showerror("请输入正确的价格");
        return false;
    }else if(!$("#description").val()){
        showerror("请输入商品简介");
        return false;
    }
});

function showerror(s){
    $($("p")[7]).html(s);
    setTimeout(function(){
        $($("p")[7]).html("")
    },2000);
}
