const db = require('../db/models/index')
const { sequelize } = require('../db/models/index')

exports.createMemberBooking = async data => {
  return db.MemberBooking.create(data)
}

exports.updateMemberBooking = async (data, root) => {
  return db.MemberBooking.update(data, root)
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 4
  const offset = page ? page * limit : 0

  return { limit, offset }
}

exports.getPagingData = (data, page, limit) => {
  const { count: totalMemberBookings, rows: bookings } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalMemberBookings / limit)

  return { totalMemberBookings, bookings, totalPages, currentPage }
}

exports.getMemberBookings = async () => {
  return db.MemberBooking.findAndCountAll()
}

exports.getAllMemberBookings = async memberId => {
  return db.MemberBooking.findAll({
    where: {
      memberId: memberId
    }
  })
}

exports.deleteMemberBooking = async data => {
  return db.MemberBooking.destroy(data)
}

exports.getBookingHistory = async memberId => {
  return db.MemberBooking.findAndCountAll({
    where: {
      memberId: memberId
    },
    order: [['updatedAt', 'DESC']]
  })
}

// exports.cancelBooking = async bookingId => {
//   const transaction = await sequelize.transaction()
//   try {
//     // check if session in available
//     const session = await db.MemberBooking.findOne({
//       where: {
//         id: bookingId
//       },
//       include: [{ model: db.TrainingSession }],
//       transaction
//     })
//     if (!session) {
//       throw new Error('This session does not exist')
//     }
//     // if (session.TrainingSession.startTime < new Date()) {
//     //   throw new Error('This session has already elapsed.')
//     // }
//     await session.update(
//       {
//         status: 'CANCELLED'
//       },
//       { transaction }
//     )

//     await transaction.commit()
//     //return this.getSession(userId)
//   } catch (e) {
//     transaction.rollback()
//     throw e
//   }
// }
