//////////////////////////// emailDelegate ////////////////////////////

function emailDelegate(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  while(sheet.getRange(lastRow, 14).getValue() == "No"){
    sendUpdate(lastRow, sheet);
    lastRow--;
  }
}

//////////////////////////// END emailDelegate ////////////////////////////
//////////////////////////// sendUpdate ////////////////////////////

function sendUpdate(row, sheet) {
  //Build email
  var email = getEmail(sheet, row);
  var subject = getSubject(sheet, row);
  var body = getBody(sheet, row);
  
  //Ship it!!!
  MailApp.sendEmail(email, subject, body);
  
  //Postprocessing
  sheet.getRange(row, 14).setValue("Yes");
  return;
}

//////////////////////////// END sendUpdate ////////////////////////////
//////////////////////////// HELPER FUNCTIONS ////////////////////////////

function getEmail(sheet, row) {
  return sheet.getRange(row, 2).getValue();
}

function getSubject(sheet, row) {
  if(sheet.getRange(row, 11).getValue() == "approved") {
    var subject = "Unassigned Shift Request Approved";
  }
  else if(sheet.getRange(row, 11).getValue() == "denied") {
    var subject = "Unassigned Shift Request Denied";
  }
  return subject;
}

function getBody(sheet, row) {
  var body = "";
  
  if(sheet.getRange(row, 11).getValue() == "approved"){
    body += "Your request to have a shift unassigned has been APPROVED. You are excused from working the shift on:";
    body += "\n\n\t" + sheet.getRange(row, 3).getValue();
    body += ", from " + sheet.getRange(row, 4).getValue();
    body += "\n\n\tNotes: " + sheet.getRange(row, 13).getValue();
  }else{
    body += "Your request to have a shift unassigned has been DENIED. You will be expected to appear at the following shift:";
    body += "\n\n\t" + sheet.getRange(row, 3).getValue();
    body += ", from " + sheet.getRange(row, 4).getValue();
    body += "\n\n\tNotes: " + sheet.getRange(row, 13).getValue();
  }
  
  body += "\n\nRegards,\n\nNorthwestern IT Lead Consultant Team";
  
  return body;
}

//////////////////////////// END HELPER FUNCTIONS ////////////////////////////