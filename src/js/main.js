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
        'http://feeds.dzone.com/home',
        'https://rss.simplecast.com/podcasts/2067/rss'
    ];

    const articles = 6; // Set the number of articles to display for each feed

    function headerAppend(rss, feed) {
        if (rss === null || rss === undefined) {
            return;
        }
        // Get title and description of the feed
        let title = rss.title;
        let description = rss.description;

        // Create row
        let div = document.createElement('div');
        div.classList.add('row');
        div.setAttribute('id', 'a' + feed);
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
        if (article === null || article === undefined) {
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
            articleAppend(article[0], div);
        }
    }

    function firstLoad() {
        for (let feed in feeds) {
            if (!sessionStorage.getItem('entry')) {
                // Get the data for each RSS feed
                Feed.load(CORS_PROXY + feeds[feed], (err, rss) => {
                    // Set the feed header and save
                    let header = {
                        title: rss.title,
                        description: rss.description
                    };
                    let div = headerAppend(header, feed);
                    sessionStorage.setItem(JSON.stringify('header' + feed), JSON.stringify(rss));

                    // Get first 6 articles
                    for (let i = 0; i < articles; i++) {
                        let cache = [];
                        let obj = {
                            title: rss.items[i].title,
                            description: rss.items[i].description,
                            url: rss.items[i].url
                        };
                        cache.push(obj);

                        // Save data to sessionStorage
                        sessionStorage.setItem(JSON.stringify(feed + i), JSON.stringify(cache));

                        articleAppend(rss.items[i], div);
                    }

                    sessionStorage.setItem('entry', 'true');
                });
            } else {
                processRss(feed);
            }
        }
    }
    firstLoad();
})();