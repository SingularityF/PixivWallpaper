<?php
function imgcompress($im){
	return imagescale($im,240);
}

function pixel($im,$x,$y){
	$rgb = imagecolorat($im, $x, $y);
	$colors = imagecolorsforindex($im, $rgb);
	return $colors;
}

function pixelnorm($im,$x,$y){
	$rgb = imagecolorat($im, $x, $y);
	$colors = imagecolorsforindex($im, $rgb);
	$r=$colors["red"]/255;
	$g=$colors["green"]/255;
	$b=$colors["blue"]/255;
	$norm=sqrt(pow($r,2)+pow($g,2)+pow($b,2));
	return $norm;
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
	# Penalize color patches
	if( abs($r)<=2 && abs($g)<=2 && abs($b)<=2)
		return -80;
	else
		return $norm;
} 
function load_img($img_path){
	if(explode(".",$img_path)[1]=="jpg"){
		$im = imagecreatefromjpeg($img_path);
		#$im=imgcompress($im);
	}else if(explode(".",$img_path)[1]=="png"){
		$im = imagecreatefrompng($img_path);
		#$im=imgcompress($im);
	}else if(explode(".",$img_path)[1]=="png"){
		$im=imagecreatefromgif($img_path);
		#$im=imgcompress($im);
	}else{
		die("Image format not supported");
	}
	return($im);
}

function calc_variance($img_path){
	$im=load_img($img_path);
	$lenx=imagesx($im);
        $leny=imagesy($im);
        $pixel_count=($lenx-1)*$leny;
	$luminosity=array();
	for($y=0;$y<$leny;$y++){
		for($x=0;$x<$lenx-1;$x++){
			array_push($luminosity,pixelnorm($im,$x,$y));
		}
	}
	$mean=array_sum($luminosity)/$pixel_count;
	$squares=array();
	for($i=0;$i<count($luminosity);$i++){
		array_push($squares,pow($luminosity[$i]-$mean,2));
	}
	$variance=array_sum($squares)/$pixel_count;
	return $variance;
}

function calc_gradient($img_path){
	$im=load_img($img_path);	
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
