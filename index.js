// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
const http = require('http');
//const host = 'api.worldweatheronline.com';
//const wwoApiKey = 'b7b9ffe1c05e42df8eb193803171007';
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;

exports.iamHome = (request, response) => {
  const app = new App({ request, response });
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));
  
  let clientSecret = 'e0cQ2c-f2NLCDK8TkpErzLRF';
  let clientId = '982354824917-qql3onj149nhoe1c801e5kk0jos826er.apps.googleusercontent.com';
  let redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';
  let auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  let token = '{"access_token":"ya29.GluGBKMdJtvEr92C2RgCEeBTgxmJWh0gnhnwXSw5OvrBXL-1ugAdlIXSFgE0i9hGnFHnGupajPsjEmn_ZH92sOilV0QNfIiUB-WPJiTHQ-qF-SoBnH_OKM2OiqOl","refresh_token":"1/5PKjoB-0ciDdkxtnDQDd8tMSuTu2799j3vYcYFv_feOVgeSEBEpr3ScMXjYfvh6j","token_type":"Bearer","expiry_date":1499964946598}'
  oauth2Client.credentials = JSON.parse(token);

  /**
 * Lists the user's first 10 task lists.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listTaskLists(app) {
  let service = google.tasks('v1');
  service.tasklists.list({
    auth: oauth2Client,
    maxResults: 10,
  }, function(err, res) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    let items = res.items;
    if (items.length == 0) {
      console.log('No task lists found.');
      app.tell('No task lists found.');
      return ;
    } else {
      console.log('Task lists: ');
      let response = 'Task lists: ';
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        console.log('%s (%s)', item.title, item.id);
        response += item.title + ' ';
      }
      app.ask(app.buildRichResponse()
            .addSimpleResponse(response));
      return ;
    }
  });
}

/**
 * Lists tasks for a task list
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listTaskListTasks(app) {
  let service = google.tasks('v1');
  service.tasks.list({
    auth: oauth2Client,
    tasklist: tasklist,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    let items = response.items;
    if (items.length == 0) {
      console.log('No task lists found.');
    } else {
      console.log('Tasks: ');
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        console.log('%s (%s)', item.title, item.id);
      }
    }
  });
}

/**
 * Creates a task lists
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function createTaskList(app) {
  let service = google.tasks('v1');

  let listdate = app.getArgument('date');
  let givenName = app.getArgument('given-name');
  let location = app.getArgument('location');

  let title = givenName + ' ' + location.shortcut + ' ' + listdate;
  let tasklist = {
    "title" : title
  } 

  service.tasklists.insert({
    auth: oauth2Client,
    resource: tasklist,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.log(response);
    app.ask(app.buildRichResponse()
            .addSimpleResponse('List created with title ' + title));
  });
}



let actionMap = new Map();
  actionMap.set('list.TaskLists', listTaskLists);
  actionMap.set('create.tasklist', createTaskList);

  app.handleRequest(actionMap);

};


/* exports.tasksWebhook = (req, res) => {
  
  authorize(listTaskLists);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 'speech': "Done", 'displayText': "Done" }));
}; */

