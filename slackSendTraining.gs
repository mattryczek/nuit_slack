function onSubmit(e) {
  // Grab this from the webhook menu in the Build section in Slack
  // #general webhook URL: https://hooks.slack.com/services/********
  // #dev webhook URL: https://hooks.slack.com/services/********
  // #unassigned webhook URL: https://hooks.slack.com/services/********
  // #excuses webhook URL: https://hooks.slack.com/services/********
  
  var SLACK_WEBHOOK_POST_URL = "https://hooks.slack.com/services/********";
  
  //Loading user email requires a different command
  var email = e.response.getRespondentEmail();
  
  //Filter out email bits to get firstnamelastname
  var who = email.split("2");
  who = who[0];
  
  //Load rest of the responses into an array (check GApps API for more info, search for "getItemResponses()"
  var response =  e.response.getItemResponses();
  var trainingDate = response[0].getResponse();
  var reason = response[1].getResponse();

    // Build payload
  var payload = '{ "text": "New Training Excuse submitted!", "attachments": [ { "fields": [ { "title": "Training Date(s)", "value": "' + trainingDate + '" } ], "author_name": "' + who + '" }, { "title": "Reason", "text": "' + reason + '" }, { "fallback": "Verdict:", "title": "Verdict:", "callback_id": "some_id", "attachment_type": "default", "actions": [ { "name": "Approve", "text": "Approve", "type": "button", "style": "primary", "value": "approved", "confirm": { "title": "Are you sure?", "text": "Approve the request?", "ok_text": "Approve", "dismiss_text": "Cancel" } }, { "name": "Deny", "text": "Deny", "type": "button", "style": "danger", "value": "denied", "confirm": { "title": "Are you sure?", "text": "Deny the request?", "ok_text": "Deny", "dismiss_text": "Cancel" } } ] } ] }';
  
    // Build request
    var options = {
     method : "post",
     payload : payload,
     muteHttpExceptions: true
    };

    // Send to Slack
    UrlFetchApp.fetch(SLACK_WEBHOOK_POST_URL, options);
 }