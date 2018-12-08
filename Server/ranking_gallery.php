<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require("paper_user.php");

$dsn = "mysql:host=$host;port=$port;dbname=$db";

$pdo = new PDO($dsn, $user, $pass);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$query=$pdo->prepare("SELECT * FROM gallery");

$query->execute();

while($res=$query->fetch(PDO::FETCH_ASSOC)){
	$rows[]=$res;
}

for($i=0;$i<count($rows);$i++){
    #$rows[$i]["Image"] = base64_encode($rows[$i]["Image"]);
    unset($rows[$i]["Image"]);
}

header('Content-type: application/json');
echo json_encode( $rows );
?>
