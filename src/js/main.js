(function () {
    const Feed = require('rss-to-json');

    const el = document.getElementById('article');

    // Note: some RSS feeds can't be loaded in the browser due to CORS security.
    // To get around this, you can use a proxy.
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

    const feeds = [
        'http://javascriptissexy.com/rss',
        'https://benmccormick.org/rss/',
        'http://www.programwitherik.com/rss/',

    ];

    const articles = 6; // Set the number of articles to display for each feed

    function headerAppend(rss) {
        // Get title and description of the feed
        let title = rss.title;
        let description = rss.description;

        // Create row
        let div = document.createElement('div');
        div.classList.add('row');
        el.appendChild(div);

        // Create column
        let div2 = document.createElement('div');
        let classesToAdd = ['12', 'columns'];
        div2.classList.add(...classesToAdd);
        div.appendChild(div2);

        // Create feed header
        let header = document.createElement('header');
        header.innerHTML = '<hr><h2>' + title + '</h2><br>' + '<p>' + description + '</p><br>';
        div2.appendChild(header);

        return div2;
    }

    function articleAppend(article, div) {
        if (article === undefined | null) {
            return;
        }
        // Append an article to the page
        let div2 = document.createElement('article');
        let title = article.title;
        let description = article.description;
        let url = article.url;

        div2.innerHTML = '<h3>' + title + '</h3><br>' + '<p>' + description + '</p><br>' + '<a href="' + url + '">' + url + '</a>';
        div.appendChild(div2);
    }

    function processRss(feed) {
        // Retrieve feed header from sessionStorage and append to page
        let head = JSON.parse(sessionStorage.getItem(JSON.stringify('header' + feed)));

        let div = headerAppend(head);
        // Retrieve the articles for the feed and append to page
        for (let key = 0; key < articles; key++) {
            let i = feed + key;
            let article = JSON.parse(sessionStorage.getItem(JSON.stringify(i)));
            articleAppend(article[key], div);
        }
    }

    function firstLoad() {
        for (let feed in feeds) {
            if (!sessionStorage.getItem('entry')) {
                // Get the data for each RSS feed
                Feed.load(CORS_PROXY + feeds[feed], (err, rss) => {
                    // Set the feed header and save
                    let div = headerAppend(rss);
                    sessionStorage.setItem(JSON.stringify('header' + feed), JSON.stringify(rss));

                    let cache = [];
                    // Get first 6 articles
                    for (let i = 0; i < articles; i++) {
                        let obj = {
                            title: rss.items[i].title,
                            description: rss.items[i].description,
                            url: rss.items[i].url
                        };
                        cache.push(obj);

                        // Save data to sessionStorage
                        sessionStorage.setItem(JSON.stringify(feed + i), JSON.stringify(cache));
                        sessionStorage.setItem('entry', 'true');

                        articleAppend(rss.items[i], div);
                    }
                });
            } else {
                processRss(feed);
            }
        }
    }
    firstLoad();

})();