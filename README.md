jquery-socialist -  A jQuery social plugin for creating streams from social networks and feeds
================

Even if you hate <a href='http://en.wikipedia.org/wiki/Socialism'>socialism</a>, you love this flexible jQuery social media plugin.
jQuery Socialist is a plugin that lets you create a social stream or social wall from multiple social networks in one place.
Use it to pull content from Facebook pages, Twitter, LinkedIn, YouTube and others...

Features
================
    - Display updates from multiple social networks in attractive visual layouts
    - Supports Facebook, Twitter, LinkedIn, YouTube, Tumblr, Pinterest, RSS Feeds, Craigslist, Google+ and more..
    - Multiple themes
    - Easy to implement with just a few lines of code


Usage
================
    
    1) Include the .js and .css files in your HTML document <HEAD> section:
    
    <link href="../jquery.socialist.css" rel="stylesheet" />
    <script src='../jquery.socialist.js'></script>

    2) Initiate jQuery Socialist to any <DIV> element within your javascript code:

    $('#content').socialist({
        networks: [
            {name:'linkedin',id:'buddy-media'},
            {name:'facebook',id:'in1dotcom'},
            {name:'pinterest',id:'potterybarn'},
            {name:'twitter',id:'in1dotcom'},
            {name:'googleplus',id:'105588557807820541973/posts'},
            {name:'rss',id:' http://feeds.feedburner.com/good/lbvp'},
            {name:'rss',id:'http://www.makebetterwebsites.com/feed/'},
            {name:'craigslist',id:'boo',areaName:'southcoast'},
            {name:'rss',id:'http://www.houzz.com/getGalleries/featured/out-rss'}
        ],
        isotope:false,
        random:false,
        fields:['source','heading','text','date','image','followers','likes']
    });

Examples
=========

    - <a href='http://plugins.in1.com/socialist'>Display Instagram photos in Pinterest-style layouts</a>
    - <a href='http://plugins.in1.com/socialist'>Combine and display Facebook, Twitter and LinkedIn updates</a>
    - <a href='http://plugins.in1.com/socialist'>Show YouTube video thumbnails</a>
    - <a href='http://plugins.in1.com/socialist'>Display Craiglist postings for an area and category</a>
    - <a href='http://plugins.in1.com/socialist'>Visualize any RSS feed as a responsive social wall</a>
    
    More Demos...

Dependencies
================

    The dependencies (included with jQuery Socialist):

    - jQuery Isotope Plugin v1.5.19: An exquisite jQuery plugin for magical layouts (http://isotope.metafizzy.co)
    - jQuery Cross Domain Ajax: http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
    
    
    