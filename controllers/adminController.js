// controllers/adminController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User.js");
const Produce = require("../models/Produce.js");
const Purchase = require("../models/Purchase.js");
const AiLog = require("../models/AiLog.js");
const mongoose = require("mongoose");

/**
 * GET /api/admin/overview
 * returns an object:
 * { farmers, foodbanks, users, produceCount, totalSales, aiQueries }
 */
const getOverview = asyncHandler(async (req, res) => {
  try {
    const farmers = await User.countDocuments({ role: "farmer" });
    const foodbanks = await User.countDocuments({ role: "foodbank" });
    const users = await User.countDocuments({});
    const produceCount = await Produce.countDocuments({});
    // total sales sum
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
 * returns array of farmers with basic stats
 */
const getFarmers = asyncHandler(async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" })
      .sort({ createdAt: -1 })
      .lean();
    // attach produce count per farmer
    const farmerIds = farmers.map((f) => f._id);
    const counts = await Produce.aggregate([
      {
        $match: {
          farmerId: { $in: farmerIds.map((id) => mongoose.Types.ObjectId(id)) },
        },
      },
      { $group: { _id: "$farmerId", count: { $sum: 1 } } },
    ]);

    const countMap = counts.reduce((acc, cur) => {
      acc[String(cur._id)] = cur.count;
      return acc;
    }, {});

    const result = farmers.map((f) => ({
      _id: f._id,
      firstName: f.firstName,
      lastName: f.lastName,
      email: f.email,
      createdAt: f.createdAt,
      totalProduce: countMap[String(f._id)] ?? 0,
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
    // attach purchase counts
    const fbIds = foodbanks.map((f) => f._id);
    const purchases = await Purchase.aggregate([
      {
        $match: {
          buyerId: { $in: fbIds.map((id) => mongoose.Types.ObjectId(id)) },
          status: "PAID",
        },
      },
      {
        $group: {
          _id: "$buyerId",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const purchaseMap = purchases.reduce((acc, cur) => {
      acc[String(cur._id)] = { count: cur.count, total: cur.total };
      return acc;
    }, {});

    const result = foodbanks.map((f) => ({
      _id: f._id,
      name: `${f.firstName ?? ""} ${f.lastName ?? ""}`.trim() || f.email,
      email: f.email,
      createdAt: f.createdAt,
      purchasesCount: purchaseMap[String(f._id)]?.count ?? 0,
      purchasesTotal: purchaseMap[String(f._id)]?.total ?? 0,
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
      _id: u._id,
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
 * returns monthly aggregates (last 6 months)
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

    // Monthly users (createdAt)
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

    // Monthly produce uploads
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

    // Monthly sales
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

    // AI queries count
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
 * returns ai logs (latest) and aggregated counts by user
 */
const getAiUsage = asyncHandler(async (req, res) => {
  try {
    const logs = await AiLog.find().sort({ createdAt: -1 }).limit(200).lean();

    // aggregated counts per user
    const agg = await AiLog.aggregate([
      {
        $group: {
          _id: "$userId",
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
 * returns all purchases and total
 */
const getSales = asyncHandler(async (req, res) => {
  try {
    const sales = await Purchase.find({ status: "PAID" })
      .sort({ createdAt: -1 })
      .populate("produceId buyerId farmerId")
      .lean();

    const totalRevenue = sales.reduce((acc, s) => acc + (s.amount || 0), 0);

    // normalize output for frontend
    const normalized = sales.map((s) => ({
      _id: s._id,
      buyerId: s.buyerId?._id,
      buyerEmail: s.buyerEmail ?? s.buyerId?.email,
      farmerId: s.farmerId?._id,
      farmerEmail: s.farmerId?.email ?? s.farmerId?.email,
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
