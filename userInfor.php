<?php
    if($_SERVER["REQUEST_METHOD"] == 'GET'){
        echo showInfor();
    }
    
    //查询用户信息
    function showInfor(){
    
        //连接到数据库
        try{
            $db = new PDO('mysql:host=localhost;dbname=users','root',"");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch (PDOException $e){
            print "Couldn't connect to the database;" . $e->getMessage();
            exit();
        }
    
        if(!isset($_GET['regName'])){
            print "<h1>非法访问</h1>";
            exit();
        }
        $userName = $_GET['regName'];
        $p = $db->query("SELECT name, tel, email, address, balance FROM users");
    
        while($row = $p->fetch()){
            if($row["name"] === $userName){
                return "true|".$row["tel"]."|".$row["email"]."|".$row["address"]."|".$row["balance"];
            }
    
        }
        return "false?用户不存在?";
    
    }
?>

