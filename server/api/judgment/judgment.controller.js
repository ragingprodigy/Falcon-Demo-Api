'use strict';

var _ = require('lodash'),
    fs = require('fs');
var judgments = require('./judgment.model');

// Get list of judgments
exports.index = function(req, res) {
  res.json(judgments);
};

exports.show = function(req, res) {
    var sel = _.filter(judgments, { "suitno": req.query.suitno } );
    delete sel[0].pages;
    delete sel[0].ratios;

    res.json(sel[0]);
};

exports.pageCount = function(req, res) {

    var sel = _.filter(judgments, { "suitno": req.query.suitno } );
    res.json(sel[0].pages.length);
};

exports.pages = function(req, res) {

    var sel = _.filter(judgments, { "suitno": req.query.suitno } );
    res.json(sel[0].pages);
};

exports.ratios = function(req, res) {

    var sel = _.filter(judgments, { "suitno": req.query.suitno } );
    res.json(sel[0].ratios);
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