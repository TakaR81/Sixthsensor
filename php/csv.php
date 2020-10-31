<?php

$savedata=$_POST['datas'];


$data = [
    $savedata
];
$file = new SplFileObject('../data/setting.csv', 'w');
 
foreach ($data as $line) {
    $file->fputcsv($line);
}

?>