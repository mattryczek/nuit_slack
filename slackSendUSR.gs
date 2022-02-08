function onSubmit(e) {
  //Grab this from the webhook menu in the Build section in Slack
  //#general webhook URL: https://hooks.slack.com/services/********
  //#dev webhook URL: https://hooks.slack.com/services/********
  //#unassigned webhook URL: https://hooks.slack.com/services/********
  var SLACK_WEBHOOK_POST_URL = "https://hooks.slack.com/services/********";
  
  //Loading user email requires a different command
  var email = e.response.getRespondentEmail();
  
  //Filter out email bits to get firstnamelastname
  var who = email.split("2");
  who = who[0];
  
  //Load rest of the responses into an array (check GApps API for more info, search for "getItemResponses()"
  var response =  e.response.getItemResponses();
  var shiftDate = response[0].getResponse();
  var unassign = response[1].getResponse();
  var reason = response[2].getResponse();
  var inAdvance = response[3].getResponse();
  var tradeboard = response[4].getResponse();
  var iccons = response[5].getResponse();
  var sendDate = response[6].getResponse();
  var contacts = response[7].getResponse();
  
  //Convert yes/no to emoji
  if(inAdvance == "Yes"){
    inAdvance = ":white_check_mark:";
  }else{
    inAdvance = ":no_entry:";
  }
  
  if(tradeboard == "Yes"){
    tradeboard = ":white_check_mark:";
  }else{
    tradeboard = ":no_entry:";
  }
  
  if(iccons == "Yes"){
    iccons = ":white_check_mark:";
  }else{
    iccons = ":no_entry:";
  }

    // Build payload
  var payload = '{"text": "New USR submitted!", "attachments": [ { "fields": [ { "title": "Shift Date", "value": "' + shiftDate + '", "short": true }, { "title": "Date Submitted", "value": "' + sendDate + '", "short": true }, { "title": "Unassign:", "value": "' + unassign + '", "short": true }, { "title": "24h in advance?", "value": "' + inAdvance + '", "short": true }, { "title": "On tradeboard?", "value": "' + tradeboard + '", "short": true }, { "title": "ICCONS email?", "value": "' + iccons + '", "short": true } ], "author_name": "' + who + '" }, { "title": "Reason", "text": "' + reason + '" }, { "title": "Contacts", "text": "' + contacts + '" }, { "fallback": "Verdict:", "title": "Verdict:", "callback_id": "some_id", "attachment_type": "default", "actions": [ { "name": "Approve", "text": "Approve", "type": "button", "style": "primary", "value": "approved", "confirm": { "title": "Are you sure?", "text": "Approve the request?", "ok_text": "Approve", "dismiss_text": "Cancel" } }, { "name": "Deny", "text": "Deny", "type": "button", "style": "danger", "value": "denied", "confirm": { "title": "Are you sure?", "text": "Deny the request?", "ok_text": "Deny", "dismiss_text": "Cancel" } } ] } ] }';
  
    // Build request
    var options = {
     method : "post",
     payload : payload,
     muteHttpExceptions: true
    };

    // Send to Slack
    UrlFetchApp.fetch(SLACK_WEBHOOK_POST_URL, options);
 }