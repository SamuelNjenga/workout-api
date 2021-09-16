'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Room.hasMany(models.TrainingSession, {
        onDelete: 'cascade',
        foreignKey: {
          name: 'roomId',
          allowNull: false
        }
      })
    }
  }
  Room.init(
    {
      label: DataTypes.STRING,
      size: DataTypes.FLOAT,
      available: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Room'
    }
  )
  return Room
}
