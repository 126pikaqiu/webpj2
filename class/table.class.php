<?php
class table{
    public $_jspath = "templates/js/"; //js路径
    public $_name = "";  //表格名
    public $_action = "";
    function __construct($name = "tableForm"){
        $this->_name = $name;
    }

    function normal($header,$data = NULL, $control = false, $toolbar = NULL, $width = "100%"){
        $html = $this->js($toolbar);
        $html .= '<form name="' . $this->_name . '" id="' . $this->_name . '" method = "post" action="' . $this->_action . '">';
        if($toolbar != NULL){
            foreach ($toolbar as $k => $v) {
                $html .= '<input type="button" name="' . $k .'" id="' .$k . '" value="' . $v["value"] . '">';
            }
        }
        $html .= '<table class="tableList" style="width:' . $width . '">';
        $html .= '<tr>';
        if($control == true){  //更具参数，决定是否显示表单控制
            $html .= '<th><input type="checkbox" name="toggle" id="toggle" value="" onclick="' . $this->_name . '_checkAll('  . (count($data)) . ');" /></th>th>';
        }
        foreach ($header as $v){
            $html .= "<th>" .$v . "</th>";//输出表头内容
        }

        $html .="</tr>";
        $rs = 0;
        $cb = 0;
        if($data != NULL){
            if(is_object($data)){
                $data = (array)$data;
            }
            foreach ($data as $k => $v){
                //兼容性处理
                if(is_object($v)){
                    $v = (array)$v;//转化类型为数组
                }

                //不是数组跳过循环
                if(gettype($v) != "array"){
                    continue;
                }

                //使用array_value将关联数组转化为数字为键名的数组
                $v = array_values($v);

                //兼容性处理结束
                if($rs == 2){
                    $rs = 0;
                }

                $html .= '<tr class="row">' .$rs . '" id="' .$k . '">';
                if($control == true){//允许显示表格控制时，输出表格控制内容
                   $html .= '<td><input type="checkbox" id="cb ' . $cb .'" name="cid[]" value="' . $v[0] .
                       '" onclick="' . $this->_name . 'is_Checked(this.checked);" /> </td>';
                }
                for($i = 0; $i < count($v); $i++){
                    $html .= "<td>" . $v[$i] . "</td>";
                }
                $html .= "</tr>";
                $rs++;
                $cb++;
            }
        }
        $html .= '</table>';
        $html .= '<input type="hidden" name="boxchecked" id="' .
            $this->_name . '_boxchecked" value="0"><input type="hidden" name="do" id"' . $this->_name .'_do" value=""></form>';
        return $html;
    }

    //js判断函数
    function js($toolbar = NULL){
        //加载jquery文件
        $js = '<script type="text/JavaScript" src="' . $this->_jspath .'jquery-3.3.1.min.js"></script>';
        $js .= '<script type="text/JavaScript">';
        if($toolbar != ''){
            $js .= '$(document).ready(function(){';
            foreach ($toolbar as $k => $v){//循环表格标签变量
                $js .= '$("#' . $k . '").click(function(){
                $("#' . $this->_name . '").attr("action","' .$v["action"] . '");
                $("#' . $this->_name .'_do").val("' . $k .'");
                if($("#' . $this->_name .'_boxchecked").val() == 0){
                    alert("请选择要处理的记录!");
                }else{
                    $("#' . $this->_name . '").submit();//发送请求
                }
                });';
            }
            $js .= "});";
        }

        //创建与工具栏有关的JavaScript代码
        $js .= '
        function ' . $this->_name . "_checkAll(n, fldName){
            if(!fldName){ fldName = 'cb';}
            var f = document." . $this->_name .";
            var c = f.toggle.checked;
            var n2 = 0;
            for(i = 0; i < n; i++){
                cb = eval('f.' + fldName + '' + i);///
                if(cb){
                    cb .checked = c;
                    n2++;
                }
            }
            if(c){
                c=document." . $this->_name .".boxchecked.value = n2;
            }else{
                document." . $this->_name . ".boxchecked.value = 0;
            }
        }
        function " . $this->_name . "_isChecked(isitchecked){
            if(isitchecked == true){
                document." . $this->_name . ".boxchecked.value++;
            }else{
                document." . $this->_name .".boxchecked.value--;
            }
            if(document." .$this->_name . ".boxchecked.value == 0){
                document." . $this->_name . ".toggle.checked = false;
            }
        }
        </script>";
        return $js;

        }
}
?>