<!-- Modal -->
<div id="infoModal" class="modal fade" role="dialog" style="display: none;">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Steam Market Price Checker</h4>
      </div>
      <div class="modal-body">
        <h2 class="text-center">Here's how this thing works, more or less.</h2>
        <p class="text-center">You search for the item you want to check the price of (number next to the search bar indicates the number of results [100 is a max due to how Steam Market works]) and then add it to the list using the + button. If Auto Storage is checked, that item will also be added to your localStorage, which you have total control of using the buttons in the navigation bar, bulk options and the Auto Storage checkbox. You can also add items using a Steam Market URL.</p>
        <p class="text-center">To retrieve the price of an item, simply check the box under "Check the price". It will request the data from Steam (using whatever currency is currently selected in the navigation bar) every "Frequency" value. If no value set, it will default to 10 seconds to prevent quick time outs. You'll then see the price under "Lowest price" unless you're timed out by Steam, in which case you'll see the "Timed out" message. Setting up notifications is also an option. Simply put the desired price in the "Minimum Notification Price" field and when the "Lowest price" reaches or goes lower than that amount, you'll be notified using a sound and a notification box.</p>
        <p class="text-center">Some restrictions have been implemented, such as a small delay when bulk activating the checker. Being bombarded with multiple calls at the same time ain't nice. Steam Market will time you out if you go too fast, too quick and AJAX will break too.</p>
        <p class="text-center">Now, about Auto Storage and localStorage in general. When Auto Storage is checked everything you add to or delete from the list also gets added to/deleted from your localStorage.
        localStorage is used on reload to pull all the previously saved items and print them to the list if you so desire. Other than that you have the bulk options which are pretty self explanatory and the navigation buttons.</p>
        <p class="text-center">"Replace the Storage" replaces the storage with what is currently on the list.
        "Add current list to the Storage" is again, self explanatory and so is the "Clear the storage".
        "Clear the current list from the Storage" will clear the storage off of items that are currently on the list.</p>
        <p class="text-center">Due to Steam Market servers being trigger happy with time outs I suggest setting the Frequency to something around 10 seconds and not pinging many items at the same time.</p>
        <p class="text-center">Feel free to edit stuff around, although the only thing that comes to my mind other than design would be the audio clip used when firing the notifications. Line #135 in index.php is where you want to look at.</p>
        <p class="text-center">Please report all the encountered bugs <a href="https://github.com/Extinox/SMPC/issues">HERE</a> (suggestions are welcomed too).</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>