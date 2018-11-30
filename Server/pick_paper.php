<?php
$uuid=$_GET["uuid"];
$validity=$_GET["valid"];

if(is_null($uuid) || is_null($validity)){
	die("Not enough parameter passed");
}

$calc_valid=substr(md5($uuid),0,10);
if($calc_valid!=$validity){
	die("UUID not valid");
}

?>
