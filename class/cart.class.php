<?php
//创建购物车类
class cart{

    //以数组形式返回购物车的内容
    function listArray(){
        $temp = $this->restore();
        return $temp;
    }

    //恢复数据
    function restore(){
        //从session中读取购物车数据
        if(!isset($_SESSION["cart_items"])){
            //连接到数据库
            try{
                $db = new PDO('mysql:host=localhost;dbname=myproject','root',"");
                $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }catch (PDOException $e){
                print "Couldn't connect to the database;" . $e->getMessage();
                exit();
            }
            $row = $db->query("SELECT artworkID FROM carts WHERE userID=" . $_SESSION["myID"]);
            $rows = $row->fetchAll();
            $temp = [];
            if(count($rows) > 0)
                foreach ($rows as $value){
                    $temp[$value["artworkID"]] = 1;
                }
            $_SESSION["cart_items"] = serialize($temp);
        }
        $cart_items = $_SESSION["cart_items"];//获取购物车记录
        $items = unserialize(stripslashes($cart_items));//将数据反序列化
        return $items;
    }

    //保存数据
    function store($items){
        //连接到数据库
        try{
            $db = new PDO('mysql:host=localhost;dbname=myproject','root',"");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch (PDOException $e){
            print "Couldn't connect to the database;" . $e->getMessage();
            exit();
        }
        $p = $db->exec("DELETE FROM carts WHERE userID=" . $_SESSION["myID"]);
        $temp = (array)$items;
        $stmt = $db->prepare("INSERT INTO carts (cartID,userID,artworkID)
                          VALUES(?,?,?)");
        foreach($temp as $value => $key){
            $stmt->execute(array($_SESSION["myID"],$_SESSION["myID"],$value));
        }
        $items = serialize($items);//将数据序列化
        $_SESSION["cart_items"] = $items;
    }

    //清空数据
    function clear(){
        unset($_SESSION["cart_items"]);
    }
}
?>