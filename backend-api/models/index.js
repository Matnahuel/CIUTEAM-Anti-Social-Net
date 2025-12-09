const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const User = require('./user')(sequelize);
const Post = require('./post')(sequelize);
const Comment = require('./comment')(sequelize);
const Tag = require('./tag')(sequelize);
const PostTag = require('./postTag')(sequelize);
const PostImage = require('./postImage')(sequelize);
const Reaction = require('./reaction')(sequelize);

User.hasMany(Post);
Post.belongsTo(User);

Post.hasMany(Comment);
Comment.belongsTo(Post);
Comment.belongsTo(User);

User.hasMany(Reaction);
Reaction.belongsTo(User);

Post.hasMany(Reaction);
Reaction.belongsTo(Post);

Post.belongsToMany(Tag, { through: PostTag });
Tag.belongsToMany(Post, { through: PostTag });

Post.hasMany(PostImage);
PostImage.belongsTo(Post);

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Tag,
  PostTag,
  PostImage,
  Reaction
};