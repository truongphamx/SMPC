<!DOCTYPE html>
<html>
<head>
<?php
session_start();
$_SESSION['number'] = 0;
include("delete_modal.php");
include("storagePrint_modal.php");
include("storageDelete_modal.php");
include("replaceAll_modal.php");
include("clearCurrent_modal.php");
?>

<!-- Jquery -->
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>

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

<style>
 body { background: url(img/turquoise-blur.jpg) no-repeat center center fixed /*background-color: #18BD9B*/ !important;
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
.checkbox label, .radio label
    {
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
<nav class="navbar navbar-inverse navbar-static-top">
    <div id="buttons" class="container-fluid navbar-left">
        <button type="button" id="storageReplace"  class="btn btn-primary navbar-btn">Replace the Storage</button>
        <button type="button" id="storageAddAll" class="btn btn-success navbar-btn">Add current list to the Storage</button>
        <button type="button" id="storageClear" class="btn btn-danger navbar-btn">Clear the Storage</button>
        <button type="button" id="clearCurrent" class="btn btn-warning navbar-btn">Clear current list from the storage</button>
    </div>
    <div class="form-group col-sm-1 navbar-left btn">
        <div id="test" class="checkbox input-group checkbox-inline">
            <input type='checkbox' id="auto" name='autoStorage'>
            <label for="auto">Auto Storage</label>
        </div>
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
<script>

function naturalCompare(a, b) {
    var ax = [], bx = [];

    a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
    b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

    while(ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if(nn) return nn;
    }

    return ax.length - bx.length;
}

var printItems = new Array();
var itemCounter = 0;
var ok = 0;
function checkStorage(){
    var storage = Object.keys(localStorage);
    storage.sort(naturalCompare);
    for (var i = 0; i<storage.length; i++){
        if(storage[i].includes('item')){
            printItems[i] = localStorage.getItem(storage[i]);
            // remake them cos I don't see any other solution at 3:40am
            localStorage.removeItem(storage[i]);
            localStorage.setItem("item"+i, printItems[i]);
        }

    }
    if(printItems[0]){
        console.log("Stored items found!");
        ok = 1;

    }
};
var itemNames = new Array();
var itemAppids = new Array();
function StorageData(){
    for(var k = 0; k<printItems.length; k++){
        itemNames[k] = printItems[k].substr(0, printItems[k].length -3);
        itemAppids[k] = printItems[k].substr(printItems[k].length - 3);
        itemCounter++;
    }
}
var cnt = 0;
function cntCheck(){

       if(printItems.length>0){
        cnt = printItems.length;
    }else{
        cnt = 0;
    }
}


function replaceAll(){

    localStorage.clear();
    var itemsSelector = $('#items').children().eq(1).children();
    var itemsForReplacement = new Array();
    for(var s = 0; s < itemsSelector.length+1; s++){
        if(s == 0){

        }else{


            var x = s-1;
            specificSelector = itemsSelector.eq(x);
            name = specificSelector.attr('id');
            appid = specificSelector.attr('class');
            itemsForReplacement[s] = name+appid;
            localStorage.setItem("item"+s, itemsForReplacement[s]);

        }
    }

};

function clearCurrent(){

    var itemsSelector = $('#items').children().eq(1).children();
    // var lengthFix = itemsSelector.length-2;
    for(var s = 0;s<itemsSelector.length+1; ++s){
        if(s == 0){

        }else{
            specificSelector = itemsSelector.eq(s-1).attr('name');
            localStorage.removeItem("item"+specificSelector);
            cnt--;
        }
    }

};

function addAll(){

    var itemsSelector = $('#items').children().eq(1).children();
    var itemsToAdd = new Array();
    var lengthFix = itemsSelector.length-2;
    for(var s = 0;s<itemsSelector.length+1; ++s){
        if(s == 0){

        }else{
            specificSelector = itemsSelector.eq(s-1);
            var x = cnt;
            name = specificSelector.attr('id');
            appid = specificSelector.attr('class');
            itemsToAdd[s] = name+appid;
            localStorage.setItem("item"+x, itemsToAdd[s]);
            cnt++;
        }
    }

};

var t;
var o = 0;
function myLoop(){
    setTimeout(function(){
        // for(var o = 0; o<itemCounter; ++o){
            console.log(itemNames[o]+"   "+itemAppids[o]);
            printItem(itemNames[o], itemAppids[o]);
            // cnt++;
            o++;
            if(o<itemCounter){
                myLoop();
            }else{
                setTimeout(function(){
                    $("#storagePrintModal").modal('hide')
                },500);

            }

        // }
    }, 500);

}
$(document).ready(function() {
    $.notify.defaults({ className: "success" });
    search = $('#search').val();
    $('#search').keyup(function() {
        clearTimeout (t);

        t = setTimeout('marketSearch(search)', 1000);

    if(search.length == 0){
        document.getElementById("results").innerHTML = "";
    }
    setTimeout(function(){
            if($('#auto').is(':checked')){
        $('#results').find("button").switchClass("btn-default","btn-success", 1000, "easeInOutQuad");
        $('#items').find("button").switchClass("btn-default","btn-danger", 1000, "easeInOutQuad");
    }else{
        $('#results').find("button").switchClass("btn-success","btn-default", 1000, "easeInOutQuad");
        $('#items').find("button").switchClass("btn-danger","btn-default", 1000, "easeInOutQuad");
    }
}, 2000);

    });
    checkStorage();
    cntCheck();
    if(ok==1){
        var item = $(this);
        $(".modal_print_link").on("click", function(){
            $("#modal-print-confirmation").html('Printing the items, please wait...');
            $("#modal-print-buttons").children().remove();
            StorageData();
            myLoop();

        });
        $("#storagePrintModal").modal('show');
    }



});
function marketSearch(query)
{
    query = document.getElementById("search").value;
    resultsCount = $('#searchCounter').val();
    if(query.length > 0){
        document.getElementById("results").innerHTML = "";
  xmlhttp=new XMLHttpRequest();

  xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        // var newElement = document.createElement('div');
       document.getElementById("results").innerHTML = xmlhttp.responseText;
      // document.getElementById("results").appendChild(newElement);
    }
  }
  url = "ajax.php?resultsItem="+query+"&resultsCount="+resultsCount;
xmlhttp.open("GET",url,true);
xmlhttp.send();
    }

}
var listCnt = 0;
function printItem(name, appid)
{

  xmlhttp=new XMLHttpRequest();

  xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        var newElement = document.createElement('tr');
        newElement.setAttribute("id", name);
        newElement.setAttribute("class", appid);
        newElement.setAttribute("name", listCnt);
        newElement.innerHTML = xmlhttp.responseText;
      document.getElementsByTagName("tbody")[0].appendChild(newElement);
      listCnt++;
    }
  }
  url = "ajax.php?PrintName="+name+"&PrintAppid="+appid;
