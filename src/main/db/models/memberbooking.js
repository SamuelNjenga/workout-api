'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class MemberBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      MemberBooking.belongsTo(models.TrainingSession, {
        foreignKey: {
          name: 'sessionId',
          allowNull: false
        }
      })
      MemberBooking.belongsTo(models.MemberRegistration, {
        foreignKey: {
          name: 'memberId',
          allowNull: false
        }
      })
    }
  }
  MemberBooking.init(
    {
      sessionId: DataTypes.INTEGER,
      memberId: DataTypes.INTEGER,
      status: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'MemberBooking'
    }
  )
  return MemberBooking
}
