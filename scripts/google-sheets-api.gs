/**
 * MASS Garage - Google Sheets API Backend
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Extensions > Apps Script in your Google Sheet
 * 2. Paste this entire code
 * 3. Click Deploy > New Deployment > Web App
 * 4. Set "Execute as: Me" and "Who has access: Anyone"
 * 5. Copy the Web App URL - this is your API endpoint
 */

// Your MASS Garage Database Sheet ID
const SHEET_ID = '1zt3LDXgVBOoMU4TNKT2h-0DfOzWMhMYybqTxpSXwCr8';

/**
 * Handle GET requests (Read data)
 */
function doGet(e) {
  const sheet = e.parameter.sheet || 'Vehicles';
  const id = e.parameter.id;
  
  try {
    const data = getSheetData(sheet);
    
    if (id) {
      const record = data.find(row => row.id === id);
      return jsonResponse(record || { error: 'Not found' });
    }
    
    return jsonResponse(data);
  } catch (error) {
    return jsonResponse({ error: error.message });
  }
}

/**
 * Handle POST requests (Create/Update/Delete)
 */
function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const action = payload.action || 'create';
  const sheet = payload.sheet || 'Vehicles';
  const data = payload.data;
  
  try {
    switch (action) {
      case 'create':
        return jsonResponse(createRecord(sheet, data));
      case 'update':
        return jsonResponse(updateRecord(sheet, data));
      case 'delete':
        return jsonResponse(deleteRecord(sheet, data.id));
      default:
        return jsonResponse({ error: 'Unknown action' });
    }
  } catch (error) {
    return jsonResponse({ error: error.message });
  }
}

/**
 * Get all data from a sheet as JSON array
 */
function getSheetData(sheetName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Create a new record
 */
function createRecord(sheetName, data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Generate ID if not provided
  if (!data.id) {
    data.id = Utilities.getUuid();
  }
  
  // Add timestamp
  data.created_at = new Date().toISOString();
  
  const row = headers.map(header => data[header] || '');
  sheet.appendRow(row);
  
  return { success: true, id: data.id };
}

/**
 * Update an existing record
 */
function updateRecord(sheetName, data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idIndex] === data.id) {
      headers.forEach((header, colIndex) => {
        if (data[header] !== undefined) {
          sheet.getRange(i + 1, colIndex + 1).setValue(data[header]);
        }
      });
      return { success: true, id: data.id };
    }
  }
  
  return { error: 'Record not found' };
}

/**
 * Delete a record
 */
function deleteRecord(sheetName, id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idIndex] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  
  return { error: 'Record not found' };
}

/**
 * Helper to return JSON response
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initial setup - Run this once to create headers
 */
function setupSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // Vehicles headers
  const vehiclesSheet = ss.getSheetByName('Vehicles') || ss.insertSheet('Vehicles');
  vehiclesSheet.getRange(1, 1, 1, 9).setValues([[
    'id', 'make', 'model', 'year', 'vin', 'license_plate', 'color', 'mileage', 'created_at'
  ]]);
  
  // Customers headers
  const customersSheet = ss.getSheetByName('Customers') || ss.insertSheet('Customers');
  customersSheet.getRange(1, 1, 1, 8).setValues([[
    'id', 'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'created_at'
  ]]);
  
  // WorkOrders headers
  const workOrdersSheet = ss.getSheetByName('WorkOrders') || ss.insertSheet('WorkOrders');
  workOrdersSheet.getRange(1, 1, 1, 9).setValues([[
    'id', 'vehicle_id', 'customer_id', 'status', 'description', 'technician', 'cost', 'started_at', 'completed_at'
  ]]);
  
  Logger.log('Sheets setup complete!');
}
