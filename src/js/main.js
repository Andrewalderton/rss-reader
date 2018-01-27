(function () {
    var Feed = require('rss-to-json');

    var el = document.querySelector("article");

    // Note: some RSS feeds can't be loaded in the browser due to CORS security.
    // To get around this, you can use a proxy.
    var CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

    Feed.load(CORS_PROXY + 'http://feeds.bbci.co.uk/news/uk/rss.xml?edition=uk#', function (err, rss) {
        console.log(rss.items[0]);

        rss.items.forEach(function(item) {
            var div = document.createElement('div');
            var title = item.title;
            var description = item.description;
            var url = item.url;
            div.innerHTML = '<h2>'+title+'</h2><br>' + '<p>' + description + '</p><br>' + '<a href="' + url + '">' + url + '</a>';
            el.appendChild(div);
        });
    });

})();