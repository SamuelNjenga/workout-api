'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TrainerProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      TrainerProfile.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false
        }
      })
      TrainerProfile.hasMany(models.TrainingSession, {
        onDelete: 'cascade',
        foreignKey: {
          name: 'trainerId',
          allowNull: false
        }
      })
    }
  }
  TrainerProfile.init(
    {
      userId: DataTypes.INTEGER,
      specialization: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'TrainerProfile'
    }
  )
  return TrainerProfile
}
