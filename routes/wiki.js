const express = require('express');
const router = express.Router();
const addPage = require('../views/addPage');
const wikiPage = require('../views/wikipage');
const { Page } = require('../models');

router.get('/', (req, res) => {
  res.send("here's the wiki page");
});

router.post('/', async (req, res, next) => {
  const page = new Page({
    title: req.body.title,
    content: req.body.content,
  });
  try {
    await page.save();
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
  console.log(page);
});

router.get('/add', (req, res) => {
  res.send(addPage());
});

router.get('/:slug', async (req, res, next) => {
  try {
    const pageData = await Page.findOne({
      where: { slug: req.params.slug },
    });
    res.send(wikiPage(pageData));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
