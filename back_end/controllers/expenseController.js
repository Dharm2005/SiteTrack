const Expense = require('../models/Expense');

exports.getExpensesBySite = async (req, res, next) => {
  try {
    const siteId = req.params.siteId;
    const expenses = await Expense.find({ siteId: siteId , isDeleted : false})
      .sort({createdAt: -1});

    res.status(200).json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ err: "Failed to fetch expenses" });
  }
};

exports.getFilteredExpenses = async (req, res, next) => {

  try {
    const {siteId} = req.params;
    const {from , to} = req.query;
    let expenses;
    let query = {siteId : siteId , isDeleted : false};

    if(from && to){
      query.arrivalDate = {
        $gte : new Date(from),
        $lte : new Date(to)
      }

      expenses = await Expense.find(query)
        .sort({createdAt: -1});
    }
    else{
      console.error("There is no filter applyed");
    }
    res.status(200).json(expenses)
  } catch (error) {
    console.log("error while fetching last few expenses");
    res.status(500).json({ err: "Failed to fetch few expenses" });    
  }
}


exports.postAddExpense = async (req, res, next) => {
  try {
    let { expenseType, quantity, unit, totalCost, arrivalDate, vehicleNumber,supplierName,details, siteId, stoneType} = req.body;
    const billImage = req.file ? req.file.filename : null;

    // Parse sites correctly
     if (stoneType && typeof stoneType === "string") {
      try {
        stoneType = JSON.parse(stoneType); // in case frontend sends JSON string
      } catch (err) {
        stoneType = [stoneType]; // fallback if it's just a single string
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
      supplierName,
      details,
      siteId,
      stoneType: Array.isArray(stoneType) ? stoneType : []
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense", error: error.message });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const {expenseId} = req.params;

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      {isDeleted : true},
      {new : true}
    )

    if(!updatedExpense){
      return res.status(404).json({message : "No expense found"});
    }

    return res.json(updatedExpense);

  } catch (error) {
    console.log("Error while deleting expenses");
  }
}