<?php

//连接数据库
    try{
        $db = new PDO('mysql:host=localhost;dbname=myproject','root',"");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->exec("SET NAMES UTF8");
    }catch (PDOException $e){
        print "Couldn't connect to the database;" . $e->getMessage();
        exit();
    }
    //获得数据
    function getValue($s){
        if (count($s)>0)
        {
            $c_start= strpos($s,"$s=");
            if ($c_start)
            {
                $c_start = $c_start + count($s);
                $c_end = strpos($s,"&", $c_start);
                if ($c_end === -1) $c_end = count($s);
                return substr($s, $c_start, $c_end);
            }
        }
        return "";
    }


    //恢复数据
    function restore($key){
        //从session中读取购物车数据
        $value = $_SESSION[$key];//获取数据
        $items = unserialize(stripslashes($value));//将数据反序列化
        return $items;
    }

    //保存数据
    function store($key, $items){
        $items = serialize($items);//将数据序列化
        $_SESSION[$key] = $items;
    }

    //产生订单号
    function makeID(){
        $m = date('m');
        $d = date('d');
        $id = $m. $d. rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9);
        return $id;
    }

    //正确编码
    function utf8ize($d) {
        if (is_array($d)) {
            foreach ($d as $k => $v) {
                $d[$k] = utf8ize($v);
            }
        } else if (is_string ($d)) {
            return utf8_encode($d);
        }
        return $d;
    }

?>