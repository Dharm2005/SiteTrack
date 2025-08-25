const Expense = require('../models/Expense');

exports.getExpensesBySite = async (req, res, next) => {
  try {
    const siteId = req.params.siteId;
    const expenses = await Expense.find({ sites: siteId });

    res.status(200).json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ err: "Failed to fetch expenses" });
  }
};


exports.postAddExpense = async (req, res, next) => {
  try {
    let { expenseType, quantity, unit, totalCost, arrivalDate, vehicleNumber, sites} = req.body;
    const billImage = req.file ? req.file.filename : null;

    // Parse sites correctly
    if (typeof sites === "string") {
      try {
        sites = JSON.parse(sites); // convert to array if JSON string
      } catch (err) {
        sites = [sites]; // fallback to single site string
      }
    }

    const expense = new Expense({
      expenseType,
      billImage,
      quantity,
      unit,
      totalCost,
      arrivalDate,
      vehicleNumber,
      sites: Array.isArray(sites) ? sites : [sites],
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense", error: error.message });
  }
};