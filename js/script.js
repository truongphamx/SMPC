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

// LOOP MADE TO SEPARATE EXECUTING BULK PRICE CHECK WITHOUT BLOATING THE SWITCH
function myDelay(){
    // INITIATE THE VARIABLES
    var checkBoxes = $('.checkBoxes');
    var checkedCheckBoxes = $('.checkBoxes:checked').length;

    setTimeout(function(){
        // FOR EVERY CHECKED BOX
        if(checkBoxes[c].checked){
            // INITIATE THE VARIABLES
            var selectorActivator = $('.activator').eq(c);
            var name = $('#items').children().eq(1).children().eq(c).attr('id');
            var appid = $('#items').children().eq(1).children().eq(c).attr('class');

            // IF THEY AREN'T ACTIVATED YET, ACTIVATE THEM
            if(!selectorActivator.prop('checked')){
                selectorActivator.prop('checked', true);
                selectorActivator.change();
            }

        }

        // LOOP TILL NOTHING ELSE TO CHECK
        if(c<checkedCheckBoxes-1){
            myDelay();
            c++;
        }else{
            c=0;
        }

    }, 1000);

}

// CHECKING THE PRICE AND NOTIFYING THE USER IF IT REACHED DESIRED POINT
function ringTheBells(selector){

    // INITIAL VARIABLE
    var check = selector.children('td').eq(6).children();

    // IF CHECK ISN'T EMPTY
    if(check.val()){

        // INITIATE MORE VARIABLES
        var price = selector.children('td').eq(4).html();
        var name = selector.children('td').eq(2).text();

        // WORK THE VARIABLES SO THAT THEY'RE STRIPPED OF NOT NEEDED CHARACTERS AND CONVERTED TO INTERGERS
        check = check.val();
        price = price.replace( /[^0-9+,.]/gi, '' );
        check = check.replace( /,/, '.');
        check = check.replace( /[^0-9+,.]/, '' );
        price = Number(price);
        check = Number(check);

        // CHECK IF THE PRICE HAS REACHED THE DESIRED PRICE
        if(price <= check){
            // IF YES, FIRE THE NOTIFICATION AND SOUND
            $.notify(name+" has reached the desired price",
            {
                class:"success",
                position:"top-right"
            });
            document.getElementById('wakemeup').play();
        }

    // OTHERWISE DON'T DO ANYTHING
    }else{
        return;
    }

}
// INITIATE THE ARRAYS TO KEEP TRACK OF THE INTERVAL LOOPS
var myInterval = new Array();
var notInterval = new Array();

// LOOP FUNCTION TO CHECK THE PRICE AND COMPARE IT WITH THE DESIRED ONE (ONCE)
function startLoop(id,cls,sele,curr,numb) {
    // IF FREQUENCY ISN'T SET
    if(frequency == 0){
        // CHANGE IT TO 10 SECONDS AND LET THE USER KNOW
        frequency = 10000;
        $.notify("Item number "+numb+"'s frequency defaulted to 10s due to lack of frequency.",{position:"top-center",
            className:"error"});
    }
    // FIRE THE PRICE CHECK FUNCTION FOR THE FIRST TIME AND A COMPARE FUNCTION AFTER A SECOND
    checkPrice(id,cls,curr,numb);
    setTimeout(function(){
        ringTheBells(sele)},1000);

    // INITIATE THE LOOP TO CHECK THE PRICE EVERY FREQUENCY VALUE
    myInterval[numb] = setInterval(function(){
        checkPrice(id,cls,curr,numb);
    }, frequency );


}

// LOOP FUNCTION TO COMPARE THE CURRENT PRICE WITH THE DESIRED ONE
function startNotification(int,sele){
    notInterval[int] = setInterval(function(){
        ringTheBells(sele);
    }, frequency );
}

// ***NAVBAR BUTTONS FUNCTIONS***

// REPLACE ALL ITEMS WITH THE CURRENT LIST
function replaceAll(){

    // CLEAR THE STORAGE
    localStorage.clear();
    // VARIABLE INITIATION
    var itemsSelector = $('#items').children().eq(1).children();
    // LOOPING THROUGH THE LIST AND ADDING THE ITEMS TO STORAGE
    for(var i = 0; i < itemsSelector.length; i++){

        var specificSelector = itemsSelector.eq(i);
        var name = specificSelector.attr('id');
        var appid = specificSelector.attr('class');
        localStorage.setItem("item"+i, name+appid);

    }

};

