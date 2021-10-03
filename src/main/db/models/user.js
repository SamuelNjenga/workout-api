'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.belongsTo(models.Role, {
        foreignKey: {
          name: 'roleId',
          allowNull: false
        }
      })
      User.hasOne(models.MemberRegistration, {
        onDelete: 'cascade',
        foreignKey: {
          name: 'userId',
          allowNull: false
        }
      })
      User.hasOne(models.TrainerProfile, {
        onDelete: 'cascade',
        foreignKey: {
          name: 'userId',
          allowNull: false
        }
      })
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      password: DataTypes.STRING,
      gender: DataTypes.STRING,
      roleId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'User'
    }
  )
  return User
}
