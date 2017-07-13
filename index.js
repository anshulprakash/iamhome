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


exports.tasksWebhook = (req, res) => {
  
  authorize(listTaskLists);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 'speech': "Done", 'displayText': "Done" }));
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(callback) {
  var clientSecret = 'e0cQ2c-f2NLCDK8TkpErzLRF';
  var clientId = '982354824917-qql3onj149nhoe1c801e5kk0jos826er.apps.googleusercontent.com';
  var redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  var token = '{"access_token":"ya29.GluFBEbuA01kY9Eo3fF6RTvAXr4JaCs2aWHxZ3-KQejJWE7b_-2-OxPpExJMzHhZ3YdCrya3gJrlqyb2JKGMM4xr-Gto-aBXuh20syqECWas9nghnLTr3nmeclbW",'+
              '"refresh_token":"1/UUR_ORDDadCoQxdgZpfoACFeRYxtUY5lK-MK-ze6z_8",'+
              '"token_type":"Bearer","expiry_date":1499876043952}'
  oauth2Client.credentials = JSON.parse(token);
  callback(oauth2Client);
}

/**
 * Lists the user's first 10 task lists.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listTaskLists(auth) {
  var service = google.tasks('v1');
  service.tasklists.list({
    auth: auth,
    maxResults: 10,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var items = response.items;
    if (items.length == 0) {
      console.log('No task lists found.');
    } else {
      console.log('Task lists:');
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        console.log('%s (%s)', item.title, item.id);
        listTaskListTasks(item.title,auth);
      }
    }
  });
}

/**
 * Lists the user's first 10 task lists.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listTaskListTasks(tasklist,auth) {
  var service = google.tasks('v1');
  service.tasks.list({
    auth: auth,
    tasklist: tasklist,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var items = response.items;
    if (items.length == 0) {
      console.log('No task lists found.');
    } else {
      console.log('Tasks: ');
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        console.log('%s (%s)', item.title, item.id);
      }
    }
  });
}