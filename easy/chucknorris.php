<?php

$MESSAGE = stream_get_line(STDIN, 100, "\n");

function dec2bin($str){
    $binStr = '';
    for ($i=0;$i<strlen($str);$i++){
        $value = unpack('H*', $str[$i]);
        $value = base_convert($value[1], 16, 2);
        $l=7-strlen($value);
        if ($l>0) { $value = str_repeat('0', $l) . $value; }
        error_log($str[$i].'=>'.var_export($value, true));
        $binStr .= $value;
    }
    return $binStr;
}

function preproc($str){
    $binStr = dec2bin($str);
    $prev='x';
    $preparsing='';
    $prevCpt=1;
    $len=strlen($binStr);
    for($i=0;$i<=$len;$i++){
        while($i<$len && $prev == $binStr[$i]){
            $prevCpt++;
            $i++;
            continue;
        }
        $preparsing.=$prevCpt.$prev;
        if($i==$len) continue;
        $prev=$binStr[$i];
        $prevCpt=1;
    }
    return substr($preparsing,2);
}

function chuckConvert($str) {
    $preparsing=preproc($str);
    $max=strlen($preparsing)-1;
    $parts = [];
    for($i=0;$i<$max;$i+=2) {
        $p = ($preparsing[$i+1]=='1'?'0':'00')
            .' '.str_repeat('0', intval($preparsing[$i]));
        $parts[] = $p;
        error_log('['.$preparsing[$i].' '.$preparsing[$i+1].'] '
            .var_export($p, true));
    }
    return implode($parts, ' ');
}

$res = chuckConvert($MESSAGE);
/*$li = strlen($res) - 1;
if ($res[$li]==' ') {
    $res[$li] = '0';
}
error_log('"'.var_export($res, true).'"');*/
echo $res;
