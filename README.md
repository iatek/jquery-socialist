jquery-socialist -  A jQuery social plugin for creating streams from social networks and feeds
================

Even if you hate <a href='http://en.wikipedia.org/wiki/Socialism'>socialism</a>, you love this flexible jQuery social media plugin.
jQuery Socialist is a plugin that lets you create a social stream or social wall from multiple social networks in one place.
Use it to pull content from Facebook pages, Twitter, LinkedIn, YouTube and others...

Features
================

    - Display updates from multiple social networks in attractive visual layouts
    - Supports Facebook, Twitter, LinkedIn, YouTube, Tumblr, Flickr, Pinterest, RSS Feeds, Craigslist, Google+ and more..
    - Multiple themes
    - Easy to implement with just a few lines of code


![Plugin Screenshot](http://plugins.in1.com/images/socialist/ss1.png)


Examples
================

[Display Flickr photos in Pinterest-style layouts][1]

[Combine and display Facebook, Twitter and LinkedIn updates][1] 

[Show YouTube video thumbnails][1] 

[Display Craiglist postings for an area and category][1] 

[Visualize any RSS feed as a responsive social wall][1] 

[Click Here for More Demos][2]
[1]: http://plugins.in1.com/socialist/demo
[2]: http://plugins.in1.com/socialist/

Usage
================
    
    1) Include the .js and .css files in your HTML document <HEAD> section:
    
    <link href="../jquery.socialist.css" rel="stylesheet" />
    <script src='../jquery.socialist.js'></script>

    2) Use jQuery Socialist on any <DIV> element:

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
        fields:['source','heading','text','date','image']
    });

Options
================
    **networks**
    An array of network definition objects
    **network definitions**
    A javascript object containing the name of the network, id and other network specific parameters.
    Most networks require only the id. Some networks such as Craiglist and Flickr require additional options.
    
        {name:'linkedin',id:'linkedin-companyname'},
        {name:'facebook',id:'(facebook-pagename)'},
        {name:'tumblr',id:'(tumblr-blogname)'},
        {name:'pinterest',id:'(pinterest-username/pinboard-name)'},
        {name:'flickr',id:'54772265@N04',apiKey:'(your-flick-api-key here)'},
        {name:'youtube',id:'potterybarn'},
        {name:'twitter',id:'in1dotcom'},
        {name:'googleplus',id:'105588557807820541973/posts'},
        {name:'rss',id:'http://www.makebetterwebsites.com/feed/'},
        {name:'craigslist',id:'boo',areaName:'southcoast'}
        
    **random**
    true or false; default value is: true
    **isotope**
    true or false; default value is: true
    **headingLength**
    An integer value that indicates the max number of characters to display in the 'heading' field of each result
    **textLength**
    An integer value that indicates the max number of characters to display in the 'text' description field
    **maxResults**
    An integer value that indicates the max number of results to show
    **theme**
    (none) or 'clean'; default value is: (none)
    **size**
    (none) or 'small' or 'large'; default value is:(none)
    **fields**
    An array of strings that indicate which field values to display. Any of the following: 'source','heading','text','date','image','share'

Dependencies
================

    The dependencies (included with jQuery Socialist):

    - jQuery Isotope Plugin v1.5.19: An exquisite jQuery plugin for magical layouts (http://isotope.metafizzy.co)
    - jQuery Cross Domain Ajax: http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
    
