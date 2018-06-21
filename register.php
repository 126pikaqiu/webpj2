
<?php
    session_start();
    include_once "global.php";
    if($_SERVER["REQUEST_METHOD"] === 'GET'){
        echo validate_form($db);
    }else if($_SERVER["REQUEST_METHOD"] === 'POST'){
        saveInfor($db);
    }

    //验证注册信息
    function validate_form($db){
        if(isset($_GET['regName'])){
            $userName = $_GET['regName'];
            $p = $db->query("SELECT name FROM users");
            while($row = $p->fetch()){
                if($row["name"] === $userName){
                    return "false?用户已经存在";
                }
            }
            return "true?null";
        }
    }

    //存入数据库
    function saveInfor($db){
        //防止sql注入攻击，预处理
        $stmt = $db->prepare("INSERT INTO `users` ( `name`, `email`, `password`, `tel`, `address`, `balance`) VALUES(?,?,?,?,?,?)");
        $stmt->execute(array($_POST["regName"],$_POST["email"],$_POST["pwd"],$_POST["tel"],$_POST["address"],0));

        //获得用户的id
        $p = $db->query("SELECT name, userID FROM users");
        while($row = $p->fetch()){
            if($row["name"] === $_POST["regName"]){
                $id = $row["userID"];
                break;
            }
        }
        $_SESSION["myID"] = $id;
    }
?>