xmlhttp.open("GET",url,true);
xmlhttp.send();
    }

function checkPrice(name, appid, currency, number)
{
    console.log(number);
    console.log(name);
    console.log(appid);
  xmlhttp=new XMLHttpRequest();

  xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        var newElement = document.getElementsByName(number);
        newElement = newElement[0].childNodes[4];
        newElement.innerHTML = xmlhttp.responseText;
      // document.getElementById(name).appendChild(newElement);
    }
  }

  url = "ajax.php?CheckName="+name+"&CheckAppid="+appid+"&CheckCurrency="+currency;
xmlhttp.open("GET",url,true);
xmlhttp.send();
    }

function ringTheBells(sel){
    check = sel.children('td').eq(6).children();
    if(check.val()){
        price = sel.children('td').eq(4).html();
        check = check.val();
        name = sel.children('td').eq(2).text();
        price = price.replace( /[^0-9+,.]/gi, '' );
        check = check.replace( /[^0-9+,.]/, '' );
        // var s = price+check;
        // var matches = s.match(/^\s\d*.\d*/);
        // price = matches[1];
        // check = matches[2];
        console.log(price);
        console.log(check);
        if(price <= check){
            $.notify(name+" has reached the desired price",
            {
                class:"success",
                position:"top-right"
            });
            document.getElementById('wakemeup').play();
        }
    }else{
        return;
    }

}
var myInterval = new Array();
var notInterval = new Array();

$('#items').on('change', '.activator', function(){

    number = $(this).parent().parent().children('td').eq(7).children().attr('name');
    if ($(this).is(':checked')) {
        selector = $(this).parent().parent();
        id = selector.attr('id');
        cls = selector.attr('class');
        numb = selector.attr('name');
        frequency = selector.children('td').eq(5).children().val();
        frequency = frequency*1000;
        myInterval[number] = number;
        notInterval[number] = number;
        currency = $("#currency :selected").val();
        startLoop(myInterval[number],id, cls, selector,currency, numb);
        setTimeout(function(){
            startNotification(notInterval[number] = number,selector);
        }, 1000);



      } else {

        clearInterval(myInterval[number]);
        clearInterval(notInterval[number]);

      }
    function startLoop(int,id,cls,sele,curr,numb) {
    if(frequency == 0){
        frequency = 10000;
        $.notify("Item number "+numb+"'s frequency defaulted to 10s due to lack of frequency.",{position:"top-center",
            className:"error"});

    }
    checkPrice(id,cls,curr,numb);
    setTimeout(function(){
        ringTheBells(sele)},1000);

    myInterval[int] = setInterval(function(){
        checkPrice(id,cls,curr,numb);
    }, frequency );


}

function startNotification(int,sele){
    notInterval[int] = setInterval(function(){
        ringTheBells(sele);
    }, frequency );
}

});
var items = new Array();


