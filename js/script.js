// ***FUNCTIONS TO LATER BE CALLED***

// USED TO SORT THE STORAGE
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

// CHECKING THE STORAGE FOR ITEMS

// ARRAY TO STORE THE ITEMS FOR THE TIME BEING
var storedItems = new Array();

function checkStorage(){
    var storage = Object.keys(localStorage);
    // SORTING THE STORAGE
    storage.sort(naturalCompare);
    // LOOPING THROUGH THE STORAGE AND REMAKING THE ITEMS TO PREVENT OVERWRITING THEM
    for (var i = 0; i<storage.length; i++){
        // CHECKING FOR STORAGE ITEMS WITH THE STRING 'item' IN THEIR NAMES
        if(storage[i].includes('item')){
            storedItems[i] = localStorage.getItem(storage[i]);
            localStorage.removeItem(storage[i]);
            localStorage.setItem("item"+i, storedItems[i]);
        }

    }

};

// STORING THE ITEMS
var itemCounter = 0;
var itemNames = new Array();
var itemAppids = new Array();
function StorageData(){
    for(var i = 0; i<storedItems.length; i++){
        itemNames[i] = storedItems[i].substr(0, storedItems[i].length -3);
        itemAppids[i] = storedItems[i].substr(storedItems[i].length - 3);
        itemCounter++;
    }
}

// MAKING SURE THE COUNTER IS WORKING FINE
var cnt = 0;
function cntCheck(){
       if(storedItems.length>0){
        cnt = storedItems.length;
    }else{
        cnt = 0;
    }
}

// LOOP MADE TO DELAY THE PRINTING OF THE ITEMS DUE TO PRINTING DONE VIA AJAX
var o = 0;
function myLoop(){
    setTimeout(function(){
        printItem(itemNames[o], itemAppids[o]);
        o++;
        // KEEP LOOPING TILL EVERYTHING IS PRINTED
        if(o<itemCounter){
            myLoop();
        // THEN HIDE THE MODAL
        }else{
            setTimeout(function(){
                $("#storagePrintModal").modal('hide')
            },500);

        }

    }, 500);

}

// ***NAVBAR BUTTONS FUNCTIONS***

// REPLACE ALL ITEMS WITH THE CURRENT LIST
function replaceAll(){

    // CLEAR THE STORAGE
    localStorage.clear();
    // VARIABLE INITIATION
    var itemsSelector = $('#items').children().eq(1).children();
    var itemsForReplacement = new Array();
    // LOOPING THROUGH THE LIST AND ADDING THE ITEMS TO STORAGE
    for(var i = 0; i < itemsSelector.length+1; i++){
        if(i == 0){
            // do nothing
        }else{
            // less hassle this way and items are remade on the forced reload anyway
            var specificSelector = itemsSelector.eq(i-1);
            var name = specificSelector.attr('id');
            var appid = specificSelector.attr('class');
            itemsForReplacement[i] = name+appid;
            localStorage.setItem("item"+i, itemsForReplacement[i]);
        }
    }

};

// REMOVE THE CURRENTLY SHOWN ITEMS FROM THE STORAGE
function clearCurrent(){

    // VARIABLE INITIATION
    var itemsSelector = $('#items').children().eq(1).children();
    // LOOPING THROUGH THE LIST AND REMOVING THE ITEMS FROM STORAGE
    for(var i = 0;s<itemsSelector.length+1; ++i){
        if(i == 0){
            // do nothing
        }else{
            var specificSelector = itemsSelector.eq(i-1).attr('name');
            localStorage.removeItem("item"+specificSelector);
            cnt--;
        }
    }

};

// ADD THE CURRENTLY SHOWN ITEMS TO THE STORAGE
function addAll(){

    // VARIABLE INITIATION
    var itemsSelector = $('#items').children().eq(1).children();
    var itemsToAdd = new Array();
    var lengthFix = itemsSelector.length-2;
    // LOOPING THROUGH THE LIST AND ADDING THE ITEMS TO STORAGE
    for(var i = 0;i<itemsSelector.length+1; ++i){
        if(i == 0){
            // do nothing
        }else{
            var specificSelector = itemsSelector.eq(i-1);
            var name = specificSelector.attr('id');
            var appid = specificSelector.attr('class');
            itemsToAdd[i] = name+appid;
            localStorage.setItem("item"+cnt, itemsToAdd[i]);
            cnt++;
        }
    }

};

// *** AJAX CALLS ***

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

// ***DOM READY***
var t;
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
    if(storedItems[0]){
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
