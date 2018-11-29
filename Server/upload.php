<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$csvfile = array_map("str_getcsv",file("artwork_info.csv"));
$csvheader=array_shift($csvfile);

foreach($csvfile as $row){
    $csv[]=array_combine($csvheader,$row);
}

require("upload_user.php");

$dsn = "mysql:host=$host;port=$port;dbname=$db";

$pdo = new PDO($dsn, $user, $pass);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

foreach($csv as $row){
    if($row["Downloaded"]==1){
        $ranking=$row["Rank"];
        $img_path="images/".$row["Filename"];
        $illustid=$row["IllustID"];
        $format=explode(".",$row["Filename"])[1];
        $query=$pdo->prepare("INSERT INTO images(Image,Width,Height,AspectRatio,Checksum,Entropy,Format,Type,IllustID,Ranking) VALUES(:img,:width,:height,:ratio,MD5(Image),999,:format,'D',:illustid,:ranking)");
        $duplicate_query=$pdo->prepare("SELECT COUNT(*) FROM images WHERE Checksum=?");

        $img=fopen($img_path,"rb");
        $md5=md5_file($img_path);

        $duplicate_query->execute(array($md5));
        if($duplicate_query->fetch()[0]!=0){
                continue;
        }

        $size=getimagesize($img_path);
        $ratio=$size[0]/$size[1];

        # Upload image
        $query->bindParam(":img",$img,PDO::PARAM_LOB);

        # Size
        $query->bindParam(":width",$size[0]);
        $query->bindParam(":height",$size[1]);
        $query->bindParam(":ratio",$ratio);

        # File info
        $query->bindParam(":format",$format);

        # Artwork info
        $query->bindParam(":ranking",$ranking);
        $query->bindParam(":illustid",$illustid);

        $query->execute();
    }
}

echo "Insert successful";
?>

