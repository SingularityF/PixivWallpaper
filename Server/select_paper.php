<?php
#error_reporting(E_ALL);
#ini_set('display_errors', 1);

require("paper_user.php");

$dsn = "mysql:host=$host;port=$port;dbname=$db";

$pdo = new PDO($dsn, $user, $pass);

#$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$query=$pdo->prepare("SELECT A.*, B.Score FROM images_l A, (SELECT *,(AvgGradient-POW(7*ABS(AspectRatio-?),2)-POW(10*Variance,2)) AS Score FROM todays_best ORDER BY Score DESC LIMIT 1) B WHERE A.IllustID=B.IllustID");
$query_demo=$pdo->prepare("SELECT A.*, B.Score FROM images A, (SELECT *,(AvgGradient-POW(7*ABS(AspectRatio-?),2)-POW(10*Variance,2)) AS Score FROM todays_best ORDER BY Score DESC LIMIT 1) B WHERE A.IllustID=B.IllustID");
$query_thumb=$pdo->prepare("SELECT Image FROM images_t WHERE IllustID=?");

$ratio=$_POST["ar"];
$mac=$_POST["uuid"];
$version=$_POST["version"];

$demo=$_GET["demo"];
$ratio_g=$_GET["ar"];
$img_info=$_GET["info"];

$thumb=$_GET["thumb"];
$illustID=$_GET["id"];

$ip_addr = isset($_SERVER['HTTP_CLIENT_IP'])?$_SERVER['HTTP_CLIENT_IP']:isset($_SERVER['HTTP_X_FORWARDED_FOR'])?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR'];

if(!is_null($thumb)){
# Thumbnail mode
	if(is_null($illustID)){
    		die("Not enough parameters");
	}
	$query_thumb->execute(array($illustID));
	$res=$query_thumb->fetch(PDO::FETCH_ASSOC);
	header("Content-type: image/jpg");
	echo $res["Image"];
}else if(!is_null($demo)){
# Demo mode (1200 resolution)
	if(is_null($ratio_g)){
    		die("Not enough parameters");
	}
	$query_demo->execute(array($ratio_g));
	$res=$query_demo->fetch(PDO::FETCH_ASSOC);
	if(is_null($img_info)){
		$format=$res["Format"];
		header("Content-type: image/".$format);
		echo $res["Image"];
	}else{
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Methods: PUT, GET, POST");
		header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
		$data_arr=array("IllustID" => $res["IllustID"]);
		echo json_encode($data_arr);
	}
}else{
	if(is_null($ratio)){
    		die("Not enough parameters");
	}
# Client query mode
	$query->execute(array($ratio));
        $query_log=$pdo->prepare("INSERT INTO log_set_wallpaper(MacAddr,IPAddr,ClientVersion) VALUES(:macaddr,:ipaddr,:version)");
	$query_log->bindParam(":macaddr",$mac);
	$query_log->bindParam(":ipaddr",$ip_addr);
	$query_log->bindParam(":version",$version);

        $query_log->execute();

	$res=$query->fetch(PDO::FETCH_ASSOC);
	$format=$res["Format"];

	header("Content-type: image/".$format);
	echo $res["Image"];
}
