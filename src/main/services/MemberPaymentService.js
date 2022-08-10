const db = require("../db/models/index");
const { sequelize } = require("../db/models/index");
const moment = require("moment");
const { Op } = require("sequelize");

exports.createMemberPayment = async (data) => {
  return db.MemberPayment.create(data);
};

exports.updateMemberPayment = async (data, root) => {
  return db.MemberPayment.update(data, root);
};

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.getPagingData = (data, page, limit) => {
  const { count: totalPayments, rows: payments } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalPayments / limit);

  return { totalPayments, payments, totalPages, currentPage };
};

exports.getMemberPayments = async () => {
  return db.MemberPayment.findAndCountAll({
    include: db.MemberRegistration,
  });
};

exports.getSearchedPayments = async (memberId, fromTime, toTime) => {
  return db.MemberPayment.findAll({
    where: {
      memberId: +memberId,
      from: {
        [Op.gte]: fromTime,
      },
      to: {
        [Op.lte]: toTime,
      },
    },
    include: db.MemberRegistration,
  });
};

exports.getFilteredPayments = async (fromTime, toTime) => {
  return db.MemberPayment.findAndCountAll({
    where: {
      from: {
        [Op.gte]: fromTime,
      },
      to: {
        [Op.lte]: toTime,
      },
    },
    include: db.MemberRegistration,
  });
};

exports.getFilteredTotalPayments = async (fromTime, toTime) => {
  const totalPayments = await db.MemberPayment.findAndCountAll({
    where: {
      from: {
        [Op.gte]: fromTime,
      },
      to: {
        [Op.lte]: toTime,
      },
    },
    attributes: [
      "memberId",
      [sequelize.fn("sum", sequelize.col("amount")), "total_amount"],
    ],
    group: ["memberId"],
    include: db.MemberRegistration,
  });

  const totalAmount = await db.MemberPayment.findAll({
    where: {
      from: {
        [Op.gte]: fromTime,
      },
      to: {
        [Op.lte]: toTime,
      },
    },
    attributes: [
      [
        sequelize.fn("sum", sequelize.col("MemberPayment.amount")),
        "total_amount",
      ],
    ],
  });

  const totalMembers = await db.MemberPayment.findAll({
    where: {
      from: {
        [Op.gte]: fromTime,
      },
      to: {
        [Op.lte]: toTime,
      },
    },
    attributes: [
      [
        sequelize.fn("count", sequelize.col("MemberPayment.memberId")),
        "total_members",
      ],
    ],
  });

  return { totalPayments, totalAmount, totalMembers };
};

exports.getTotalMemberPayments = async () => {
  try {
    const totalPayments = await db.MemberPayment.findAll({
      attributes: [
        "memberId",
        [sequelize.fn("sum", sequelize.col("amount")), "total_amount"],
      ],
      group: ["memberId"],
      include: [db.MemberRegistration],
    });
    return totalPayments;
  } catch (e) {
    throw e;
  }
};

exports.deleteMemberPayment = async (data) => {
  return db.MemberPayment.destroy(data);
};

exports.totalAmount = async () => {
  try {
    const totalAmount = await db.MemberPayment.findAll({
      attributes: [
        [sequelize.fn("sum", sequelize.col("amount")), "total_amount"],
      ],
    });
    return totalAmount;
  } catch (e) {
    throw e;
  }
};
