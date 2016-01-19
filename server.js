var cheerio = require('cheerio'); //Server-side jQuery
var request = require('request'); //Simple HTTP requests
var URL = require('url-parse');

var boardToCrawl = 'MacShop';
var pageToCrawl = 'https://www.ptt.cc/bbs/Tech_Job/index.html';
var page = 'https://www.ptt.cc/bbs/' + boardToCrawl + '/index.html';

var START_URL = page;
var SEARCH_WORD = 'iphone';
var MAX_PAGES_TO_VISIT = 5;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;


pagesToVisit.push(START_URL);
crawl();

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;

  // Make the request
  //
  //console.log("Visiting page " + url);
  request(url, function(error, response, body) {
     // Check status code (200 is HTTP OK)
     //console.log("Status code: " + response.statusCode);
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     // Parse the document body
     var $ = cheerio.load(body);
     var item = $("body").html();

     $('a').each(function(i, elem){
		if($(this).text().toLowerCase().indexOf('iphone') !== -1){

	     	//console.log($(this).text());
			//console.log('contains iphone!');
			//console.log(baseUrl + $(this).attr('href'));

		}     	
     });

     var isWordFound = searchForWord($, SEARCH_WORD);
     if(isWordFound) {
       //console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
       collectInternalLinks($);
       // In this short program, our callback is just calling crawl()
       callback();
     } else {
       collectInternalLinks($);
       // In this short program, our callback is just calling crawl()
       callback();
     }
  });
}

function searchForWord($, word) {
  var bodyText = $('html > body').text().toLowerCase();
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    //console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
    	var link = $(this).attr('href');
    	if(link.toLowerCase().indexOf('bbs\/macshop\/index') !== -1 &&
    		link.toLowerCase().indexOf('index1\.html') == -1
    		){
    		pagesToVisit.push(baseUrl + $(this).attr('href'));
    	}
    });
}


// ------------------------------------


var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});




/*
request(page, function (error, response, html) {
    if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
        var item = $("body").html();
        //Do whatever you want with the result
        var bodyText = $('html > body').text();
        console.log(item);
    	console.log(bodyText);
    	console.log('------------------------------------');
    	if(searchForWord($, 'iphone')){
    		console.log('yes, there is.');
    	}
    	collectInternalLinks($);
    }
});

function searchForWord($, word) {
	var bodyText = $('html > body').text();
	bodyText = bodyText.replace(/\s+/g, ' ');//.split(' ');
	console.log(bodyText);
	console.log('type: ', typeof(bodyText));
	console.log('length: ', bodyText.length);
	bodyText = bodyText.split(' ');
	console.log('type: ', typeof(bodyText));
	console.log('length: ', bodyText.length);
	for(var i = 0; i < bodyText.length; ++i){
		console.log('>', bodyText[i], '>', bodyText[i].length, '>', typeof(bodyText[i]));

	}


	//if(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
		return true;
	//}
	//return false;
}

function collectInternalLinks($) {
	var allRelativeLinks = [];
	var allAbsoluteLinks = [];

	var relativeLinks = $("a[href^='/']");
		relativeLinks.each(function() {
		allRelativeLinks.push($(this).attr('href'));
	});

	var absoluteLinks = $("a[href^='http']");
	absoluteLinks.each(function() {
		allAbsoluteLinks.push($(this).attr('href'));
	});	

	console.log("Found " + allRelativeLinks.length + " relative links");
	console.log("Found " + allAbsoluteLinks.length + " absolute links");
}
*/
