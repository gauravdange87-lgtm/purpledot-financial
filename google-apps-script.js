// Paste this into Google Apps Script (Extensions → Apps Script)
// Then: Deploy → New Deployment → Web App → Execute as: Me → Who has access: Anyone → Deploy
// Copy the Web App URL and paste it into src/lib/submitLead.js

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()

    // Use a different sheet tab per form type
    const sheetName = data.form === 'calculator' ? 'Calculator Leads' : 'Contact Leads'
    let sheet = ss.getSheetByName(sheetName)

    if (!sheet) {
      sheet = ss.insertSheet(sheetName)
      // Write headers on first use
      const headers = data.form === 'calculator'
        ? ['Timestamp', 'Name', 'Email', 'Phone', 'Property Type', 'Loan Balance', 'Current Rate', 'New Rate %', 'Monthly Savings']
        : ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Service', 'Property Type', 'Message']
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')
    }

    const ts = new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })

    if (data.form === 'calculator') {
      sheet.appendRow([ts, data.name, data.email, data.phone || '', data.propertyType, data.loanBalance, data.currentRate, data.newRate, data.monthlySavings])
    } else {
      sheet.appendRow([ts, data.firstName, data.lastName, data.email, data.phone || '', data.service || '', data.propertyType || '', data.message || ''])
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet() {
  return ContentService.createTextOutput('PurpleDot Financial Lead API is running.')
}
