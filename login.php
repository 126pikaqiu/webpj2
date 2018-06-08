<?php
    session_start();
    if($_SERVER["REQUEST_METHOD"] == 'POST'){
        echo validate_form();
    }else{
        header("Location:signin.html");
    }

    //验证登陆信息
    function validate_form(){

        //连接到数据库
        try{
            $db = new PDO('mysql:host=localhost;dbname=users','root',"");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch (PDOException $e){
            print "Couldn't connect to the database;" . $e->getMessage();
            exit();
        }

        $userName = $_POST['regName'];
        $userPwd = $_POST['pwd'];
        $p = $db->query("SELECT name, password FROM users");

        while($row = $p->fetch()){
            if($row["name"] === $userName){
                if($row["password"] === $userPwd){
                    return "true?null";
                }else{
                    $error = "密码错误";
                    return "false??$error";
                }
            }

        }
        return "false?用户不存在?";

    }
?>