function storeMyPain(counter){
    // localStorage.items[counter] = items[counter];
    localStorage.setItem("item"+counter, items[counter]);
}

function deleteItemFromStorage(counter){
    localStorage.removeItem("item"+counter);
    // cnt--;
}

function deleteItemFromList(sele){
        var tr = sele.closest('tr');
        tr.css("background-color","#FF3700");
        tr.fadeOut(400, function(){
            tr.remove();
        });
        listCnt--;
}

$('#test').on("change", "input:checkbox",function(){

    if($('#auto').is(':checked')){
        $('#results').find("button").switchClass("btn-default","btn-success", 1000, "easeInOutQuad");
        $('#items').find("button").switchClass("btn-default","btn-danger", 1000, "easeInOutQuad");
        $('#addUrlApply').find("button").switchClass("btn-info","btn-success", 1000, "easeInOutQuad");
     var t = $('#results').on("click", "button", function(){
         name = $(this).attr('name');
         appid = $(this).attr('class').split(' ')[2];
         items[cnt] = name+appid;

         storeMyPain(cnt);
         cnt++;
         setTimeout(function(){
            if($('#auto').is(':checked')){
        $('#results').find("button").switchClass("btn-default","btn-success", 1000, "easeInOutQuad");
        $('#items').find("button").switchClass("btn-default","btn-danger", 1000, "easeInOutQuad");

    }else{
        $('#results').find("button").switchClass("btn-success","btn-default", 1000, "easeInOutQuad");
        $('#items').find("button").switchClass("btn-danger","btn-default", 1000, "easeInOutQuad");
    }
}, 1000);
     });
 }else{
    $('#results').off("click", "button", t);
    $('#results').find("button").switchClass("btn-success","btn-default", 1000, "easeInOutQuad");
    $('#items').find("button").switchClass("btn-danger","btn-default", 1000, "easeInOutQuad");
    $('#addUrlApply').find("button").switchClass("btn-success","btn-info", 1000, "easeInOutQuad");
 }
});



$('#items').on("click", "button", function(){
    var cont = $(this).attr('name');
    var selecActi = $(this).parent().parent().children().eq(1).children().eq(0);
    if($('#auto').is(':checked')){
        var item = $(this);

        $(".modal_delete_link").on("click", function(){
            deleteItemFromStorage(item.attr('name'));
        });
        $(".modal_delete_link").on("click", function(){
            selecActi.prop('checked', false);
            selecActi.change();
            deleteItemFromList(item);
        });
        $("#singleDeleteModal").modal('show');

    }else{
        selecActi.prop('checked', false);
        selecActi.change();
        deleteItemFromList($(this));
    }
});

$('#addUrlApply').on("click", "button", function(){
    var link = $(this).parent().parent().children().eq(0).children().val();
    var name = link.slice(46);
    var appid = link.slice(42,45);
    if(link != ""){
        if($('#auto').is(':checked')){
             items[cnt] = name+appid;

             storeMyPain(cnt);
             cnt++;
            printItem(name,appid);
            // $(".modal_delete_link").on("click", function(){
            //     deleteItemFromStorage(item.attr('name'));
            // });

        }else{
            printItem(name,appid);
        }
    }

});

$('th').on("change", "input:checkbox", function(event){
        if($(this).is(':checked')){
            $('.checkBoxes').each(function(){
                this.checked = true;
            });
        } else{
            $('.checkBoxes').each(function(){
                this.checked = false;
            });
        }
    });

$('#buttons').on("click", "#storageClear", function(){

    $(".modal_delete_all_link").on("click", function(){
        localStorage.clear();
        $("#modal-delete-all-confirmation").html('Storage cleared.');
        setTimeout(function(){
            $("#storageDeleteModal").modal('hide')},
        1000);
        setTimeout(function(){
            $("#modal-delete-all-confirmation").html('Are you sure you want to do that?')},
        2000);

        });

        $("#storageDeleteModal").modal('show');
});

