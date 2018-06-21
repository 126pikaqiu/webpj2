<?php
    session_start();
    include_once "global.php";

    if($_SERVER["REQUEST_METHOD"] == 'POST'){
        echo validate_form($db);
    }else{
        header("Location:signin.html");
    }

    //验证登陆信息
    function validate_form($db){
        $userName = $_POST['regName'];
        $userPwd = $_POST['pwd'];
        $p = $db->query("SELECT userID, name, password FROM users");

        while($row = $p->fetch()){
            if($row["name"] === $userName){
                if($row["password"] === $userPwd){
                    $_SESSION["myID"] = $row["userID"];
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

