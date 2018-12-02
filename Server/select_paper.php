<?php
#error_reporting(E_ALL);
#ini_set('display_errors', 1);

require("paper_user.php");

$dsn = "mysql:host=$host;port=$port;dbname=$db";

$pdo = new PDO($dsn, $user, $pass);

#$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$query=$pdo->prepare("SELECT A.*, B.Score FROM images_l A, (SELECT *,(AvgGradient-POW(7*ABS(AspectRatio-?),2)-20*Variance) AS Score FROM todays_best ORDER BY Score DESC LIMIT 1) B WHERE A.IllustID=B.IllustID");
$query_demo=$pdo->prepare("SELECT *,(AvgGradient-POW(7*ABS(AspectRatio-?),2)-20*Variance) AS Score FROM todays_best ORDER BY Score DESC LIMIT 1");

$ratio=$_POST["ar"];
$demo=$_POST["demo"];

if(is_null($ratio)){
    die("No post parameter detected");
}


if(is_null($demo)){
	$query->execute(array($ratio));
	$res=$query->fetch(PDO::FETCH_ASSOC);
}else{
	$query_demo->execute(array($ratio));
	$res=$query_demo->fetch(PDO::FETCH_ASSOC);
}

#echo $res["Checksum"];

$format=$res["Format"];

header("Content-type: image/".$format);
echo $res["Image"];
?>
