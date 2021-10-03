'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TrainingSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      TrainingSession.belongsTo(models.ServiceType, {
        foreignKey: {
          name: 'serviceId',
          allowNull: false
        }
      })
      TrainingSession.belongsTo(models.Room, {
        foreignKey: {
          name: 'roomId',
          allowNull: false
        }
      })
      TrainingSession.belongsTo(models.TrainerProfile, {
        foreignKey: {
          name: 'trainerId',
          allowNull: false
        }
      })
      TrainingSession.hasMany(models.MemberBooking, {
        onDelete: 'cascade',
        foreignKey: {
          name: 'sessionId',
          allowNull: false
        }
      })
    }
  }
  TrainingSession.init(
    {
      serviceId: DataTypes.INTEGER,
      maxMembers: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      membersSoFar: DataTypes.INTEGER,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      roomId: DataTypes.INTEGER,
      trainerId: DataTypes.INTEGER,
      state: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'TrainingSession'
    }
  )
  return TrainingSession
}