// REMOVE THE CURRENTLY SHOWN ITEMS FROM THE STORAGE
function clearCurrent(){

    // VARIABLE INITIATION
    var itemsSelector = $('#items').children().eq(1).children();
    // LOOPING THROUGH THE LIST AND REMOVING THE ITEMS FROM STORAGE
    for(var i = 0;i<itemsSelector.length; ++i){

        var specificSelector = itemsSelector.eq(i).children().eq(7).children().attr('name');
        localStorage.removeItem("item"+specificSelector);
        cnt--;

    }

};

// ADD THE CURRENTLY SHOWN ITEMS TO THE STORAGE
function addAll(){

    // VARIABLE INITIATION
    var itemsSelector = $('#items').children().eq(1).children();
    // LOOPING THROUGH THE LIST AND ADDING THE ITEMS TO STORAGE
    for(var i = 0;i<itemsSelector.length; ++i){

        var specificSelector = itemsSelector.eq(i);
        var name = specificSelector.attr('id');
        var appid = specificSelector.attr('class');
        localStorage.setItem("item"+cnt, name+appid);
        cnt++;

    }

};

// ***STORAGE/LIST FUNCTIONS***

// ARRAY TO HOLD THE ITEMS
var items = new Array();

// STORING THE ITEMS IN THE STORAGE
function storeMyPain(counter){
    localStorage.setItem("item"+counter, items[counter]);
}

// DELETING THE ITEMS FROM THE STORAGE
function deleteItemFromStorage(counter){
    localStorage.removeItem("item"+counter);
}

// DELETING THE ITEMS FROM THE LIST
function deleteItemFromList(sele){
        var tr = sele.closest('tr');
        tr.css("background-color","#FF3700");
        tr.fadeOut(400, function(){
            tr.remove();
        });
}

// *** BUTTONS STYLES ***

// AUTO STORAGE ON
function lightsOn(){
    $('#results').find("button").switchClass("btn-default","btn-success", 1000, "easeInOutQuad");
    $('#items').find("button").switchClass("btn-default","btn-danger", 1000, "easeInOutQuad");
    $('#addUrlApply').find("button").switchClass("btn-info","btn-success", 1000, "easeInOutQuad");
}

// AUTO STORAGE OFF
function lightsOut(){
    $('#results').find("button").switchClass("btn-success","btn-default", 1000, "easeInOutQuad");
    $('#items').find("button").switchClass("btn-danger","btn-default", 1000, "easeInOutQuad");
    $('#addUrlApply').find("button").switchClass("btn-success","btn-info", 1000, "easeInOutQuad");
}

// *** AJAX CALLS ***

// SEARCHING FOR ITEMS CALL
function marketSearch(query)
{
    // INITIATING THE VARIABLES
    var query = document.getElementById("search").value;
    var resultsCount = $('#searchCounter').val();

    // CHECKING IF THERE'S ACTUALLY ANYTHING TO SEND
    if(query.length > 0){

        // CLEARING THE PREVIOUS RESULTS
        document.getElementById("results").innerHTML = "";

        // STANDARD AJAX STUFF
        xmlhttp=new XMLHttpRequest();

        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {

            // DISPLAYING THE RESULTS
            document.getElementById("results").innerHTML = xmlhttp.responseText;

            }
        }

        url = "ajax.php?resultsItem="+query+"&resultsCount="+resultsCount;
        xmlhttp.open("GET",url,true);
        xmlhttp.send();
    }

}

// ADDING THE ITEMS TO THE LIST CALL
function printItem(name, appid)
{

    // STANDARD AJAX STUFF
    xmlhttp=new XMLHttpRequest();

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            // CREATING A NEW <TR> AND ADDING IT TO THE LIST
            var newElement = document.createElement('tr');
            newElement.setAttribute("id", name);
            newElement.setAttribute("class", appid);
            newElement.setAttribute("name", $('#items').children().eq(1).children().length);
            newElement.innerHTML = xmlhttp.responseText;
            document.getElementsByTagName("tbody")[0].appendChild(newElement);
        }
    }
    url = "ajax.php?PrintName="+name+"&PrintAppid="+appid;
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
}

