jquery-socialist
================

Even if you hate <a href='http://en.wikipedia.org/wiki/Socialism'>socialism</a>, you love this flexible jQuery social media plugin.
jQuery Socialist is a plugin that lets you create a social stream or social "wall" from multiple social networks in one place.

Features
================
    - View updates from multiple social networks in responsive visual layouts
    - Supports Facebook, Twitter, LinkedIn, Tumblr, Pinterest, RSS Feeds, Google+ and more..
    

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


Dependencies
================

    The dependencies (included with jQuery Socialist):

    - jQuery Isotope Plugin v1.5.19: An exquisite jQuery plugin for magical layouts (http://isotope.metafizzy.co)
    - jQuery Cross Domain Ajax: http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
    
    
    