const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: String,
  content: String,
  comments: [{
    types: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

const Post = mongoose.model('Post', PostSchema);
const post1 = new Post({
  title: 'post1'
});

const UserSchema = new Schema({
  name: {
    type: String,
  },
  posts: [PostSchema]
});

UserSchema.virtual('postCount').get(function () {
  return this.posts.length;
});

const User = mongoose.model('User', UserSchema);

const john = new User({
  name: 'John',
  posts: [post1]
});

console.log(john)
console.log(john.postCount) // accessing virtual property

const CommentSchema = new Schema({
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

/* Populating nested associations */
User.findOne({name: 'John'})
  .populate({
    path: 'posts',
    populate: {
      path: 'comments',
      model: 'comment', // model name
      populate: {
        path: 'user',
        model: 'User' // model name
      }
    }
  }).then(user => {
    console.log(user);
  });