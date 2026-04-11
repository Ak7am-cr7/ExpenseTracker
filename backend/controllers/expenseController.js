const xlsx = require('xlsx');
const Expense = require("../models/Expense");

// Add Expense Source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // Validatin: Check for missing fields
    if (!category || !amount || !date) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense ({
        userId,
        icon,
        category,
        amount,
        date: new Date(date)
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

// Get All Expense Source
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

 try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
 } catch (error) {
   res.status(500).json({ message: "Server Error "});
 }
};

//Delete Expense Source
exports.deleteExpense = async (req, res) => {
 try {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Expense deleted successfully"});
 } catch (error) {
  res.status(500).json({ message: "Server Error" });
 }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
 try {
  const expense = await Expense.find({ userId }).sort({ date: -1 });

  // Prepare date for excel
  const data = expense.map((item) => ({
    category: item.category,
    Amount: item.amount,
    Date: new Date(item.date).toLocaleDateString(),
  }));

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, ws, "Expenses");
  
  // 1. Generate a Buffer instead of writing a file to the server disk
    const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

  // 2. Set headers so the browser knows it is an Excel file
    res.setHeader('Content-Disposition', 'attachment; filename="expense_details.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
    // 3. Send the buffer
    return res.status(200).send(buf);
  
 } catch (error) {
  console.error("Download Error:", error);
  res.json(500).json({ message: "Server Error" });
 }
}; 