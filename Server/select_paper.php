<?php
#error_reporting(E_ALL);
#ini_set('display_errors', 1);

require("paper_user.php");

$dsn = "mysql:host=$host;port=$port;dbname=$db";

$pdo = new PDO($dsn, $user, $pass);

#$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$query=$pdo->prepare("SELECT A.*, B.Score FROM images_l A, (SELECT *,(AvgGradient-POW(7*ABS(AspectRatio-?),2)-POW(10*Variance,2)) AS Score FROM todays_best ORDER BY Score DESC LIMIT 1) B WHERE A.IllustID=B.IllustID");
$query_demo=$pdo->prepare("SELECT A.*, B.Score FROM images A, (SELECT *,(AvgGradient-POW(7*ABS(AspectRatio-?),2)-POW(10*Variance,2)) AS Score FROM todays_best ORDER BY Score DESC LIMIT 1) B WHERE A.IllustID=B.IllustID");

$ratio=$_POST["ar"];
$demo=$_POST["demo"];
# Also accept get parameters, currently only for demo mode
$demo_g=$_GET["demo"];
$ratio_g=$_GET["ar"];

$img_info=$_GET["info"];

if(is_null($ratio) && is_null($ratio_g)){
    die("No post parameter detected");
}


if(is_null($demo)){
	$query->execute(array($ratio));
	$res=$query->fetch(PDO::FETCH_ASSOC);
}else{
	$query_demo->execute(array($ratio));
	$res=$query_demo->fetch(PDO::FETCH_ASSOC);
}

if(!is_null($demo_g)){
	$query_demo->execute(array($ratio_g));
	$res=$query_demo->fetch(PDO::FETCH_ASSOC);
}
#echo $res["Checksum"];

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
?>
