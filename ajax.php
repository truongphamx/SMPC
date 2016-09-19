<?php

// NEEDED TO GET THE ITEM NAMES
function before ($this, $inthat)
{
    return substr($inthat, 0, strpos($inthat, $this));
};
// SESSION START FOR COUNTING PURPOSES
session_start();

// CHECKING WHICH AJAX WAS CALLED
// IN CASE OF SEARCH
if(isset($_GET['resultsItem'])){

// INITIATING VARIABLES
$dom = new DOMDocument();
$item = $_GET['resultsItem'];
$count = $_GET['resultsCount'];

// GETTING THE PAGE
$json = json_decode(file_get_contents("http://steamcommunity.com/market/search/render/?query=".rawurlencode($item)."&start=0&count=".$count), true);

// CHECKING FOR SUCCESS
if($json["success"] == true OR !empty($json))
  {
    $temp = $json["results_html"];
    $totalcount = $json["pagesize"];

  }
  // NEVER SAW IT HAPPEN UNLESS TIMED OUT BUT JUST TO BE SURE
  elseif($json["success"] == false OR empty($json))
  {
      echo "Could not get data for ".$item;
  }

  // MORE INITIATING
  $dom->validateOnParse = true;
  // UGLY PARSING ERROR CAUSED BY THE WAY IN WHICH WE'RE GETTING ITEMS NEGLECTED BY THAT @
  @$dom->loadHTML($temp);
  $dom->preserveWhiteSpace = false;
  $arrayss = array();
  $imgs = array();
  $links = array();
  $test = 0;
  $quant = array();
  $quantSele = array();
  // NEEDED FOR SEPARATION OF THE PRICES, QUANTITIES, ETC.
  for ($i = 0; $i < $count; $i++){
    if($i == 0){
      $quantSele[$i] = 6;
    }else{
      $quantSele[$i] = $quantSele[$i-1] + 9;
    }

  }

  $starting = array();
  $sale = array();
  // PUTTING ALL THE ITEMS, THEIR IMGS, LINKS, NAMES, QUANTITIES, PRICES IN ARRAYS
  for ($i = 0; $i < $count; $i++){
    $arrayss[$i] = $dom->getElementById("result_".$i);
    $imgs[$i] = $dom->getElementById("result_".$i."_image");
    $links[$i] = $dom->getElementById("resultlink_".$i);
    $names[$i] = $dom->getElementById("result_".$i."_name");
    $quant[$i] = $dom->getElementsByTagName('span')[$quantSele[$i]];
    $starting[$i] = $dom->getElementsByTagName('span')[$quantSele[$i]+2];
    $sale[$i] = $dom->getElementsByTagName('span')[$quantSele[$i]+3];
  }

  $appids = array();
  $itemnames = array();

  // PRINTING THE DATA
  echo "<br><br>";
  echo "<hr>";
  echo "<ul class=col-md-12>";
  //  NEEDED?
  if($totalcount > 0){
    // MAX IS STILL 100
    if($totalcount < $count){
      $count = $totalcount;
    }
    // CASUAL PROCESSING OF THE DATA RECEIVED FROM STEAM
    for ($i = 0; $i < $count; $i++){
      echo "<li>";
      $templink = $dom->getElementById("resultlink_".$i)->getAttribute('href');
      $itemnames[$i] = substr($templink, 46);
      if(strpos($itemnames[$i], "?filter")){
        $itemnames[$i] = before('?filter', $itemnames[$i]);
      }
      echo "<img id=".$i." src=".$dom->getElementById("result_".$i."_image")->getAttribute('src').">";
      $appids[$i] = substr($templink,42,3);
      echo "<span><a href=".$templink.">".$dom->getElementById("result_".$i."_name")->nodeValue."</a></span>";
      echo "<span>Qty: ".$quant[$i]->nodeValue."</span>";
      echo "<span>Starting price: ".$starting[$i]->nodeValue."</span>";
      echo "<span>Sale price: ".$sale[$i]->nodeValue."</span>";
      echo "<button name=".$itemnames[$i]." class='btn pull-right ".$appids[$i]." btn-default' type=button onclick=printItem(this.name,this.classList[2])>+</button>";


      echo "</li>";
      echo "<hr>";
    }
  }else{
    echo "<li>".$temp."</li>";
    echo "<hr>";
  }
  echo "</ul>";
  // IN CASE OF PRINTING AJAX
}elseif(isset($_GET['PrintName']) && isset($_GET['PrintAppid'])){
  // INITIATING VARIABLES
  $_name = $_GET['PrintName'];
  $_appid = $_GET['PrintAppid'];
  $_counter = $_SESSION['number'];
  $_link =  "http://steamcommunity.com/market/listings/".$_appid."/".rawurlencode($_name);
  // <TR> WORTH OF DATA
  $_info = array("<input type='checkbox' class='checkBoxes' name='checkBoxArray[]' value=".$_SESSION['number'].$_appid.">","<input type=checkbox name=active class=activator>", "<a href=".$_link.">".$_name."</a>", $_appid, "PH", "<input type=text name=interval>", "<input type=text name=minpricenotifi>","<button name={$_counter} class='btn btn-default' type=button>-</button>");

  $i = 0;
  // FOR CONVENIENCE
  foreach ($_info as $key => $value) {
      if($i == 1){
        // MIGHT GET DELETED DURING THE CODE CLEANUP OF INDEX
          echo "<td id=".$_counter.$_appid.">$value</td>";
      }else{
          echo "<td>$value</td>";
      }
      $i++;
  }
  $_SESSION['number']++;

  // IN CASE OF CHECK PRICE AJAX
}elseif(isset($_GET['CheckName']) && isset($_GET['CheckAppid']) && isset($_GET['CheckCurrency'])){
  // INITIATING VARIABLES
  $item = $_GET['CheckName'];
  $appid = $_GET['CheckAppid'];
  $currency = $_GET['CheckCurrency'];

  // GETTING THE PAGE AND NEGLECTING THE ERRORS IN CASE OF A TIME OUT TO PRINT THE MESSAGE MYSELF
  $json = json_decode(@file_get_contents("http://steamcommunity.com/market/priceoverview/?appid=".$appid."&currency=".$currency."&market_hash_name=".rawurlencode($item)), true);
        if($json["success"] == true OR !empty($json))
  {
      echo $json["lowest_price"];
  }else{
    echo "Timed out.";
  }
}


?>