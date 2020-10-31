<?php

$savedata=$_POST['datas'];

$time=date("Y-m-d H:i:s");
$data = [
    $savedata
];
$file = new SplFileObject('../data/setting.csv', 'w');
 
foreach ($data as $line) {
    $file->fputcsv($line);
}

?>