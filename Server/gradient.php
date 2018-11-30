<?php
#function imgcompress($im){
#	return imagescale($im,240);
#}

function pixel($im,$x,$y){
	$rgb = imagecolorat($im, $x, $y);
	$colors = imagecolorsforindex($im, $rgb);
	return $colors;
}

# Penalize high contrast part so that black and white images won't have a large score
function trans($x){
	$c=80;
	return tanh($x/$c)*$c;
}
function normgrad($pixel1,$pixel2){
	$r=trans($pixel1["red"]-$pixel2["red"]);
	$g=trans($pixel1["green"]-$pixel2["green"]);
	$b=trans($pixel1["blue"]-$pixel2["blue"]);
	$norm=sqrt(pow($r,2)+pow($g,2)+pow($b,2));
	return $norm;
} 

function calc_gradient($img_path){
	if(explode(".",$img_path)[1]=="jpg"){
		$im = imagecreatefromjpeg($img_path);
		#$im=imgcompress($im);
	}else if(explode(".",$img_path)[1]=="png"){
		$im = imagecreatefrompng($img_path);
		#$im=imgcompress($im);
	}else{
		die("Image format not supported");
	}
	
	$lenx=imagesx($im);
	$leny=imagesy($im);
	$pixel_count=($lenx-1)*$leny;
	$avggrad=0;
	for($y=0;$y<$leny;$y++){
		for($x=0;$x<$lenx-1;$x++){
			$diff_2norm=normgrad(pixel($im,$x,$y),pixel($im,$x+1,$y));
			$avggrad=$avggrad+$diff_2norm/$pixel_count;
		}
	}
	return $avggrad;
}
?>
