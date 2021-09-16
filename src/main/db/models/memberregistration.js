'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class MemberRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      MemberRegistration.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false
        }
      })
      MemberRegistration.hasMany(models.MemberBooking, {
        onDelete: 'cascade',
        foreignKey: {
          name: 'memberId',
          allowNull: false
        }
      })
    }
  }
  MemberRegistration.init(
    {
      userId: DataTypes.INTEGER,
      daysRemaining: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'MemberRegistration'
    }
  )
  return MemberRegistration
}
