<?php
#error_reporting(E_ALL);
#ini_set('display_errors', 1);

require("paper_user.php");
$dsn = "mysql:host=$host;port=$port;dbname=$db";
$pdo = new PDO($dsn, $user, $pass);

#$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

function isValidJSON($str) {
   json_decode($str);
   return json_last_error() == JSON_ERROR_NONE;
}

$json_params = file_get_contents("php://input");

if (strlen($json_params) > 0 && isValidJSON($json_params))
	$jpost= json_decode($json_params,true);
else
	die("Request error");

if( is_null($jpost["uuid"]) || is_null($jpost["illustID"]) || is_null($jpost["timestamp"])){
	die("Request error");
}else{
	$query=$pdo->prepare("INSERT INTO user_selection(MacAddr,SelectedIllust,TimeStamp) VALUES(:macaddr,:illustID,:timestamp)");
        $query->bindParam(":macaddr",$jpost["uuid"]);
        $query->bindParam(":illustID",$jpost["illustID"]);
        $query->bindParam(":timestamp",$jpost["timestamp"]);

        $query->execute();
	echo "successful";
}
?>