// CHECKING THE PRICE OF THE ITEM CALL
function checkPrice(name, appid, currency, number)
{
    // STANDARD AJAX STUFF
    xmlhttp=new XMLHttpRequest();

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            // DISPLAYING THE PRICE
            var newElement = document.getElementsByName(number);
            newElement = newElement[0].childNodes[4];
            newElement.innerHTML = xmlhttp.responseText;

        }
    }

    url = "ajax.php?CheckName="+name+"&CheckAppid="+appid+"&CheckCurrency="+currency;
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
}

// ***DOM READY***
var t;
$(document).ready(function() {

    // SETTING THE DEFAULT NOTIFICATION CLASS
    $.notify.defaults({ className: "success" });

    // SEARCH FUNCTION
    $('#search, #searchCounter').keyup(function() {

        // INITIATING THE DELAY
        clearTimeout (t);
        t = setTimeout('marketSearch()', 1000);

        // IF THE SEARCH FIELD IS EMPTY SIMPLY CLEAN THE RESULTS
        if($('#search').val().length == 0){
            document.getElementById("results").innerHTML = "";
        }

        // REFRESH THE COLORS OF THE BUTTONS FOR AUTO STORAGE
        setTimeout(function(){
            // CHECK IF AUTO STORAGE IS ON
            if($('#auto').is(':checked')){
                // IF IT IS, SWITCH THE CLASSES TO REFLECT AUTO STORAGE
                lightsOn();
            }else{
                // IF NOT, SWITCH TO DEFAULT BUTTONS
                lightsOut();
            }
        }, 2000);

    });

    // STORAGE RELATED INITIATION
    checkStorage();
    cntCheck();

    // IF AT LEAST ONE STORED ITEM
    if(storedItems[0]){

        // ASK THE USER WHETHER HE WANTS TO USE THE STORED ITEMS
        $(".modal_print_link").on("click", function(){
            // ON YES PRINT THE LIST AND LET THE USER KNOW IT'S BEING PRINTED
            $("#modal-print-confirmation").html('Printing the items, please wait...');
            $("#modal-print-buttons").children().remove();
            StorageData();
            myLoop();

        });
        $("#storagePrintModal").modal('show');
    }

    // ***ON CHANGE/CLICK EVENTS***

    // ACTIVATE THE PRICE CHECK

    // ON CHECKING THE "CHECK THE PRICE " CHECKBOX
    $('#items').on('change', '.activator', function(){

        // INITIATE THE VARIABLES
        var selector = $(this).parent().parent();
        var id = selector.attr('id');
        var cls = selector.attr('class');
        var numb = selector.attr('name');

        // AS LONG AS THE CHECKBOX IS CHECKED
        if ($(this).is(':checked')) {
            // INITIATE MORE VARIABLES
            var currency = $("#currency :selected").val();
            frequency = selector.children('td').eq(5).children().val();
            frequency = frequency*1000;
            myInterval[numb] = numb;
            notInterval[numb] = numb;

            // START THE PRICE CHECK LOOP AND THEN THE PRICE COMPARE A SECOND AFTER THAT
            startLoop(id, cls, selector,currency, numb);
            setTimeout(function(){
                startNotification(numb,selector);
            }, 1000);

        // OTHERWISE
          } else {
            // CLEAR THE LOOPS
            clearInterval(myInterval[numb]);
            clearInterval(notInterval[numb]);

          }


    });

    // STORING THE ITEMS
    $('#test').on("change", "input:checkbox",function(){

    // IF AUTO STORAGE IS CHECKED
    if($('#auto').is(':checked')){
        // SWITCH THE BUTTONS TO REFLECT THE AUTO STORAGE
        lightsOn();

        // EXECUTE THE STORAGE FUNCTIONS
        var t = $('#results').on("click", "button", function(){
            // INITIATE THE VARIABLES
            var name = $(this).attr('name');
            var appid = $(this).attr('class').split(' ')[2];
            // ADD THE NAME AND THE APPID TO THE ITEMS ARRAY TO LATER ADD IT TO THE STORAGE
            items[cnt] = name+appid;

            // STORE THE ITEM AND INCREMENT THE COUNTER
            storeMyPain(cnt);
            cnt++;

            // MAKE SURE THE NEWLY ADDED ITEM HAS CORRECTLY STYLED BUTTONS
            setTimeout(function(){
                if($('#auto').is(':checked')){
                    lightsOn();

                }else{
                    lightsOut();
                }
            }, 1000);

         });

     }else{
        // DON'T EXECUTE THE STORAGE FUNCTIONS
        $('#results').off("click", "button", t);
        lightsOut();
     }

    });

    // DELETING THE ITEMS FROM THE LIST
    $('#items').on("click", "button", function(){

        // INITIATING THE VARIABLES
        var cont = $(this).attr('name');
        var selecActi = $(this).parent().parent().children().eq(1).children().eq(0);

        // IF AUTO STORAGE IS ON
        if($('#auto').is(':checked')){

            // DELETE THE ITEM FROM THE STORAGE ON DELETE
            $(".modal_delete_link").on("click", function(){
                deleteItemFromStorage($(this).attr('name'));
            });

            // UNCHECK THE CHECKBOX TO DEACTIVATE THE PRICE CHECKER AND DELETE IT FROM THE LIST ON DELETE
            $(".modal_delete_link").on("click", function(){
                selecActi.prop('checked', false);
                selecActi.change();
                deleteItemFromList($(this));
            });

            // SHOW THE MODAL TO CONFIRM
            $("#singleDeleteModal").modal('show');

        // OTHERWISE
        }else{
            // UNCHECK THE CHECKBOX TO DEACTIVATE THE PRICE CHECKER AND DELETE IT FROM THE LIST
            selecActi.prop('checked', false);
            selecActi.change();
            deleteItemFromList($(this));
        }
    });

    // ADDING ITEMS WITH THE USAGE OF URL
    $('#addUrlApply').on("click", "button", function(){
        // INITIATING THE VARIABLES
        var link = $(this).parent().parent().children().eq(0).children().val();
        var name = link.slice(46);
        var appid = link.slice(42,45);

        // CHECK IF THERE'S ANYTHING IN THE LINK FIELD
        if(link != ""){
            // IF THERE IS AND AUTO IS CHECKED
            if($('#auto').is(':checked')){

                // ADD THE ITEM TO THE ITEMS ARRAY
                items[cnt] = name+appid;

                // STORE IT IN THE LOCALSTORAGE AND INCREMENT THE COUNTER
                storeMyPain(cnt);
                cnt++;

                // PRINT IT TO THE LIST
                printItem(name,appid);

            // OTHERWISE
            }else{
                // JUST PRINT THE ITEM TO THE LIST
                printItem(name,appid);
            }
        }

    });

    // BULK CHECK
    $('th').on("change", "input:checkbox", function(event){
        // CHECK THE BOXES
        if($(this).is(':checked')){
            $('.checkBoxes').each(function(){
                this.checked = true;
            });
        // UNCHECK THE BOXES
        }else{
            $('.checkBoxes').each(function(){
                this.checked = false;
            });
        }
    });

    // CLEARING THE STORAGE
    $('#buttons').on("click", "#storageClear", function(){

        // ON DELETE
        $(".modal_delete_all_link").on("click", function(){

            // CLEAR THE STORAGE
            localStorage.clear();

            // LET THE USER KNOW IT HAS BEEN CLEARED
            $("#modal-delete-all-confirmation").html('Storage cleared.');

            // HIDE IT
            setTimeout(function(){
                $("#storageDeleteModal").modal('hide')},
            1000);

            // ASK THE USER IF HE ACTUALLY WANTS TO CLEAR IT
            setTimeout(function(){
                $("#modal-delete-all-confirmation").html('Are you sure you want to do that?')},
            2000);

        });

        // SHOW THE MODAL
        $("#storageDeleteModal").modal('show');

    });

    // REPLACING THE STORAGE
    $('#buttons').on("click", "#storageReplace", function(){

        // ON REPLACE
        $(".modal_replace_all_link").on("click", function(){

            // REPLACE IT
            replaceAll();

            // LET THE USER KNOW AND RELOAD THE PAGE TO PREVENT STORAGE ISSUES
            $("#modal-replace-all-confirmation").html('Storage replaced. The page will reload shortly.');

            setTimeout(function(){
                $("#replaceAllModal").modal('hide');
                window.location.reload();},
            1500);

        });

        // SHOW THE MODAL
        $("#replaceAllModal").modal('show');

    });

    // ADDING THE CURRENT LIST TO THE STORAGE
    $('#buttons').on("click", "#storageAddAll", function(){
        // ADD EVERYTHING
        addAll();

        // NOTIFY THE USER
        $.notify("Items added.",
        {
            class:"success",
            position:"top-center"
        });

    });

    // CLEARING THE CURRENT LIST FROM THE STORAGE
    $('#buttons').on("click", "#clearCurrent", function(){

        // ON CLEAR CURRENT
        $(".modal_clear_current_link").on("click", function(){

            // CLEAR IT
            clearCurrent();

            // LET THE USER KNOW
            $("#modal-clear-current-confirmation").html('Items cleared from the storage');

            // HIDE THE MODAL
            setTimeout(function(){
                $("#storageClearCurrentModal").modal('hide')},
            1000);

            // ASK TO CONFIRM
            setTimeout(function(){
                $("#modal-clear-current-confirmation").html('Are you sure you want to do that?')},
            2000);

        });

        // SHOW THE MODAL
        $("#storageClearCurrentModal").modal('show');
    });

    // BULK OPTIONS EXECUTION
    $('#bulkOptionsApply').on("click", "input", function(){
        // INITIATE THE VARIABLES
        var checkBoxes = $('.checkBoxes');
        var checkedCheckBoxes = $('.checkBoxes:checked').length;
        var option = $("#bulkOptionContainer :selected").val();
        c = 0;

        // IN CASE OF ACTIVATE
        if(option == "activate"){
        // ACTIVATE EVERYTHING USING A DELAYED LOOP
        myDelay();

        // OTHERWISE JUST USE A SWITCH
        }else{

            // LOOP THROUGH CHECKED BOXES
            for(var i = 0; i < checkBoxes.length; ++i){

                // IF THEY'RE CHECKED
                if(checkBoxes[i].checked){

                    // INITIATE THE VARIABLES
                    var selectorActivator = $('.activator').eq(i);
                    var selectorStorage = $('#items').children().eq(1).children().eq(i).children().eq(7).children().attr('name');
                    var name = $('#items').children().eq(1).children().eq(i).attr('id');
                    var appid = $('#items').children().eq(1).children().eq(i).attr('class');

                    // SWITCH BASED ON THE SELECTED OPTION
                    switch(option){

                        // IN CASE OF DEACTIVATE
                        case "deactivate":
                            // UNCHECK ALL THE ITEMS
                            selectorActivator.prop('checked', false);
                            selectorActivator.change();
                            break;

                        // IN CASE OF DELETE FROM THE LIST
                        case "deleteList":
                            // UNCHECK AND DELETE
                            selectorActivator.prop('checked', false);
                            selectorActivator.change();
                            deleteItemFromList(selectorActivator);
                            break;

                        // IN CASE OF ADD TO STORAGE
                        case "addStorage":

                            // ADD THE ITEM TO THE ITEMS ARRAY
                            items[cnt] = name+appid;

                            // STORE IT IN THE LOCALSTORAGE AND INCREMENT THE COUNTER
                            storeMyPain(cnt);
                            cnt++;

                            // NOTIFY THE USER
                            $.notify(name+" added.",
                            {
                                class:"success",
                                position:"top-center"
                            });

                            break;

                        // IN CASE OF DELETE FROM STORAGE
                        case "deleteStorage":
                            // DELETE FROM STORAGE AND NOTIFY THE USER
                            deleteItemFromStorage(selectorStorage);
                            $.notify(name+" deleted.",
                            {
                                className:"warn",
                                position:"top-center"
                            });
                            break;

                        // IN CASE OF DELETE FROM STORAGE AND LIST
                        case "deleteStorageAndList":
                            // DEACTIVATE THE PRICE CHECK
                            selectorActivator.prop('checked', false);
                            selectorActivator.change();

                            // DELETE FROM THE LIST AND THE STORAGE
                            deleteItemFromList(selectorActivator);
                            deleteItemFromStorage(selectorStorage);

                            // NOTIFY THE USER
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

    // INFO ABOUT THE COUNTER ON HOVER
    $("#searchCounter").hover(function(event) {
        $("#spookyDiv").show();
    }, function() {
        $("#spookyDiv").hide();
    });

});
// END OF ON DOCUMENT READY


