'use strict';

var _ = require('lodash');
var Parse = require('parse').Parse;

var Judgment = Parse.Object.extend('Judgment'),
    Analysis = Parse.Object.extend('Analysis'),
    Page = Parse.Object.extend('Page'),
    MyPage = Parse.Object.extend('UserJudgmentPage'),
    Bookmark = Parse.Object.extend('JudgmentBookmark'),
    Highlight = Parse.Object.extend('JudgmentHighlight');

// Get list of judgments
exports.index = function(req, res) {
    var query = new Parse.Query(Judgment);
    query.find().then(function(judgments){
        res.json(judgments);
    });
};

exports.show = function(req, res) {
    var query = new Parse.Query(Judgment);
    query.equalTo('suitno', req.query.suitno);

    query.find().then(function(judgments) {
        if (judgments.length) {
            res.json(judgments[0]);
        } else {
            res.json({});
        }
    });
};

exports.pageCount = function(req, res) {

    var query = new Parse.Query(Page);
    query.equalTo('suitno', req.query.suitno);

    query.count().then(function(pageCount) {
        res.json(pageCount);
    });
};

exports.pages = function(req, res) {

    var query = new Parse.Query(MyPage);
    query.equalTo('suitno', req.query.suitno);

    // Find Custom Pages first
    query.find().then(function(userPages) {
        console.log("Found ", userPages.length, " User Pages");
        // Find System Pages
        var pQuery = new Parse.Query(Page);
        pQuery.equalTo('suitno', req.query.suitno);
        pQuery.ascending('pageno');

        if (userPages.length) {
            var userPageNos = _.map(userPages, function(r) { return r.get('pageno') } );

            pQuery.notContainedIn('pageno', userPageNos);
        }

        pQuery.find().then(function(pages){

            var theUnion = _.union(userPages, pages);
            // combine User and System Pages and sort the result before sending
            pages = _.map(theUnion, function(i){ return i.attributes; });
            pages = _.sortBy(pages, 'pageno');

            res.json(pages);
        });
    });
};

exports.ratios = function(req, res) {

    var query = new Parse.Query(Analysis);
    query.equalTo('suitno', req.query.suitno);

    query.find().then(function(ratios) {
        res.json(ratios);
    });
};

exports.statutes = function(req, res) {
    res.json([
        {
            "name": "COMPANIES AND ALLIED MATTERS ACT",
            "year": "2010",
            "section": "2"
        },
        {
            "name": "LAND USE ACT",
            "year": "2013",
            "section": "12"
        },
        {
            "name": "MARRIAGE ACT",
            "year": "1978",
            "section": "1"
        },
        {
            "name": "TAFAWA BALEWA UNIVERSITY ACT",
            "year": "1985",
            "section": "23"
        }
    ]);
};

exports.casesReliedOn = function(req, res) {
    res.json([
        {
            case_title: "JOHNSON V. STATE",
            suitno: "SC.23/1963",
            date: "1964-04-12",
            locus: true
        },
        {
            case_title: "BABANGIDA V. OLURANTI",
            suitno: "SC.23/1992",
            date: "1999-04-12",
            locus: false
        },
        {
            case_title: "CHARLES NOVIA V. AGBAKOBA",
            suitno: "SC.23/2003",
            date: "2015-04-12",
            locus: false
        },
        {
            case_title: "COMMISSIONER OF POLICE V. A.G. KWARA STATE",
            suitno: "SC.23/1991",
            date: "2013-04-12",
            locus: false
        }
    ]);
};

exports.originatingCases = function(req, res) {
    res.json([
        {
            case_title: "ABACHA V. STATE",
            suitno: "SC.23/1971",
            date: "2013-04-12"
        },
        {
            case_title: "BABANGIDA V. OLURANTI",
            suitno: "SC.23/1992",
            date: "1999-04-12"
        },
        {
            case_title: "CHARLES NOVIA V. PMANN",
            suitno: "SC.23/2003",
            date: "2015-04-12"
        },
        {
            case_title: "NNPC V. A.G. KWARA STATE",
            suitno: "SC.23/1991",
            date: "2013-04-12"
        }
    ]);
};

