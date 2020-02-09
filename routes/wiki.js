const express = require('express');
const router = express.Router();
const addPage = require('../views/addPage');
const wikiPage = require('../views/wikipage');
const { Page, User } = require('../models');
const mainPage = require('../views/main');

router.get('/', async (req, res) => {
  const allPageData = await Page.findAll();
  res.send(mainPage(allPageData));
});

router.post('/', async (req, res, next) => {
  const page = new Page({
    title: req.body.title,
    content: req.body.content,
  });
  const user = await User.findOrCreate({
    where: {
      name: page.author,
    },
  });
  try {
    await page.save();
    await user.save();
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
  console.log(user);
});

router.get('/add', (req, res) => {
  res.send(addPage());
});

router.get('/:slug', async (req, res, next) => {
  try {
    const pageData = await Page.findOne({
      where: { slug: req.params.slug },
    });
    const userData = await User.findOne({
      where: { name: pageData.author },
    });
    res.send(wikiPage(pageData, userData));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
