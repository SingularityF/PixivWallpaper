<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

function orig_scale($im){
       return imagescale($im,2560);
}


require("processing.php");

$csvfile = array_map("str_getcsv",file("artwork_info.csv"));
$csvheader=array_shift($csvfile);

foreach($csvfile as $row){
    $csv[]=array_combine($csvheader,$row);
}

require("upload_user.php");

$dsn = "mysql:host=$host;port=$port;dbname=$db";

$pdo = new PDO($dsn, $user, $pass);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

function upload_img($img_path,$ranking,$illustid,$format,$type){
	$pdo=$GLOBALS["pdo"];
	if($type=="D"){
		$query=$pdo->prepare("INSERT INTO images(Image,Width,Height,AspectRatio,Checksum,Format,Type,IllustID,Ranking) VALUES(:img,:width,:height,:ratio,MD5(Image),:format,:type,:illustid,:ranking)");
		$duplicate_query=$pdo->prepare("SELECT COUNT(*) FROM images WHERE Checksum=?");
	}else if($type=="T"){
		$query=$pdo->prepare("INSERT INTO images_t(Image,Width,Height,AspectRatio,Checksum,Format,Type,IllustID,Ranking,AvgGradient) VALUES(:img,:width,:height,:ratio,MD5(Image),:format,:type,:illustid,:ranking,:gradient)");
		$duplicate_query=$pdo->prepare("SELECT COUNT(*) FROM images_t WHERE Checksum=?");

	}else if($type=="L"){
		$query=$pdo->prepare("INSERT INTO images_l(Image,Width,Height,AspectRatio,Checksum,Format,Type,IllustID,Ranking) VALUES(:img,:width,:height,:ratio,MD5(Image),:format,:type,:illustid,:ranking)");
		$duplicate_query=$pdo->prepare("SELECT COUNT(*) FROM images_l WHERE IllustID=?");
	}
	
	$img=fopen($img_path,"rb");
	$md5=md5_file($img_path);
	
	$size=getimagesize($img_path);
	$ratio=$size[0]/$size[1];

	if($type=="L"){
		if($size[0]>2560){
			$im=load_img($img_path);
			$im=orig_scale($im);
			ob_start();
			if($format=="jpg"){
				imagejpeg($im);
			}else if($format=="png"){
				imagepng($im);
			}else if($format=="gif"){
				imagegif($im);
			}
			$img = ob_get_clean();
			$size[0]=imagesx($im);
			$size[1]=imagesy($im);
			$ratio=$size[0]/$size[1];
		}else{
			$type="O";
		}
	}

	if($type=="L"||$type=="O"){
		$duplicate_query->execute(array($illustid));
		if($duplicate_query->fetch()[0]!=0){
			return;
		}

	}else{
		$duplicate_query->execute(array($md5));
		if($duplicate_query->fetch()[0]!=0){
			return;
		}
	}
	
	# Upload image
	$query->bindParam(":img",$img,PDO::PARAM_LOB);
	
	# Size
	$query->bindParam(":width",$size[0]);
	$query->bindParam(":height",$size[1]);
	$query->bindParam(":ratio",$ratio);
	
	# File info
	$query->bindParam(":format",$format);
	$query->bindParam(":type",$type);
	
	if($type=="T"){
		$gradient=calc_gradient($img_path);
		$query->bindParam(":gradient",$gradient);
	}
	
	# Artwork info
	$query->bindParam(":ranking",$ranking);
	$query->bindParam(":illustid",$illustid);
	
	$query->execute();
}

foreach($csv as $row){
	if($row["Downloaded"]==1){
		$img_path="images/".$row["Filename"];
		$format=explode(".",$row["Filename"])[1];
		$ranking=$row["Rank"];
		$illustid=$row["IllustID"];
		upload_img($img_path,$ranking,$illustid,$format,"D");
		$img_path="images/".$row["Thumbnail"];
		$format=explode(".",$row["Thumbnail"])[1];
		upload_img($img_path,$ranking,$illustid,$format,"T");
		$img_path="images/".$row["Original"];
		$format=explode(".",$row["Original"])[1];
		upload_img($img_path,$ranking,$illustid,$format,"L");
	}
}

echo "Insert successful";
?>
