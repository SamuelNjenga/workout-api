'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class MemberPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      MemberPayment.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false
        }
      })
    }
  }
  MemberPayment.init(
    {
      userId: DataTypes.INTEGER,
      amount: DataTypes.FLOAT,
      from: DataTypes.DATE,
      to: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'MemberPayment'
    }
  )
  return MemberPayment
}
