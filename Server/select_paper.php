<?php
#error_reporting(E_ALL);
#ini_set('display_errors', 1);

require("paper_user.php");

$dsn = "mysql:host=$host;port=$port;dbname=$db";

$pdo = new PDO($dsn, $user, $pass);

#$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$query=$pdo->prepare("SELECT Image,Checksum,Format FROM todays_best WHERE ABS(AspectRatio-?)<.5 ORDER BY Ranking ASC LIMIT 1");

$ratio=$_POST["ar"];

if(is_null($ratio)){
    die("No post parameter detected");
}

$query->execute(array($ratio));

$res=$query->fetch(PDO::FETCH_ASSOC);

#echo $res["Checksum"];

$format=$res["Format"];
header("Content-type: image/".$format);

echo $res["Image"];
?>

