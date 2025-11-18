// controllers/adminController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User.js");
const Produce = require("../models/Produce.js");
const Purchase = require("../models/Purchase.js");
const AiLog = require("../models/AiLog.js");

/**
 * GET /api/admin/overview
 */
const getOverview = asyncHandler(async (req, res) => {
  try {
    const farmers = await User.countDocuments({ role: "farmer" });
    const foodbanks = await User.countDocuments({ role: "foodbank" });
    const users = await User.countDocuments({});
    const produceCount = await Produce.countDocuments({});

    const salesAgg = await Purchase.aggregate([
      { $match: { status: "PAID" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          totalQty: { $sum: "$quantity" },
        },
      },
    ]);

    const totalSales = salesAgg[0]?.total ?? 0;
    const aiQueries = await AiLog.countDocuments({});

    res.status(200).json({
      farmers,
      foodbanks,
      users,
      produceCount,
      totalSales,
      aiQueries,
    });
  } catch (err) {
    console.error("Error fetching overview", err.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching overview" });
  }
});

/**
 * GET /api/admin/farmers
 */
const getFarmers = asyncHandler(async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" })
      .sort({ createdAt: -1 })
      .lean();

    const clerkIds = farmers.map((f) => f.clerkUserId);

    const counts = await Produce.aggregate([
      { $match: { farmerClerkId: { $in: clerkIds } } },
      {
        $group: {
          _id: "$farmerClerkId",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = counts.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    const result = farmers.map((f) => ({
      clerkUserId: f.clerkUserId,
      firstName: f.firstName,
      lastName: f.lastName,
      email: f.email,
      createdAt: f.createdAt,
      totalProduce: countMap[f.clerkUserId] ?? 0,
      publicMetadata: f.publicMetadata ?? {},
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching farmers", err.message);
    res.status(500).json({ success: false, message: "Error fetching farmers" });
  }
});

/**
 * GET /api/admin/foodbanks
 */
const getFoodbanks = asyncHandler(async (req, res) => {
  try {
    const foodbanks = await User.find({ role: "foodbank" })
      .sort({ createdAt: -1 })
      .lean();

    const clerkIds = foodbanks.map((f) => f.clerkUserId);

    const purchases = await Purchase.aggregate([
      {
        $match: {
          buyerClerkId: { $in: clerkIds },
          status: "PAID",
        },
      },
      {
        $group: {
          _id: "$buyerClerkId",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const purchaseMap = purchases.reduce((acc, cur) => {
      acc[cur._id] = { count: cur.count, total: cur.total };
      return acc;
    }, {});

    const result = foodbanks.map((f) => ({
      clerkUserId: f.clerkUserId,
      name: `${f.firstName ?? ""} ${f.lastName ?? ""}`.trim() || f.email,
      email: f.email,
      createdAt: f.createdAt,
      purchasesCount: purchaseMap[f.clerkUserId]?.count ?? 0,
      purchasesTotal: purchaseMap[f.clerkUserId]?.total ?? 0,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching foodbanks", err.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching foodbanks" });
  }
});

/**
 * GET /api/admin/produce
 */
const getProduce = asyncHandler(async (req, res) => {
  try {
    const produce = await Produce.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, produce });
  } catch (err) {
    console.error("Error fetching produce", err.message);
    res.status(500).json({ success: false, message: "Error fetching produce" });
  }
});

/**
 * GET /api/admin/users
 */
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    const normalized = users.map((u) => ({
      clerkUserId: u.clerkUserId,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      subscribed: (u.publicMetadata && u.publicMetadata.subscribed) || false,
      createdAt: u.createdAt,
    }));

    res.status(200).json({ success: true, users: normalized });
  } catch (err) {
    console.error("Error fetching users", err.message);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

/**
 * GET /api/admin/analytics
 */
const getAnalytics = asyncHandler(async (req, res) => {
  try {
    const monthsBack = parseInt(req.query.months || 6, 10);
    const now = new Date();

    const start = new Date(
      now.getFullYear(),
      now.getMonth() - monthsBack + 1,
      1
    );

    const monthlyUsers = await User.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyUploads = await Produce.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlySales = await Purchase.aggregate([
      { $match: { createdAt: { $gte: start }, status: "PAID" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const aiQueries = await AiLog.countDocuments({
      createdAt: { $gte: start },
    });

    res.status(200).json({
      success: true,
      monthlyUsers,
      monthlyUploads,
      monthlySales,
      aiQueries,
    });
  } catch (err) {
    console.error("Error fetching analytics", err.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching analytics" });
  }
});

/**
 * GET /api/admin/ai-usage
 */
const getAiUsage = asyncHandler(async (req, res) => {
  try {
    const logs = await AiLog.find().sort({ createdAt: -1 }).limit(200).lean();

    const agg = await AiLog.aggregate([
      {
        $group: {
          _id: "$userClerkId",
          count: { $sum: 1 },
          role: { $first: "$role" },
          email: { $first: "$userEmail" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 200 },
    ]);

    res.status(200).json({ success: true, logs, usage: agg });
  } catch (err) {
    console.error("Error fetching AI usage", err.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching AI usage" });
  }
});

/**
 * GET /api/admin/sales
 */
const getSales = asyncHandler(async (req, res) => {
  try {
    const sales = await Purchase.find({ status: "PAID" })
      .sort({ createdAt: -1 })
      .populate("produceId")
      .lean();

    const totalRevenue = sales.reduce((acc, s) => acc + (s.amount || 0), 0);

    const normalized = sales.map((s) => ({
      _id: s._id,
      buyerClerkId: s.buyerClerkId,
      buyerEmail: s.buyerEmail,
      farmerClerkId: s.farmerClerkId,
      produceId: s.produceId?._id,
      itemName: s.produceId?.name ?? s.produceId?.type,
      quantity: s.quantity,
      amount: s.amount,
      createdAt: s.createdAt,
    }));

    res.status(200).json({ success: true, sales: normalized, totalRevenue });
  } catch (err) {
    console.error("Error fetching sales", err.message);
    res.status(500).json({ success: false, message: "Error fetching sales" });
  }
});

module.exports = {
  getOverview,
  getFarmers,
  getFoodbanks,
  getProduce,
  getUsers,
  getAnalytics,
  getAiUsage,
  getSales,
};
