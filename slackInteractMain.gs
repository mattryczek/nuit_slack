//!!!!! NOTE !!!!!!
//Every time a *functional* change is made to this script, you need to re-deploy the web app.
//Go to Publish > Deploy as web app...
//Then change only "Project Version" to NEW every time, and hit save or whatever.
//
//IT WILL NOT WORK OTHERWISE. YOU MUST SELECT NEW!!
//
// #dev: ********

function doPost(e) {
  //Channel to post in and API stuff. Get from api.slack.com
  var slackCHANNEL = "********";
  var slackAPI = 'https://slack.com/api/conversations.replies?token=xoxp-********&channel=' + slackCHANNEL + '&ts=';

  //Get sheet and last line so we know where to write data
  var currSheet = SpreadsheetApp.getActiveSheet();
  var nextRow = currSheet.getLastRow(); 
  
  //Parse reply. It comes in as a JSON within a JSON /shrug
  var reply = JSON.parse(e.parameter.payload);
  
  //Extract some infos
  var actions = reply.actions;
  var status = actions[Object.keys(actions)[0]].value
  var user = reply.user.name;
  
  // The API sends a handy ID to get threaded replies, use this to grab the reason.
  slackAPI += reply.message_ts;
  
  //Build request for actually getting the reason (thread) from slack API.
  var options = {
   'method' : 'get',
   'contentType': 'application/json',
  };
  
  //Fetches message + other info as JSON. The try/catch block is in there because
  //even though I wrote this, i still managed to forget replying with a reason (sometimes).
  //This defaults the reason to whatever is in the catch block, otherwise
  //the app fails catastrophically.
  var reason = (JSON.parse(UrlFetchApp.fetch(slackAPI, options))).messages;
  var parsedReason;
  try{
    parsedReason = reason[Object.keys(reason)[1]].text;
  }catch(err){
    if(status == 'approved'){
      parsedReason = "Your request has been approved!";
    }else{
      parsedReason = "Please contact an LC to discuss, if needed.";
    }
    console.log(err);
  }
  
  //Great! we have the reason, put it into the sheet in the correct column (they are not zero indexed).
  //Fill in reasons and who reviewed too.
  currSheet.getRange(nextRow,11).setValue(status);
  currSheet.getRange(nextRow,12).setValue(user);
  currSheet.getRange(nextRow,13).setValue(parsedReason);
  currSheet.getRange(nextRow,14).setValue("No");
  
  //Reply to slack to let user know it was done. The default action is to overwrite
  //the original message, which isn't optimal but saves space I guess.
  var response = 'USR has been ' + status + ' by ' + user;

  reply.original_message.attachments[3] = {text: response};
  
  //JSON trickery to get it to send correctly back to slack. Shameless copy/paste.
  var JSONOutput = ContentService.createTextOutput(JSON.stringify(reply.original_message));
  JSONOutput.setMimeType(ContentService.MimeType.JSON);
  
  //The required return type for GScript Web Apps (what this is running as) is an HTML or JSON object.
  //More info on the documentation for web apps fro Google.
  return JSONOutput;
}