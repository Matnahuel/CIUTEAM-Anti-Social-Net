
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Reaction extends Model {}

  Reaction.init({
    type: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Reaction',
    timestamps: true
  });

  return Reaction;
};
