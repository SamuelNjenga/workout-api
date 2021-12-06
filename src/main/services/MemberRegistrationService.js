const db = require('../db/models/index')
const { sequelize } = require('../db/models/index')

exports.createMemberRegistration = async data => {
  return db.MemberRegistration.create(data)
}

exports.updateMemberRegistration = async (data, root) => {
  return db.MemberRegistration.update(data, root)
}

exports.returnMember = async userId => {
  const transaction = await sequelize.transaction()
  try {
    // check if session in available
    const member = await db.MemberRegistration.findOne({
      where: { userId: userId },
      transaction
    })
    if (!member) {
      throw new Error('This member does not have an existing account')
    }
    // if (member.status !== 'Active') {
    //   throw new Error('This member does not have an active account')
    // }
    await transaction.commit()
    return member.id
  } catch (e) {
    transaction.rollback()
    throw e
  }
}

exports.activateMember = async memberId => {
  const transaction = await sequelize.transaction()
  try {
    // check if session in available
    const member = await db.MemberRegistration.findByPk(memberId, {
      transaction
    })
    if (!member) {
      throw new Error('This member does not exist')
    }
    if (member.status === 'Active') {
      throw new Error('This member is already active.')
    }
    await member.update(
      {
        status: 'Active'
      },
      { transaction }
    )
    await transaction.commit()
    //return this.getSession(userId)
  } catch (e) {
    transaction.rollback()
    throw e
  }
}

exports.diactivateMember = async memberId => {
  const transaction = await sequelize.transaction()
  try {
    // check if session in available
    const member = await db.MemberRegistration.findByPk(memberId, {
      transaction
    })
    if (!member) {
      throw new Error('This member does not exist')
    }
    if (member.status === 'Not Active') {
      throw new Error('This member is already not active.')
    }
    await member.update(
      {
        status: 'Not Active'
      },
      { transaction }
    )
    await transaction.commit()
    //return this.getSession(userId)
  } catch (e) {
    transaction.rollback()
    throw e
  }
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5
  const offset = page ? page * limit : 0

  return { limit, offset }
}

exports.getPagingData = (data, page, limit) => {
  const { count: totalMemberRegistrations, rows: registrations } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalMemberRegistrations / limit)

  return { totalMemberRegistrations, registrations, totalPages, currentPage }
}

exports.getMembers = async () => {
  return db.MemberRegistration.findAndCountAll()
}

exports.getMemberDetails = async memberId => {
  return db.MemberRegistration.findOne({
    where: {
      id: memberId
    },
    include: db.User
  })
}

exports.deleteMemberRegistration = async data => {
  return db.MemberRegistration.destroy(data)
}
