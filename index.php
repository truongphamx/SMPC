<!DOCTYPE html>
<html>
<head>
<?php
session_start();
$_SESSION['number'] = 0;
include("modals/delete_modal.php");
include("modals/storagePrint_modal.php");
include("modals/storageDelete_modal.php");
include("modals/replaceAll_modal.php");
include("modals/clearCurrent_modal.php");
include("modals/info_modal.php");
?>

<!-- Jquery -->
<script src="https://code.jquery.com/jquery-3.1.0.js"></script>

<!-- Jquery UI -->
<script src="jquery-ui/jquery-ui.min.js"></script>

<!-- Notify.js -->
<script src="js/notify.min.js"></script>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<!-- Prompt Font -->
<link href="https://fonts.googleapis.com/css?family=Prompt" rel="stylesheet">

<!-- OVERWRITING MANY THINGS AND THUS KEEPING STYLE HERE INSTEAD OF A SEPARATE CSS FILE-->
<style>
body {
    background: url(img/turquoise-blur.jpg) no-repeat center center fixed /*background-color: #18BD9B*/ !important;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    font-family:'Prompt', Arial, sans-serif;
}

.navbar {
    margin-bottom: 0;
}
.navbar-right{
    margin-right:0;
}
.checkbox label, .radio label{
    color: #fff;
    background-color: transparent;
}
.jumbotron {
    background-color:transparent; !important;
}
.jumbotron h1{
    font-family:'Prompt';
    color:white;
    text-shadow: 0px 1px black;
}
#results li{
    color: white;
    text-shadow: 0px 1px black;
    font-family:'Prompt', Arial, sans-serif;
    font-size: 15px;
    font-weight: bold;
    list-style: none;
}

#results li a{
    font-weight:bold;
    font-size:15px;
    text-shadow: none;
}
#items{
    color: white;
    text-shadow: 0px 1px black;
    font-size: 13px;
    font-weight: normal;
}
.pull-right{
    margin-top: 15px;
}

#results li span{
    margin-left:6%;
    display: inline-block;
}
#results li span:first-of-type{
    width: 200px;

}

#results li span:nth-of-type(2){
    width: 85px;

}

#results li span:nth-of-type(3){
    width: 200px;

}

#results li span:nth-of-type(4){
    width: 175px;

}

#bulkOptionContainer{
    padding-left:0 !important;
}

#bulkOptionContainer, #bulkOptionsApply{
    margin-top:50px;
    padding:0;
}

form .col-xs-11, form .col-xs-1{
    padding:0;

}

form input{
    border-radius:0 !important;
}

input{
    color:black;
}

</style>
</head>
<body>
<audio id="wakemeup" src="audio/icantwakeup.mp3" preload=auto></audio>
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div id="buttons" class="container-fluid navbar-left">
        <button type="button" id="storageReplace"  class="btn btn-primary navbar-btn">Replace the Storage</button>
        <button type="button" id="storageAddAll" class="btn btn-success navbar-btn">Add current list to the Storage</button>
        <button type="button" id="storageClear" class="btn btn-danger navbar-btn">Clear the Storage</button>
        <button type="button" id="clearCurrent" class="btn btn-warning navbar-btn">Clear current list from the Storage</button>
    </div>
    <div class="form-group col-sm-1 navbar-left btn">
        <div id="test" class="checkbox input-group checkbox-inline">
            <input type='checkbox' id="auto" name='autoStorage'>
            <label for="auto">Auto Storage</label>
        </div>
    </div>
    <div id="infoBTN" class="container-fluid navbar-right">
        <button type="button" id="infoShow" class="btn btn-default navbar-btn" onClick="$('#infoModal').modal('show');">Help</button>
    </div>
    <div class="form-group col-sm-1 navbar-right navbar-btn">
        <select id="currency" class="form-control">
            <option value="1">USD</option>
            <option value="2">GBP</option>
            <option value="3">EUR</option>
            <option value="4">CHF</option>
            <option value="5">RUB</option>
            <!-- <option value="6">PLN</option> -->
            <option value="7">BRL</option>
            <option value="8">JPY</option>
            <option value="9">NOK</option>
            <option value="10">IDR</option>
            <option value="11">MYR</option>
            <option value="12">PHP</option>
            <option value="13">SGD</option>
            <option value="14">THB</option>
            <!-- <option value="15">VND</option> -->
            <option value="16">KRW</option>
            <option value="17">TRY</option>
            <!-- <option value="18">UAH</option> -->
            <option value="19">MXN</option>
            <option value="20">CAD</option>
            <!-- <option value="21">AUD</option> -->
            <option value="22">NZD</option>
            <option value="23">CNY</option>
            <option value="24">INR</option>
            <option value="25">CLP</option>
            <option value="26">PEN</option>
            <option value="27">COP</option>
            <option value="28">ZAR</option>
            <option value="29">HKD</option>
            <option value="30">TWD</option>
            <option value="31">SAR</option>
            <option value="32">AED</option>
        </select>
    </div>
</nav>
<div class="jumbotron text-center">
    <h1>Steam Market Price Checker</h1>
</div>
<div class="container">
    <form>
        <div class="col-xs-11">
            <input type= 'text' name='search' class="form-control search-query" placeholder="Search by item name, e.g. 'Dota'" id = 'search'>

        </div>
        <div class="col-xs-1">
            <input type='text' name='searchCount' id='searchCounter' value="5" class="form-control">
            <label id="spookyDiv" style="display: none; position: absolute; top: -25px; left: 3px;"for="searchCounter">No. of results</label>
        </div>
        <div id= 'results'></div>
    </form>
    <form onkeypress="return event.keyCode != 13;">
        <div class="col-xs-11">
            <input type= 'text' name='addUrl' class="form-control search-query" placeholder="Add by url, e.g. 'http://steamcommunity.com/market/listings/753/218620-%3AA%3A'" id = 'addByUrl'>
        </div>
        <div class="col-xs-1" id="addUrlApply">
        <button class="btn btn-block btn-info" type="button">Add</button>
      </div>
    </form>

<table id='items' class="table table-hovered">
  <div id="bulkOptionContainer" class="col-xs-4">
    <select class="form-control" name="bulk_options">
      <option value="">Select Options</option>
        <option value="activate">Activate</option>
        <option value="deactivate">Deactivate</option>
        <option value="deleteList">Delete from List</option>
      <option value="addStorage">Add to Storage</option>
      <option value="deleteStorage">Delete from Storage</option>
      <option value="deleteStorageAndList">Delete from Storage and List</option>
    </select>
  </div>
  <div class="col-xs-4" id="bulkOptionsApply">
    <input type="submit"  name="submit" class="btn btn-success" value="Apply">
  </div>
<thead>
<tr>
    <th><input type="checkbox" id="selectAllBoxes"></th>
    <th>Check the price</th>
    <th>Item Name</th>
    <th>App Id</th>
    <th>Lowest price</th>
    <th>Frequency</th>
    <th>Minimum Notification Price</th>
</tr>
</thead>
<tbody>

</tbody>
</table>

<!-- Functions -->
<script src="js/script.js"></script>

</div>
</body>
</html>

