'use strict';

var express = require('express');
var controller = require('./judgment.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/details', controller.show);

router.get('/pageCount', controller.pageCount);
router.get('/pages', controller.pages);
router.get('/ratios', controller.ratios);

router.get('/casesReliedOn', controller.casesReliedOn);
router.get('/originatingCases', controller.originatingCases);

router.get('/statutes', controller.statutes);

router.get('/publicationsReliedOn', controller.publicationsReliedOn);
router.get('/originatingPublications', controller.originatingPublications);

router.get('/bookmarks', controller.listBookmarks);
router.post('/bookmarks', controller.newBookmark);
router.delete('/bookmarks/:id', controller.deleteBookmark);

module.exports = router;