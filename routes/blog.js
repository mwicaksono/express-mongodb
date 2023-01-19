const express = require('express');
const { ObjectId } = require('mongodb');
const db = require('../data/database');
const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/posts');
});

router.get('/posts', async function (req, res) {
  const posts = await db.getDb().collection('posts').find().toArray();
  res.render('posts-list', { posts });
});

router.get('/new-post', async function (req, res) {
  const authors = await db.getDb().collection('authors').find().toArray();
  res.render('create-post', { authors });
});

router.get('/posts/:id', async (req, res) => {
  const postId = new ObjectId(req.params.id);
  const post = await db.getDb().collection('posts').findOne({ _id: postId })
  res.render('post-detail', { post });
})

router.get('/posts/:id/edit', async (req, res) => {
  const postId = new ObjectId(req.params.id);
  const post = await db.getDb().collection('posts').findOne({ _id: postId })
  res.render('update-post', { post });
})

router.post('/posts/:id/delete', async (req, res) => {
  const postId = new ObjectId(req.params.id);
  const result = await db.getDb().collection('posts').deleteOne({ _id: postId });
  console.log(result);
  res.redirect('/posts');
})

// router.post('/posts/:id/update', async (req, res) => {
//   const postId = new ObjectId(req.params.id);
//   const result = await db.getDb().collection('posts').updateOne({ _id: postId });
//   console.log(result);
// })

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