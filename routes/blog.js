const express = require('express');
const { ObjectId } = require('mongodb');
const db = require('../data/database');
const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/posts');
});

router.get('/posts', function (req, res) {
  res.render('posts-list');
});

router.get('/new-post', async function (req, res) {
  const authors = await db.getDb().collection('authors').find().toArray();
  res.render('create-post', { authors });
});

router.post('/posts', async (req, res) => {
  const authorId = new ObjectId(req.body.author);
  const author = await db.getDb().collection('authors').findOne({ _id: authorId });
  const postData = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    author: {
      id: authorId,
      name: author.name,
      email: author.email
    }
  };

  const result = await db.getDb().collection('posts').insertOne(postData);
  console.log(result);
  res.redirect('/posts');
})

module.exports = router;