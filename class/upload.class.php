<?php
//定义文件上传类
class upLoad{
    private $_thumb_width = 100;
    private $_thumb_height = 100;

    //文件上传方法
    function uploadFile($fileField,$userid,$oldPath = ""){
        $RESIZEWIDTH = $this->_thumb_width;
        $RESIZEHEIGHT = $this->_thumb_height;//缩略图的宽度与高度
        $upfile = "";
        $files = $_FILES[$fileField];
        $fileName = $files['name'];
        $fileType = $files["type"];

        //获取临时文件的文件名
        $fileTemp = $files['tmp_name'];
        if($fileName != "" and $fileTemp != "" and $fileType != ""){
            if($this->allowType($fileType)){
                //获取文件大小
                $upfile["filesize"] = filesize($fileTemp);
                //创建文件夹，将上传的文件保存到新创建的文件夹中
                if($oldPath == ""){
                    $filePath = $this->createDir($userid);
                }else{
                    $filePath = "./folder/"; //设置文件路径
                }

                //获取文件扩展名
                $fileExtendedName = $this->getExtendedName($fileName);
                //设置新的文件名称，以保证上传的文件不重名
                $newFileName = time() . "." . $fileExtendedName;
                //使用move_uploaded_file()函数，将上传的临时文件保存到服务器指定的路径返回状态
                $upfile["filename"] = $newFileName;
                $upfile["filetype"] = $fileType;
                $upfile["filestat"] = @move_uploaded_file($fileTemp, $filePath . $newFileName) ? "true" : "false";
                switch ($fileType){//判断文件类型
                    case "image/pjpeg":
                        $im = imagecreatefromjpeg($filePath.$newFileName);break;
                    case "image/x-png":
                        $im = imagecreatefrompng($filePath .$newFileName);break;
                    case "image/gif":
                        $im = imagecreatefromgif($filePath .$newFileName);break;
                }
                //创建jpg格式的缩略图
                $this->thumbnail($im,$RESIZEWIDTH,$RESIZEHEIGHT,$filePath ." ".$newFileName);
                ImageDestroy($im);//销毁图像，释放与其关联的内存
            }else{
                $upfile["filename"] = "非法的文件类型。";
                $upfile["filestat"] = "false";
            }
        }else{
            $upfile["filename"] = "无效的文件数据。";
            $upfile["filestat"] = "false";
        }
        return $upfile;
    }

    //获取文件后缀名
    function getExtendedName($fileName){
        return end(explode(".",$fileName));
    }

    //文件类型验证
    function allowType($type){
        //设置不允许上传的文件类型数组
        $types = array('application/x-js','application/octet-stream','application/x-php','text/html');
        if(in_array($type,$types)){
            return false;
        }else{
            return true;
        }
    }

    //创建文件夹方法
    function createDir($userid){
        $root = 'folder';//定义文件上传的根目录
        $pathSign = DIRECTORY_SEPARATOR;
        $u = $userid .$pathSign;
        $y = date("Y") .$pathSign;//获得日期
        $m = date("m") .$pathSign;
        $d = date('d');
        $realPath = $root . $pathSign .$u .$y .$m . $d;
        $path = $root . $pathSign .$u .$y .$m . $d . $pathSign ."thumbnail";
        $dirArray = explode($pathSign, $path);
        $tempDir = '';
        foreach ($dirArray as $dir){
            $tempDir .= $dir . $pathSign;
            $isFile = file_exists($tempDir);
            clearstatcache();
            if(! $isFile && ! is_dir($tempDir)){
                @mkdir($tempDir, 0777);//设置当前目录权限
            }
        }
        return $realPath . $pathSign;
    }

    //创建jpg格式的缩略图
    function thumbnail($im,$maxwidth,$maxheight,$name){
        $width = imagesx($im);//设置图片高宽度
        $height = imagesy($im);

        if(($maxwidth && $width > $maxwidth) || ($maxheight && $height > $maxheight)){
            if($maxwidth && $width > $maxwidth){
                $widthratio = $maxwidth / $width;
                $RESIZEWIDTH = true;
            }//判断图片的尺寸
            if($maxheight && $height > $maxheight){
                $heightratio = $maxheight / $height;
                $RESIZEHEIGHT = true;
            }//判断图片的尺寸

            //实际图片尺寸验证
            if($RESIZEHEIGHT && $RESIZEWIDTH){
                if($widthratio < $heightratio){
                    $ratio = $widthratio;
                }else{
                    $ratio = $heightratio;
                }
            }else if($RESIZEWIDTH){
                $ratio = $widthratio;
            }else if($RESIZEHEIGHT){
                $ratio = $heightratio;
            }

            //设置生成图片尺寸
            $newwidth = $width * $ratio;
            $newheight = $height * $ratio;
            if(function_exists("imagecopyresampled")){
                //创建一个真彩色图像
                $newim = imagecreatetruecolor($newwidth,$newheight);
                imagecopyresampled($newim, $im, 0, 0, 0, 0, $newwidth, $newheight, $width,$height);
            }else{
                $newim = imagecreate($newwidth, $newheight);
                imagecopyresized($newim, $im, 0, 0, 0, 0, $newwidth, $newheight, $width,$height);
            }
            ImageJpeg($newim, $name);//JPEG格式图像输出到浏览器
            ImageDestroy($newim);
        }else{
            ImageJpeg($im, $name . " .jpg");//JPEG格式图像输出到浏览器
        }
    }
}
?>