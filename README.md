# Steam Market Price Checker
All your items in one tab

![home](http://i.imgur.com/YS2D3IP.png)

![functioningHome](http://i.imgur.com/CRG0fEt.png)

## Installation
Simply clone it or just download the zip and open index.html in your browser.
## Usage
Long story short you search for the items or add them using the Add By URL option. You can then ping the Steam Market servers to get the current lowest price of said items every "Frequency" value. You can also set up notifications by inputting your desired price in "Minimum Notification Price". When the current price reaches or gets below that value, you get notified.

All items you add to/remove from the list will also get added to/removed from the localStorage if Auto Storage is checked. If you have anything in the localStorage, the app will ask you whether you want to use them on the page reload.
Buttons in the navigation bar, bulk options and Auto Storage checkbox give you full control over what's in your localStorage.

Be careful when pinging often or pinging many items since Steam Market is pretty trigger happy when it comes to time outs nowadays and since I am using my own CORS proxy I am also limiting the requests due to being a free user on Heroku. If you are not happy with the amount of requests allowed you can set up your own CORS proxy (https://github.com/Rob--W/cors-anywhere/).

Full How-To available in the app itself. "Help" is what you want to click.
## Contributing
1. Fork it!
2. Contribute in any way you want.

## History
30/09/16 - Release.

31/10/16 - Updated to run locally without a server.

## License
MIT

##Thanks to
Row--W for his amazing cors-anywhere(https://github.com/Rob--W/cors-anywhere/)