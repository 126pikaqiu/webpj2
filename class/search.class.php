<?php
/*
  * 处理搜索结果，
  * 以及实现搜索
  */
class search{
    public $db = '';
    public $sql = '';

    //实列化的时候连接数据库
    function __construct(){
        //连接到数据库
        try{
            $this->db = new PDO('mysql:host=localhost;dbname=artworks','root',"");
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch (PDOException $e){
            print "Couldn't connect to the database;" . $e->getMessage();
            exit();
        }
    }

    //处理关键词
    function handle($key){
        
    }

    //用sql语句处理
    function searchSQL($key){
        $p = $this->db->query("SELECT  `artworkID`, `artist`, `imageFileName`, `title`, `description`,
 `yearOfWork`, `genre`, `width`, `height`, `price`, `view` FROM artworks " . "WHERE" . $this->sql);
        $row = $p->fetchAll();
        $this->store($row);
    }

    //恢复数据
    function restore(){
        //从session中读取购物车数据
        $cart_items = $_SESSION["searchResult"];//获取购物车记录
        $items = unserialize(stripslashes($cart_items));//将数据反序列化
        return $items;
    }

    //保存数据
    function store($items){
        $items = serialize($items);//将数据序列化
        $_SESSION["cart_items"] = $items;
    }
}
?>