$('#buttons').on("click", "#storageReplace", function(){

    $(".modal_replace_all_link").on("click", function(){
        replaceAll();
        $("#modal-replace-all-confirmation").html('Storage replaced. The page will reload shortly.');
        setTimeout(function(){
            $("#replaceAllModal").modal('hide');
            window.location.reload();},
        1500);


        });

        $("#replaceAllModal").modal('show');
});

$('#buttons').on("click", "#storageAddAll", function(){

        addAll();
        $.notify("Items added.",
            {
                class:"success",
                position:"top-center"
            });

});

$('#buttons').on("click", "#clearCurrent", function(){

    $(".modal_clear_current_link").on("click", function(){
        clearCurrent();
        $("#modal-clear-current-confirmation").html('Items cleared from the storage');
        setTimeout(function(){
            $("#storageClearCurrentModal").modal('hide')},
        1000);
        setTimeout(function(){
            $("#modal-clear-current-confirmation").html('Are you sure you want to do that?')},
        2000);

        });

        $("#storageClearCurrentModal").modal('show');
});
function myDelay(){
    setTimeout(function(){
        // for(var o = 0; o<itemCounter; ++o){
            // console.log(itemNames[o]+"   "+itemAppids[o]);
            if(checkBoxes[c].checked){
            var selectorActivator = $('.activator').eq(c);
             var name = $('#items').children().eq(1).children().eq(c).attr('id');
             var appid = $('#items').children().eq(1).children().eq(c).attr('class');

            if(!selectorActivator.prop('checked')){
                selectorActivator.prop('checked', true);
                selectorActivator.change();
            }




        }
            // cnt++;


            if(c<checkedCheckBoxes){
                myDelay();
                c++;
            }else{
                c=0;
            }


        // }
    }, 1000);

}
$('#bulkOptionsApply').on("click", "input", function(){
    checkBoxes = $('.checkBoxes');
    checkedCheckBoxes = $('.checkBoxes:checked').length;
    option = $("#bulkOptionContainer :selected").val();
    c = 0;
    if(option == "activate"){


    myDelay();
    }else{
        for(var i = 0; i < checkBoxes.length; ++i){
        if(checkBoxes[i].checked){
            var selectorActivator = $('.activator').eq(i);
             var name = $('#items').children().eq(1).children().eq(i).attr('id');
             var appid = $('#items').children().eq(1).children().eq(i).attr('class');

             switch(option){

                case "deactivate":
                    selectorActivator.prop('checked', false);
                    selectorActivator.change();
                    break;

                case "deleteList":
                    selectorActivator.prop('checked', false);
                    selectorActivator.change();
                    deleteItemFromList(selectorActivator);
                    break;

                case "addStorage":

                     items[cnt] = name+appid;

                     storeMyPain(cnt);
                     cnt++;
                    $.notify(name+" added.",
                    {
                        class:"success",
                        position:"top-center"
                    });
                    break;

                case "deleteStorage":
                    deleteItemFromStorage($('#items').children().eq(1).children().eq(i).attr('name'));
                    $.notify(name+" deleted.",
                    {
                        className:"warn",
                        position:"top-center"
                    });
                    break;

                case "deleteStorageAndList":
                    selectorActivator.prop('checked', false);
                    selectorActivator.change();
                    deleteItemFromList(selectorActivator);
                    deleteItemFromStorage($('#items').children().eq(1).children().eq(i).attr('name'));
                    $.notify(name+" deleted.",
                    {
                        className:"warn",
                        position:"top-center"
                    });
                    break;

                default:

                break;
            }
        }
    }
}
});

$("#searchCounter").hover(function(event) {
    $("#spookyDiv").show();
}, function() {
    $("#spookyDiv").hide();
});


</script>

<!--

currency for ajax search - not possibel

IF EMPTY LIST FIRST ITEMS GET OVERWRITTEN, FIX THE CNT OR SOMETHING - fixed?

color change with delay on "+"


button name is the issue - it should delete from storage based on value of the ? BASE IT ON CNT || FIXED?? IS SESSION NOT NEEDED? CHECK THAT
simply don't lower the counter- who cares, it's remade after every refresh anyway.
how about basing the itemx on storage.length+1 ? same with list?
addAll() + addAll() - fix the values of "+", base them on cnt?
opportunity to get rid of $_SESSION number but do check what is cnt initially based on if nothing gets printed


code cleanup

-->
</div>
</body>
</html>