exports.publicationsReliedOn = function(req, res) {
    res.json([
        {
            "name": "Reviewing the Establishment of Higher Institutions of Learning",
            "id": 51
        },
        {
            "name": "Collection of Evidence - A full review",
            "id": 42
        }
    ]);
};

exports.originatingPublications = function(req, res) {
    res.json([
        {
            "name": "Higher Institutions of Learning and their Influence on Society",
            "id": 45
        },
        {
            "name": "Collection of Evidence - A full review. 2nd Edition",
            "id": 4
        },
        {
            "name": "Yet another yet another journal",
            "id": 450
        },
        {
            "name": "Just Another Textbook",
            "id": 37
        }
    ]);
};

exports.listBookmarks = function(req, res) {
    var query = new Parse.Query(Bookmark);

    query.equalTo('suitno', req.query.suitno);
    query.ascending('pageno');

    query.find().then(function(bookmarks){
        res.json(bookmarks);
    });
};

exports.newBookmark = function(req, res) {
    var bookmark = new Bookmark();
    bookmark.save(_.pick(req.body, ['suitno','pageno'])).then(function(){
       res.json(bookmark);
    }, function(err){
        res.status(500).json(err);
    });
};

exports.deleteBookmark = function(req, res) {
    var bookmark = new Bookmark();
    bookmark.id = req.params.id;

    bookmark.destroy().then(function(){
        res.status(204);
    }, function(error){
        res.status(500).json(error);
    });
};

exports.createHighlight = function(req, res) {
    // Create the Highlight
    function createHighlight(pageObject) {
        var highlight = new Highlight();
        highlight.set('page', pageObject);
        highlight.set('comment', req.body.comment);

        highlight.save().then(function(){
            res.json(highlight);
        });
    }

    // Create a User Copy of the Judgment Page
    // Check if Page Has been Highlighted Before
    var cQuery = new Parse.Query(MyPage);
    cQuery.equalTo('suitno', req.body.suitno);
    cQuery.equalTo('pageno', req.body.pageno);

    cQuery.find().then(function(myPages){
       if (myPages.length===1) {
           // Do an Update
           var myPage = myPages[0];
           myPage.set('content', req.body.content);
           myPage.save().then(function(){
                // Create The Highlight Here
               return createHighlight(myPage);
           });
       } else {
           // Create a new User Page
           var newPage = new MyPage();
           newPage.set('content', req.body.content);
           newPage.set('suitno', req.body.suitno);
           newPage.set('pageno', req.body.pageno);

           newPage.save().then(function(){
               return createHighlight(newPage);
           });
       }
    });
};

exports.deleteHighlight = function(req, res) {

    var highlightQuery = new Parse.Query(Highlight);
    highlightQuery.get(req.params.id).then(function(highlight){

        // Find the Page it Belongs to so the page can be updated
        var query = new Parse.Query(MyPage);
        var page = highlight.get('page');

        query.get(page.id).then(function(thePage){

            // Update the Page Content
            thePage.set('content', req.body.content);

            thePage.save().then(function() {
                // Check How many Highlights rely on this page. If there are none, delete the Page
                highlightQuery.equalTo('page', page);

                highlightQuery.count().then(function(relyingHighlights){
                    if (relyingHighlights < 2) {
                        // Delete the Page itself
                        thePage.destroy().then(function(){
                            highlight.destroy().then(function(){
                                res.status(204).json({});
                            });
                        })
                    } else {
                        highlight.destroy().then(function(){
                            res.status(204).json({});
                        });
                    }
                });
            });
        });
    });
};

// Search through the pages
exports.search = function(req, res) {
    res.json([3,6,12,16,23]);
};