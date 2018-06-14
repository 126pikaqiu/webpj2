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
            $this->db = new PDO('mysql:host=localhost;dbname=myproject','root',"");
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch (PDOException $e){
            print "Couldn't connect to the database;" . $e->getMessage();
            exit();
        }
    }


    //用sql语句处理
    public function searchSQL($key,$order,$page){
        if($order === "view"){
            $order = " ORDER BY view desc";
        }else if($order === "price"){
            $order = " ORDER BY price";
        }
        $q = $this->db->query("SELECT count(*) from artworks where (select count(1)
 as num from orders where artworks.artworkID = orders.artworkID) = 0". $key);
        $page = (int)$page;
        $rows = $q->fetch();
        $rowCount = $rows[0];
        $this->store("rowCount",$rowCount);
        $mark = ($page - 1) * 9;
        $pageSize = $rowCount - $mark >= 9 ? 9:$rowCount - $mark;
        $p = $this->db->query("SELECT  `artworkID`, `artist`, `imageFileName`, `title`, `description`,
`yearOfWork`, `genre`, `width`, `height`, `price`, `view` FROM artworks where (select count(1)
 as numb from orders where artworks.artworkID = orders.artworkID) = 0".$key.$order." limit ".$mark.",".$pageSize);
        $rows = $p->fetchAll();
        echo  json_encode($this->utf8ize($rows));
    }

    //保存数据
    function store($key, $items){
        $items = serialize($items);//将数据序列化
        $_SESSION[$key] = $items;
    }

    function utf8ize($d) {
        if (is_array($d)) {
            foreach ($d as $k => $v) {
                $d[$k] = $this->utf8ize($v);
            }
        } else if (is_string ($d)) {
            return utf8_encode($d);
        }
        return $d;
    }
}
?>