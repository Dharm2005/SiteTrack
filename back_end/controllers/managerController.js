const { validationResult } = require('express-validator');
const Manager = require('../models/Manager')
const User = require('../models/User')
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const PDFDocument = require("pdfkit");
const Worker = require("../models/Worker");
const Advance = require("../models/Advance");
const Earn = require("../models/Earn");
const Expense = require("../models/Expense");

exports.getManagers = async (req, res, next) => {
  try {

    let query = { isDeleted: false };

    if (req.user.role === 'admin') {
      query.createdBy = req.user.userId;
    }

    else if (req.user.role === "manager") {
      const manager = await Manager.findOne({ userId: req.user.userId })
      query._id = manager?._id;
    }

    const manager = await Manager.find(query)
      .populate("userId", "username");
    
    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: "Error fetching managers", error: err.message });
  }
}

exports.getManagerById = async (req, res, next) => {
  try {
    const { managerId } = req.params;
    const manager = await Manager.findById(managerId)
    res.status(200).json(manager);
  } catch (err) {
    console.error("Error fetching manager:", err);
    res.status(500).json({ err: "Failed to fetch manager" });
  }
}

exports.postAddManager = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      if (req.file) {
        const filePath = path.join(__dirname, "../uploads/managers", req.file.filename)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(400).json({
        message: "Validation faild",
        errors: errors.array().map(err => ({
          field: err.path,
          msg: err.msg
        }))
      })
    }

    const { managerName, managerMobile, managerDob, managerGender } = req.body;
    const managerImage = req.file ? req.file.filename : null;

    const manager = new Manager({
      managerName,
      managerImage,
      managerMobile,
      managerDob,
      managerGender,
      createdBy: req.user.userId
    });

    const savedManager = await manager.save();

    const username = managerName.toLowerCase().replace(/\s+/g, "") + Math.floor(1000 + Math.random() * 9000);
    const password = username;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role: "manager",
    });

    const savedUser = await user.save();
    savedManager.userId = savedUser._id;
    await savedManager.save();

    res.status(201).json({
      message: "manager added successsfully",
      manager: savedManager
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Error creating manager", error: err.message });
  }
}

exports.deleteManager = async (req, res, next) => {
  try {
    const managerId = req.params.managerId;
    const updatedManager = await Manager.findByIdAndUpdate(
      managerId,
      { isDeleted: true },
      { new: true }
    )

    if (!updatedManager) {
      return res.status(404).json({ message: "no manager found" })
    }

    return res.json(updatedManager)

  } catch (error) {
    console.error("Error while deleteing manager", error);
  }
}

exports.updateManager = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      if (req.file) {
        const filePath = path.join(__dirname, "../uploads/managers", req.file.filename)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(400).json({
        message: "Validation faild",
        errors: errors.array().map(err => ({
          field: err.path,
          msg: err.msg
        }))
      })
    }

    const { managerId } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      const oldManager = await Manager.findById(managerId)

      if (oldManager && oldManager.managerImage) {
        const oldPath = path.join(__dirname, "../uploads/managers", oldManager.managerImage)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      updates.managerImage = req.file.filename;
    }

    const updatedManager = await Manager.findByIdAndUpdate(
      managerId,
      updates,
      { new: true }
    )

    if (!updatedManager) {
      return res.status(404).json({ message: "manager not found for update" })
    }

    res.status(201).json({
      message: "manager added successsfully",
      manager: updatedManager
    });

  } catch (error) {
    console.error("Error while updating manager");
  }
}

exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, siteId } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1️⃣ Fetch all workers for this site
    const workers = await Worker.find({ site: siteId , isDeleted : false});
    const workerIds = workers.map(w => w._id);

    // 2️⃣ Fetch all advances & earnings in range (for workers of this site)
    const advances = await Advance.find({
      date: { $gte: start, $lte: end },
      worker: { $in: workerIds },
    });

    const earnings = await Earn.find({
      date: { $gte: start, $lte: end },
      worker: { $in: workerIds }
    });

    // 3️⃣ Fetch expenses in range (filtered by siteId directly)
    const expenses = await Expense.find({
      arrivalDate: { $gte: start, $lte: end },
      siteId: siteId,
      isDeleted : false
    });

    // 4️⃣ Group expenses by type
    const groupedExpenses = expenses.reduce((acc, exp) => {
      if (!acc[exp.expenseType]) acc[exp.expenseType] = [];
      acc[exp.expenseType].push(exp);
      return acc;
    }, {});

    // 5️⃣ Create PDF
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=site-report.pdf");
    doc.pipe(res);

    // Helper function to draw table headers
    const drawTableHeader = (doc, headers, startX, y, columnWidths) => {
      let currentX = startX;
      
      // Draw header background
      doc.rect(startX, y - 5, columnWidths.reduce((a, b) => a + b, 0), 25)
         .fillAndStroke('#f0f0f0', '#000000');
      
      // Draw header text
      doc.fillColor('#000000')
         .fontSize(10)
         .font('Helvetica-Bold');
      
      headers.forEach((header, i) => {
        doc.text(header, currentX + 5, y + 5, {
          width: columnWidths[i] - 10,
          align: 'left'
        });
        currentX += columnWidths[i];
      });
      
      return y + 25;
    };

    // Helper function to draw table row
    const drawTableRow = (doc, data, startX, y, columnWidths, isLastRow = false) => {
      let currentX = startX;
      
      // Draw row background (alternating)
      const rowHeight = 20;
      
      // Draw cell borders and content
      doc.fontSize(9).font('Helvetica');
      
      data.forEach((cell, i) => {
        // Draw cell border
        doc.rect(currentX, y, columnWidths[i], rowHeight)
           .stroke('#cccccc');
        
        // Draw cell content
        doc.fillColor('#000000')
           .text(cell, currentX + 5, y + 5, {
             width: columnWidths[i] - 10,
             align: i === data.length - 1 ? 'right' : 'left', // Right align last column (amounts)
             height: rowHeight - 10
           });
        
        currentX += columnWidths[i];
      });
      
      return y + rowHeight;
    };

    // Header
    doc.fontSize(22)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text("Site Report", { align: "center" });
    
    doc.moveDown()
       .fontSize(12)
       .font('Helvetica')
       .fillColor('#000000')
       .text(`Report Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`, { align: 'center' });
    
    doc.text(`Site ID: ${siteId}`, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    
    doc.moveDown(2);

    // --- Workers Section ---
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text("Workers Summary");
    
    doc.moveDown();

    let currentY = doc.y;
    const pageWidth = doc.page.width - 80;
    let totalAdvances = 0;
    let totalEarnings = 0;

    for (const worker of workers) {
      // Check if we need a new page
      if (currentY > doc.page.height - 200) {
        doc.addPage();
        currentY = 40;
      }

      // Worker name
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#34495e')
         .text(`Worker: ${worker.workerName}`, 40, currentY);
      
      currentY += 25;

      // Worker's advances table
      const workerAdvances = advances.filter(
        a => a.worker.toString() === worker._id.toString()
      );
      
      if (workerAdvances.length > 0) {
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text("Advances:", 40, currentY);
        currentY += 20;

        // Advances table - Fixed header
        const advanceHeaders = ['Date', 'Amount (Rs)'];
        const advanceColumnWidths = [pageWidth * 0.6, pageWidth * 0.4];
        
        currentY = drawTableHeader(doc, advanceHeaders, 40, currentY, advanceColumnWidths);
        
        let workerAdvanceTotal = 0;
        workerAdvances.forEach(advance => {
          const rowData = [
            advance.date.toLocaleDateString(),
            `Rs${advance.amount.toFixed(2)}`
          ];
          currentY = drawTableRow(doc, rowData, 40, currentY, advanceColumnWidths);
          workerAdvanceTotal += advance.amount;
        });

        // Advance total row
        const totalRowData = ['Total Advances', `Rs${workerAdvanceTotal.toFixed(2)}`];
        doc.fontSize(10).font('Helvetica-Bold');
        currentY = drawTableRow(doc, totalRowData, 40, currentY, advanceColumnWidths);
        totalAdvances += workerAdvanceTotal;
        
        currentY += 10;
      } else {
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#7f8c8d')
           .text("Advances: No advances recorded", 40, currentY);
        currentY += 20;
      }

      // Worker's earnings table
      const workerEarnings = earnings.filter(
        e => e.worker.toString() === worker._id.toString()
      );
      
      if (workerEarnings.length > 0) {
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#000000')
           .text("Earnings:", 40, currentY);
        currentY += 20;

        // Earnings table - Fixed header
        const earningHeaders = ['Date', 'Amount (Rs)'];
        const earningColumnWidths = [pageWidth * 0.6, pageWidth * 0.4];
        
        currentY = drawTableHeader(doc, earningHeaders, 40, currentY, earningColumnWidths);
        
        let workerEarningTotal = 0;
        workerEarnings.forEach(earning => {
          const rowData = [
            earning.date.toLocaleDateString(),
            `Rs${earning.amount.toFixed(2)}`
          ];
          currentY = drawTableRow(doc, rowData, 40, currentY, earningColumnWidths);
          workerEarningTotal += earning.amount;
        });

        // Earning total row
        const totalRowData = ['Total Earnings', `Rs${workerEarningTotal.toFixed(2)}`];
        doc.fontSize(10).font('Helvetica-Bold');
        currentY = drawTableRow(doc, totalRowData, 40, currentY, earningColumnWidths);
        totalEarnings += workerEarningTotal;
        
        currentY += 10;
      } else {
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#7f8c8d')
           .text("Earnings: No earnings recorded", 40, currentY);
        currentY += 20;
      }

      // Worker balance
      const workerAdvanceTotal = workerAdvances.reduce((sum, a) => sum + a.amount, 0);
      const workerEarningTotal = workerEarnings.reduce((sum, e) => sum + e.amount, 0);
      const balance = workerEarningTotal - workerAdvanceTotal;
      
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .fillColor(balance >= 0 ? '#27ae60' : '#e74c3c')
         .text(`Worker Balance: Rs${balance.toFixed(2)} ${balance >= 0 ? '(Credit)' : '(Debit)'}`, 40, currentY);
      
      currentY += 30;

      // Add separator line
      doc.strokeColor('#bdc3c7')
         .lineWidth(1)
         .moveTo(40, currentY)
         .lineTo(doc.page.width - 40, currentY)
         .stroke();
      
      currentY += 20;
    }

    // Add new page for expenses
    doc.addPage();
    currentY = 40;

    // --- Expenses Section ---
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text("Expenses Summary", 40, currentY);
    
    currentY += 30;

    let grandTotal = 0;

    if (Object.keys(groupedExpenses).length > 0) {
      for (const type of Object.keys(groupedExpenses)) {
        const list = groupedExpenses[type];
        
        // Check if we need a new page
        if (currentY > doc.page.height - 150) {
          doc.addPage();
          currentY = 40;
        }

        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#34495e')
           .text(`${type}`, 40, currentY);
        
        currentY += 20;

        // Expenses table - Updated headers and column widths based on expense type
        let expenseHeaders, expenseColumnWidths;
        
        if (type === 'crushedStone') {
          // For crushed stone: Date, Supplier, Quantity/Unit, Stone Type, Cost
          expenseHeaders = ['Date', 'Supplier', 'Quantity', 'Stone Type', 'Cost (Rs)'];
          expenseColumnWidths = [pageWidth * 0.2, pageWidth * 0.25, pageWidth * 0.2, pageWidth * 0.15, pageWidth * 0.2];
        } else {
          // For other expenses: Date, Supplier, Quantity/Unit, Cost
          expenseHeaders = ['Date', 'Supplier', 'Quantity', 'Cost (Rs)'];
          expenseColumnWidths = [pageWidth * 0.25, pageWidth * 0.3, pageWidth * 0.25, pageWidth * 0.2];
        }
        
        currentY = drawTableHeader(doc, expenseHeaders, 40, currentY, expenseColumnWidths);
        
        let typeTotal = 0;
        list.forEach(exp => {
          // Format quantity and unit
          let quantityUnit = '';
          if (exp.quantity && exp.unit) {
            quantityUnit = `${exp.quantity} ${exp.unit}`;
          } else if (exp.quantity) {
            quantityUnit = exp.quantity.toString();
          }
          
          // Format supplier name
          const supplierName = exp.supplierName || '';
          
          let rowData;
          if (type === 'crushedStone') {
            // Format stone types (array to string)
            const stoneTypes = (exp.stoneType && Array.isArray(exp.stoneType)) 
              ? exp.stoneType.join(', ') 
              : '';
              
            rowData = [
              exp.arrivalDate.toLocaleDateString(),
              supplierName,
              quantityUnit,
              stoneTypes,
              `Rs${exp.totalCost.toFixed(2)}`
            ];
          } else {
            rowData = [
              exp.arrivalDate.toLocaleDateString(),
              supplierName,
              quantityUnit,
              `Rs${exp.totalCost.toFixed(2)}`
            ];
          }
          
          currentY = drawTableRow(doc, rowData, 40, currentY, expenseColumnWidths);
          typeTotal += exp.totalCost;
        });

        // Type total row
        let totalRowData;
        if (type === 'crushedStone') {
          totalRowData = ['', '', '', `Total ${type}`, `Rs${typeTotal.toFixed(2)}`];
        } else {
          totalRowData = ['', '', `Total ${type}`, `Rs${typeTotal.toFixed(2)}`];
        }
        
        doc.fontSize(10).font('Helvetica-Bold');
        currentY = drawTableRow(doc, totalRowData, 40, currentY, expenseColumnWidths);
        
        grandTotal += typeTotal;
        currentY += 20;
      }
    } else {
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#7f8c8d')
         .text("No expenses recorded for this period", 40, currentY);
      currentY += 20;
    }

    // --- Summary Section ---
    doc.addPage();
    currentY = 40;
    
    // Worker Summary box
    const workerSummaryBoxY = currentY;
    const summaryBoxHeight = 100;
    
    doc.rect(40, workerSummaryBoxY, pageWidth, summaryBoxHeight)
       .fillAndStroke('#e8f5e8', '#27ae60');
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text("Worker Summary", 50, workerSummaryBoxY + 10);
    
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#000000')
       .text(`Total Workers: ${workers.length}`, 50, workerSummaryBoxY + 35)
       .text(`Total Advances: Rs${totalAdvances.toFixed(2)}`, 50, workerSummaryBoxY + 50)
       .text(`Total Earnings: Rs${totalEarnings.toFixed(2)}`, 50, workerSummaryBoxY + 65);
    
    const netBalance = totalEarnings - totalAdvances;
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor(netBalance >= 0 ? '#27ae60' : '#e74c3c')
       .text(`Net Worker Balance: Rs${netBalance.toFixed(2)}`, 50, workerSummaryBoxY + 80);

    currentY = workerSummaryBoxY + summaryBoxHeight + 20;

    // Expense Summary box
    const expenseSummaryBoxY = currentY;
    
    doc.rect(40, expenseSummaryBoxY, pageWidth, 60)
       .fillAndStroke('#fff3e0', '#ff9800');
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text("Expense Summary", 50, expenseSummaryBoxY + 10);
    
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#000000')
       .text(`Total Expenses: Rs${grandTotal.toFixed(2)}`, 50, expenseSummaryBoxY + 35);

    doc.end();

  } catch (error) {
    console.error("Error generating report", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};