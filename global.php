<?php
//    class globalClass extends mysqli{
//        function __construct($host, $username, $passwd, $dbname, $port = 80, $socket)
//        {
//            parent::__construct($host, $username, $passwd, $dbname, $port, $socket);
//        }
//    }

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

?>