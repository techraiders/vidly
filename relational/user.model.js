const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: String
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
console.log(john.postCount)