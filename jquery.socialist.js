/**
 * jQuery.socialist - social media plugin
 * ---
 * @author Carol Skelly (http://iatek.com)
 * @version 1.01
 * @license MIT license (http://opensource.org/licenses/mit-license.php)
 * ---
 */

;(function ( $, window, document, undefined ) {

    $.fn.socialist = function(method) {

        var methods = {

            init : function(options) {
                this.socialist.settings = $.extend({}, this.socialist.defaults, options);
                var networks = this.socialist.settings.networks,
                    settings = this.socialist.settings,
                    queue = [],
                    processList = [];
               
                // each instance of this plugin
                return this.each(function() {
                    var $element = $(this),
                        item,
                        visible = $element.is(":visible");
                    
                    // display loader
                    $element.addClass('socialist-loader');
                    
                    if (settings.feed) {
                        processList.push(helpers.doRequest(settings.feed,"json",function(q){
    						var container=$('<div></div>');
                            for (var i = 0; i < q.data.length; i++) {
                                item = q.data[i];
								var $div = $('<div class="socialist"></div>');
								$div.addClass('socialist-'+item.api);
								$div = helpers.buildItem(item,$div,settings.fields);
								$div.appendTo(container);
							}
							queue.push(container);
						},null,settings))
                    }
                    else {
                        // loop each network
                        for (var i = 0; i < networks.length; i++) {
                            item = networks[i];
                            var nw = helpers.networkDefs[item.name];
                            nw.cb=function(newElement){queue.push(newElement)};
                            var reqUrl = nw.url;
                            // replace params in request url
                            reqUrl = reqUrl.replace("|id|",encodeURIComponent(item.id));
                            reqUrl = reqUrl.replace("|areaName|",item.areaName);
                            reqUrl = reqUrl.replace("|apiKey|",item.apiKey);
                            reqUrl = reqUrl.replace("|num|",settings.maxResults);
                            // add to array for processing
                            processList.push(helpers.doRequest(reqUrl,nw.dataType,nw.cb,nw.parser,settings));
                        }
                    }
                    
                    // process the array of requests, then add resulting elements to container element
                    $.when.apply($, processList).always(function(){
       
                        for (var i = 0; i < queue.length; i++) {
                           queue[i].children().appendTo($element);
                        }
                        
                        // load isotope?
                        if (settings.isotope) {
                            $element.imagesLoaded(function(){
                                //console.log("loading iso");
                                $element.isotope ({
                                     animationEngine: 'jquery'
                                });
                                
                                $element.removeClass('socialist-loader');
                                
                                if (settings.random){
                                    $element.isotope( 'shuffle', function(){} );
                                }
                            });
                        }
                        else {
                            $element.removeClass('socialist-loader');
                        }
                        
                    },function(){
                        //console.log('some requests failed.');
                    });
                    
                }); // end plugin instance
            }
        }

        var helpers = {
            parseResults: function(apiParser,data,settings) {
                
                var container=$('<div></div>');
                //console.log(JSON.stringify(data));
                                                   
                apiParser.resultsSelector = apiParser.resultsSelector.replace('|num|',settings.maxResults);          
                    
                $.each(eval(apiParser.resultsSelector), function(i,item) {
                    
                    var $elem = $(item),
                        heading,
                        txt,
                        linkHref,
                        imgSrc,
                        imgHref,
                        imgAlt,
                        date;
                    
                    try{
                        
                        // eval is evil, but we use it here as a simple way to evaluate strings in our parser
                        if (eval(apiParser.preCondition)) {
                            var $div = $('<div class="socialist"></div>');
                            $div.addClass('socialist-'+apiParser.name);
                            
                            if (settings.fixed) {
                                 $div.addClass('socialist-fixed');   
                            }
                            
                            if (settings.theme) {
                                 $div.addClass('socialist-'+settings.theme);   
                            }
                            
                            if (settings.size) {
                                 $div.addClass('socialist-'+settings.size);   
                            }
                            
                            if (!settings.isotope) {
                                $div.addClass('socialist-simple'); 
                            }
                            
                            if (settings.width) {
                                $div.css('width',settings.width); 
                            }
                            
                            if (settings.margin) {
                                $div.css('margin',settings.margin); 
                            }
                            
                            if (settings.border) {
                                $div.css('border',settings.border); 
                            }
                            
                            if (settings.padding) {
                                $div.css('padding',settings.padding); 
                            }
                            
                            //console.log(item);
                                            
                            if (apiParser.headingSelector!==null){
                                heading = helpers.shorten(helpers.stripHtml(eval(apiParser.headingSelector)),settings.headingLength);
                            }
                            else {
                                heading = apiParser.heading;
                            }
                            
                            txt=eval(apiParser.txtSelector);
                            if (txt!==null) {
                                txt = helpers.shorten(txt,settings.textLength);
                            }
                            else {
                                txt = "";
                            }

                            // link href
                            linkHref="#";
                            
                            // image src
                            if (apiParser.imgSrcSelector===null){
                                imgSrc=apiParser.imgSrc;
                            }
                            else {
                                imgSrc=eval(apiParser.imgSrcSelector);
                                if (imgSrc!==null && apiParser.imgSrcProcessor!==null){
                                    imgSrc=eval(apiParser.imgSrcProcessor);
                                }
                                else if (imgSrc===null) {
                                    imgSrc="";
                                }
                            }

                            
                            // image link
                            if (apiParser.imgHrefSelector===null){
                                imgHref=apiParser.imgHref;
                            }
                            else {
                                imgHref=eval(apiParser.imgHrefSelector);
                            }
    
                            // image alt
                            if (apiParser.imgAltSelector!==null){
                                imgAlt=eval(apiParser.imgAltSelector);
                            }
                           
                            date=eval(apiParser.dateSelector);
                            if (typeof date==="undefined" || date===null) {
                                date = "";
                            }
                            
                            var itemObj = {
                                api:apiParser.name,
                                heading:heading,
                                txt:txt,
                                img:{"src":imgSrc,"href":imgHref,"alt":imgAlt},
                                link:{"href":linkHref,"title":imgAlt},
                                date:date
                            };
                            
                            $div = helpers.buildItem(itemObj,$div,settings.fields);
                            $div.appendTo(container);
                        }
                             
                    }
                    catch (e) {
                       //console.log("parse error:"+apiParser.name+":"+e)
                    }
                }); // end each
                return container;
            },
            doRequest: function(url,dataType,cb,parser,settings){
                //console.log("ajax: " + dataType + ":" + url);
                return $.ajax({
                    url: url,
                    type: "GET",
                    dataType: dataType,
                    success: function(data) {
                        if (parser)
                            cb($(helpers.parseResults(parser,data,settings)));
                        else
                            cb(data);
                    },
                    error: function(status) {
                        //console.log("request error:"+url);
                        cb($('<div></div>'));
                    }
                });
                
                //return;
            },
            buildItem: function(itemObj,container,fields) {
  
                var $headDiv = $('<div class="head"/>'),
                    $source = $('<div class="source"></div>'),
                    $sourceLnk = $('<a href="'+itemObj.img.href+'" title="'+itemObj.link.title+'"></a>'),
                    $sourceLnkDiv = $('<div/>'),
                    $apiSpan = $('<div class="api"></div>'),
                    $apiSpanLnk = $('<a href="'+itemObj.img.href+'"></a>'),
                    $contentDiv = $('<div class="content"/>'),
                    $contentDivInner = $('<div>'+itemObj.txt+' </div>'),
                    $imgLnk = $('<a href="'+itemObj.img.href+'" title="'+itemObj.link.title+'"></a>'),
                    $img = $('<image src="'+itemObj.img.src+'" alt="'+helpers.stripHtml(itemObj.img.alt)+'">'),
                    $shareDiv = $('<div class="share"><a href="#" title='+itemObj.api+'>fb</a>|<a href="#" class="x">tw</a></div>'),
                    $dateSpan = $('<div class="date"/>'),
                    $footDiv = $('<div class="foot"/>');
                    
                    //console.log(itemObj.img.src);

                    if (fields.indexOf('image')!=-1 && itemObj.img.src){                                   
                        $img.appendTo($imgLnk);
                        $imgLnk.appendTo($contentDiv);
                    }
                    
                    if (fields.indexOf('text')!=-1 || typeof itemObj.img.src==="undefined" ){
                         $contentDivInner.appendTo($contentDiv);
                    }
                    
                    if (fields.indexOf('text')!=-1 || fields.indexOf('image')!=-1) {
                        $contentDiv.appendTo(container);            
                    }
                
                /* TODO: implement sharing links
                    if (fields.indexOf('share')!=-1){
                        $shareDiv.appendTo(container);
                    }
                    */
                    
                    $source.appendTo($footDiv);
                    $sourceLnk.text(itemObj.heading);
                    if (fields.indexOf('source')!=-1){
                        $sourceLnk.appendTo($sourceLnkDiv);
                        $sourceLnkDiv.appendTo($source);
                        $apiSpanLnk.appendTo($apiSpan);
                        $apiSpan.appendTo($footDiv);
                        $source.appendTo($footDiv);                                                                                        
                    }
                    else {
                        $sourceLnk.appendTo($contentDivInner);
                    }
                    
                    if (fields.indexOf('date')!=-1){
                        $dateSpan.text(itemObj.date);                            
                        $dateSpan.appendTo($sourceLnkDiv);
                    }
                    
                    if (fields.indexOf('source')!=-1 || fields.indexOf('date')!=-1) {
                        $footDiv.appendTo(container);
                    }
                    
                    return container;
            },
            networkDefs: {
                rss:{url:"http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=|num|&callback=?&q=|id|",dataType:"json",parser:{
                    name: "rss",
                    resultsSelector: "data.responseData.feed.entries",
                    heading: "RSS",
                    headingSelector: "data.responseData.feed.title",
                    txtSelector: "item.title",
                    dateSelector: "item.publishedDate.substring(0,17)",
                    imgSrc: null,
                    imgSrcSelector: "$(item.content).find(\"img:lt(1)\").attr('src')",
                    imgSrcProcessor: null,
                    imgHref: "",
                    imgHrefSelector: "$(item.content).find(\"img:lt(1)\").parent().attr('href')||$(item.content).find(\"a:lt(1)\").attr('href')",
                    imgAltSelector: "item.contentSnippet",
                    link: "",
                    linkSelector: null,
                    linkTipSelector: "item.contentSnippet",
                    preProcessor: null,
                    preCondition: "$(item.content).find(\"img[src]:contains('http')\")"
                    }
                },
                facebook:{url:'http://graph.facebook.com/|id|/photos?limit=|num|',img:'',dataType:'json',parser:{
                    name: "facebook",
                    resultsSelector: "data.data",
                    heading: "Facebook",
                    headingSelector: "item.from.name",
                    txtSelector: "item.from.name",
                    dateSelector: "helpers.timeAgo(item.created_time)",
                    imgSrcSelector: "(item.images[2].source)||'/spacer.gif'",
                    imgSrcProcessor: null,
                    imgHrefSelector: "item.link",
                    imgAltSelector: "item.from.name.substring(0,12)",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                },
                youtube:{url:'https://gdata.youtube.com/feeds/api/users/|id|/uploads?alt=json&max-results=|num|',dataType:"jsonp",img:'',parser:{
                    name: "youtube",
                    resultsSelector: "data.feed.entry",
                    heading: "YouTube",
                    headingSelector: "item.title.$t",
                    txtSelector: "item.content.$t",
                    dateSelector: "helpers.timeAgo(item.updated.$t)",
                    imgSrcSelector: "item.media$group.media$thumbnail[0].url",
                    imgSrcProcessor: null,
                    imgHrefSelector: "item.link[0].href",
                    imgAltSelector: "item.title.$t",
                    preProcessor: null,
                    preCondition: "true"}
                },
                twitter:{url:'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=|id|&count=|num|',dataType:"jsonp",img:'',parser:{
                    name: "twitter",
                    resultsSelector: "data",
                    heading: "Twitter",
                    headingSelector: "item.user.screen_name",
                    txtSelector: "item.text",
                    dateSelector: "helpers.timeAgo(helpers.fixTwitterDate(item.created_at))",
                    imgSrcSelector: "(item.user.profile_image_url)||'/assets/spacer.gif'",
                    imgSrcProcessor: null,
                    imgHrefSelector: "((item.entities.urls[0]||{urls:''}).url)||'http://www.twitter.com/'+item.user.screen_name",
                    imgAltSelector: "item.user.screen_name",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                },
                linkedin:{url:'http://www.linkedin.com/company/|id|/',img:'',dataType:"text",parser:{
                    name: "linkedin",
                    resultsSelector:"$(data.responseText).find('div.feed-body:lt(|num|)')",
                    heading: "LinkedIn",
                    headingSelector: "$elem.find('a:first').text()",
                    txtSelector: "($elem.find('a:last').text())||$elem.find('p.share-desc').html()",
                    imgSrcSelector: "$elem.find('.feed-photo').attr('src')||$elem.find('.has-photo img').attr('src')",                    
                    imgSrcProcessor: null,
                    imgHrefSelector: "$elem.find('a').attr('href')",
                    imgAltSelector: "$elem.find('a').text()",
                    dateSelector: "$elem.find('span.nus-timestamp').text()",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                },
                tumblr:{url:'http://|id|.tumblr.com/api/read/json?callback=helpers.cb&num=|num|',dataType:"jsonp",parser:{
                    name: "tumblr",
                    resultsSelector: "data.posts",
                    heading: "tumblr",
                    headingSelector: "(item['photo-caption'])||data.tumblelog.title",
                    txtSelector: "(helpers.stripHtml(item['regular-body']))||(item['link-description'])||(item['regular-title'])||item['photo-caption']",
                    dateSelector: "item.date",
                    imgSrcSelector: "(item['photo-url-250'])||$(item['link-description']).find('img').attr('src')",
                    imgSrcProcessor: null,
                    imgHrefSelector: "item.url",
                    imgAltSelector: "(item['regular-title'])||item.tags.toString()",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                
                },
                flickr:{url:'http://api.flickr.com/services/rest/?extras=tags%2Cdescription%2Cdate_upload&nojsoncallback=1&api_key=|apiKey|&method=flickr.people.getPublicPhotos&format=json&per_page=|num|&user_id=|id|',dataType:'json',parser:{
                    name: "flickr",
                    resultsSelector: "data.photos.photo",
                    heading: "Flickr",
                    headingSelector: "item.title",
                    dateSelector: "new Date(item.dateupload)",
                    txtSelector: "(item.description._content)||item.tags",
                    imgSrcSelector: "'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_n.jpg'",
                    imgHrefSelector: "\"http://flickr.com/photos/\" + item.owner + \"/\" + item.id + \"\"",
                    imgAltSelector: "item.title",
                    imgSrcProcessor: null,
                    preCondition: "true"
                   }
                },
                googleplus:{url:'https://plus.google.com/|id|',dataType:'text',parser:{
                    name: "google",
                    resultsSelector:"$(data.responseText).find('div.zg:lt(|num|)')",
                    heading: "Google+",
                    headingSelector: "$elem.find('a.YF').text()",
                    txtSelector: "$elem.find('div.XF').text()",
                    imgSrcSelector: "$elem.find('a.Mn img').attr('src')",                    
                    imgSrcProcessor: null,
                    imgHrefSelector: "$elem.find('a.YF').attr('href')",
                    imgAltSelector: "($elem.find('a.Mn img').attr('alt'))||'Google'",
                    dateSelector: "$elem.parents('div.qf').find('a.Bf').text()",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                },
                pinterest:{url:'http://pinterest.com/|id|/',dataType:"text",parser:{
                    name: "pinterest",
                    resultsSelector:"$(data.responseText).find('div.pin:lt(|num|),a.PinImage:lt(|num|)')",
                    heading: "Pinterest",
                    headingSelector: "($elem.find('p.NoImage a').text())||$elem.find('.serif a').text()",
                    txtSelector: "($elem.find('img').attr('alt'))||$elem.find('.serif a').text()",
                    imgSrcSelector: "($elem.find('img.PinImageImg').attr('src'))||$elem.find('span.cover img').attr('src')",
                    imgSrcProcessor: null,
                    imgHrefSelector: "\"http://pinterest.com\"+(($elem.find('a.link').attr('href'))||$elem.find('a.PinImage').attr('href'))",
                    imgAltSelector: "($elem.find('img').attr('alt'))||'Pinterest'",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"
                    }
               },
               quora:{url:'http://www.quora.com/|id|/feed/',dataType:"text",parser:{
                    name: "quora",
                    resultsSelector:"$(data.responseText).find('div.feed_item:lt(|num|)')",
                    heading: "Quora",
                    headingSelector: "$elem.find('a.question_link').text()",
                    txtSelector: "($elem.find('div.truncated_q_text:first-child').text())",
                    imgSrcSelector: "",                    
                    imgSrcProcessor: null,
                    imgHrefSelector: "$elem.find('a').attr('href')",
                    imgAltSelector: "$elem.find('a').text()",
                    dateSelector: "$elem.find('span.timestamp').text()",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
               },
               instagram:{url:"https://api.instagram.com/v1/tags/|id|/media/recent?client_id=|apiKey|",dataType:"jsonp",parser: {
                   name: "instagram",
                   resultsSelector: "data.data",
                   heading: "Instagr.am",
                   headingSelector: "item.caption.text",
                   txtSelector: "item.caption.text",
                   imgSrcSelector: "(item.images.low_resolution.url)||'/assets/spacer.gif'",
                   imgHrefSelector: "item.link",
                   imgSrcProcessor: null,
                   imgAltSelector: "item.caption.text",
                   dateSelector: null,
                   link: "#",
                   linkSelector: null,
                   preCondition: "true",
                   locationSelector: "item.location",
                   tagsSelector: "item.tags"}
               },
               craigslist:{url:"http://|areaName|.craigslist.org/|id|",dataType:"text",parser:{
                    name: "craigslist",
                    resultsSelector:"$(data.responseText).find(\"p.row:contains('pic'):lt(|num|)\")",
                    heading: "Craigslist",
                    headingSelector: null,
                    txtSelector: "helpers.fixCase($elem.find('a,font').text())",
                    imgSrcSelector: "\"http://images.craigslist.org/\"+$elem.find('span.i').attr('data-id')",
                    imgSrcProcessor: "imgSrc.replace('/thumb/',\"\")",
                    imgHrefSelector: "$elem.find('a').attr('href')",
                    imgAltSelector: "$elem.find('span.itempp').text()",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                },
                vimeo:{url:'http://vimeo.com/api/v2/|id|/videos.json',dataType:"jsonp",parser:{
                    name: "vimeo",
                    resultsSelector: "data",
                    heading: "Vimeo",
                    headingSelector: "item.title",
                    txtSelector: "item.description",
                    dateSelector: "helpers.timeAgo(item.upload_date)",
                    imgSrcSelector: "(item.thumbnail_medium)||'/assets/spacer.gif'",
                    imgSrcProcessor: null,
                    imgHrefSelector: "'http://vimeo.com/'+item.id",
                    imgAltSelector: "item.title",
                    link: "#",
                    preProcessor: null,
                    preCondition: "true"}
                }
            },
            cb:function(jsonStr) {
                return jsonStr;
            },
            fixCase:function(string)
            {
                if (string===null)
                    return;
                
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            },
            shorten:function(string,length)
            {
                if (typeof string==="undefined" || string===null)
                    return;
            
                if (string.length > length)
                    return string.substring(0,length) + "..";
                else
                    return string;
            },
            stripHtml:function(w)
            {
                if (typeof w==="undefined" || w===null)
                    return;
            
                return w.replace(/(<([^>]+)>)|nbsp;|\s{2,}|/ig,"");

            },
            timeAgo:function(date_str){
                date_str = date_str.replace('+0000','Z');
                var time_formats = [
                    [60, 'just now', 1],
                    [120, '1 minute ago', '1 minute from now'],
                    [3600, 'minutes', 60], 
                    [7200, '1 hour ago', '1 hour from now'],
                    [86400, 'hours', 3600], 
                    [172800, 'yesterday', 'tomorrow'], 
                    [604800, 'days', 86400], 
                    [1209600, 'last week', 'next week'], 
                    [2419200, 'weeks', 604800], 
                    [4838400, 'last month', 'next month'], 
                    [29030400, 'months', 2419200], 
                    [58060800, 'last year', 'next year'], 
                    [2903040000, 'years', 29030400], 
                    [5806080000, 'last century', 'next century'], 
                    [58060800000, 'centuries', 2903040000] 
                ];
                var time = ('' + date_str).replace(/-/g,"/").replace(/[TZ]/g," ").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                if(time.substr(time.length-4,1)==".") time =time.substr(0,time.length-4);
                var seconds = (new Date - new Date(time)) / 1000;
                var token = 'ago', list_choice = 1;
                if (seconds < 0) {
                    seconds = Math.abs(seconds);
                    token = 'from now';
                    list_choice = 2;
                }
                var i = 0, format;
                while (format = time_formats[i++])
                    if (seconds < format[0]) {
                        if (typeof format[2] == 'string')
                            return format[list_choice];
                        else
                            return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
                    }
                return time;
            },                
            fixTwitterDate: function(created_at) {
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var pattern = /\s/;
                var day_of_week,day,month_pos,month,year,time;
                created_at = created_at.split(pattern);
                for (var i = 0; i < created_at.length; i++){
                    day_of_week = created_at[0];
                    day = created_at[2];
                    month_pos = created_at[1];
                    month = 0 + months.indexOf(month_pos) + 1; // add 1 because array starts from zero
                    year = created_at[5];
                    time = created_at[3];
                }
                created_at = year+'-'+month+'-'+day+'T'+time+'Z';
                
                if(created_at !== undefined)
                    return created_at;
            }
        }

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method "' +  method + '" does not exist in social plugin');
        }

    }

    $.fn.socialist.defaults = {
        networks: [{name:'linkedin',id:'iatek-llc'},{name:'facebook',id:'in1dotcom'},{name:'twitter',id:'in1dotcom'}],
        random: true,
        isotope: true,
        headingLength: 31,
        textLength: 160,
        maxResults: 7,
        autoShow: true,
        fields:['source','heading','text','date','image','followers','likes','share']
    }

    $.fn.socialist.settings = {}

})(jQuery);

/** IE **/
if (!Array.prototype.indexOf) { 
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}

// begin dependencies

/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */

jQuery.ajax = (function(_ajax){
    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';
    
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    
    return function(o) {
        
        var url = o.url;
        
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            
            // Manipulate options so that JSONP-x request is made to YQL
            
            o.url = YQL;
            o.dataType = 'json';
            
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };
            
            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            
            o.success = (function(_success){
                return function(data) {
                    
                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }
                    
                };
            })(o.success);
            
        }
        
        return _ajax.apply(this, arguments);
        
    };
    
})(jQuery.ajax);

// end dependencies