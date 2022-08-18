/*
   SharedContactsApp
  
   Copyright (c) 2013 Romain Vialard & Peter Herrmann
   https://plus.google.com/u/0/116263732197316259248/about

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/**
 * Creates a new shared contact.
 *
 * @param  {string} firstName the first name of the contact
 * @param  {string} lastName the last name of the contact
 * @param  {string} emailAddress the email address of the contact
 * @return {Contact} newly created Contact object 
 */
function createContact(firstName, lastName, emailAddress) {
  firstName = encodeHtml_(firstName);
  lastName = encodeHtml_(lastName);
  emailAddress = emailAddress.replace(/'/g, '&apos;');
  var newEntry = "<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' xmlns:gd='http://schemas.google.com/g/2005'>\
    <atom:category scheme='http://schemas.google.com/g/2005#kind'\
    term='http://schemas.google.com/contact/2008#contact' />\
    <gd:name><gd:givenName>" + firstName + "</gd:givenName>\
     <gd:familyName>" + lastName + "</gd:familyName>\
     <gd:fullName>" + firstName + " " + lastName + "</gd:fullName></gd:name>\
    <gd:email rel='http://schemas.google.com/g/2005#work' primary='true' address='" + emailAddress + "' /></atom:entry>";
  var xmlOutput = profilesRequest_('post', newEntry, '');
  return new ProfilesApp.profile(xmlOutput.getElement());
}

/**
 * Delete the shared contact.
 *
 * @param  {Contact} contact the contact to be deleted
 * @return void 
 */
function deleteContact(contact) {
  var linkUrl = findUrlToUpdateElement_(contact.profile);
  var xmlOutput = profilesRequest_('delete', '', linkUrl);
}

/**
* Returns the first shared contacts on the domain.
*
* @return {contacts[]} the first shared contacts on the domain
*/
function getContacts() {
  var xmlOutput = profilesRequest_('get', '');
  var temp = xmlOutput.getElement().getElements('entry');
  var profiles = [];
  for (var i = 0; i < temp.length; i++) profiles.push(new ProfilesApp.profile(temp[i]));
  return profiles;
}

/**
* Returns the first shared contacts on the domain continuing where the token from the previous lookup left off + the next token.
*
* @param  {string} optToken the token from the previous lookup
* @return {contacts[]} the shared contacts requested and the next token
*/
function getContactsForPaging(optToken) {
  if (optToken == undefined) var xmlOutput = profilesRequest_('get', '');
  else var xmlOutput = profilesRequest_('get', '', optToken);
  var temp = xmlOutput.getElement().getElements('entry');
  var profiles = [];
  for (var i = 0; i < temp.length; i++) profiles.push(new ProfilesApp.profile(temp[i]));
  var token = null;
  var links = xmlOutput.getElement().getElements('link');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('rel').getValue() == 'next') token = links[i].getAttribute('href').getValue();
  }
  return new tokenApp.result(profiles, token);
}

var tokenApp = {};
tokenApp.result = function (profiles, token) {
  this.profiles = profiles;
  this.token = token;
};
var tokenClass = tokenApp.result.prototype;
tokenClass.getToken = function () {
  return this.token;
};
tokenClass.getContacts = function () {
  return this.profiles;
};

/**
 * Returns the shared contact with the given ID.
 *
 * @param  {string} loginId the shared contact ID
 * @return {Contact} the shared contact with the given ID. 
 */
function getContactById(loginId) {
  var user = loginId;
  if (user.indexOf('@') != -1) user = loginId.substring(0, loginId.indexOf('@'));
  var xmlOutput = profilesRequest_('get', user);
  if (xmlOutput == null) return null;
  return new ProfilesApp.profile(xmlOutput.getElement());
}

/* - - - - - - - Utilities - - - - - - - */
function profilesRequest_(method, query, url) {
  if (this.traceRequests && this.loggerFunction) { this.loggerFunction('profilesRequest_ request: \nmethod: %s, \nquery: %s, \nurl: %s', method || '', query || '', url || ''); }
  var user = Session.getEffectiveUser().getEmail();
  var domain = user.substring(user.indexOf('@') + 1);
  var base = "https://www.google.com/m8/feeds/contacts/" + domain + "/full/";
  var fetchArgs = {};
  fetchArgs.headers = {
    Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
  };
  fetchArgs.headers['If-Match'] = '*';
  fetchArgs.headers['GData-Version'] = '3.0';
  fetchArgs.method = method;
  if (method == 'get') {
    if (url == undefined) {
      if (query.indexOf('@') != -1) {
        //new multidomain support
        var queryUser = query.substring(0, query.indexOf('@'));
        var queryDomain = query.substring(query.indexOf('@') + 1);
        url = base.replace(domain, queryDomain) + queryUser;
      } else {
        url = base + query;
      }
    }
    else if (url.indexOf('feeds/photos') != -1) {
      try {
        var result = UrlFetchApp.fetch(url, fetchArgs);
      }
      catch (e) {
        return null;
      }
      if (this.traceRequests && this.loggerFunction) { this.loggerFunction('profilesRequest_ response: blob'); }
      return result.getBlob();
    }
  }
  else if (method == 'post') {
    if (url == '') delete fetchArgs.headers['If-Match'];
    url = base + url;
    fetchArgs.contentType = 'application/atom+xml';
    fetchArgs.payload = query;
  }
  else if (method == 'put') {
    if (url.indexOf('feeds/photos') != -1) fetchArgs.contentType = 'image/*';
    else {
      fetchArgs.contentType = 'application/atom+xml';
      query = fixXmlns_(query);
    }
    fetchArgs.payload = query;
  }
  else if (method == 'delete') {
    if (this.traceRequests && this.loggerFunction) { this.loggerFunction('profilesRequest_ response: delete response code'); }
    return UrlFetchApp.fetch(url, fetchArgs).getResponseCode();
  }
  var fetch = gasCall_(function () { return UrlFetchApp.fetch(url, fetchArgs); });
  if (fetch == null) return null;
  var data = fetch.getContentText();
  var xmlOutput = Xml.parse(data, false);
  if (this.traceRequests && this.loggerFunction) { this.loggerFunction('profilesRequest_ responseCode: %s, \nresponse: %s', fetch.getResponseCode(), xmlOutput.toXmlString()); }
  return xmlOutput;
}

/*
* Wait for data to be consistent and get again the profile data.
* Fix for issue https://code.google.com/p/google-script-examples/issues/detail?id=27
*/
function reGetProfileXml_(id, xmlElement) {
  if (goFaster) { return xmlElement; }
  Utilities.sleep(4000);
  var xmlOutput = profilesRequest_('get', id);
  if (xmlOutput == null) return null;
  return xmlOutput.getElement();
}
function findUrlToUpdateElement_(element) {
  var links = element.getElements('link');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('rel').getValue() == 'edit') {
      var url = links[i].getAttribute('href').getValue();
    }
  }
  return url;
}

/*
Here's Peter Herrmann implementation of the exponential backoff pattern presented
in the Google Developer Blog [1] and covered in the Google Apps developer docs [2].
It will retry with delays of approximately 1, 2, 4, 8 then 16 seconds for a total of 
about 32 seconds before gives up and rethrows the last error. 
[1] http://googleappsdeveloper.blogspot.com.au/2011/12/documents-list-api-best-practices.html
[2] https://developers.google.com/google-apps/documents-list/#implementing_exponential_backoff
*/
function gasCall_(f) {
  for (var n = 0; n < 6; n++) {
    try {
      return f();
    }
    catch (e) {
      if (this.traceRequests && this.loggerFunction) { this.loggerFunction('GASRetry ' + n + ': ' + e); }
      if (e.message.indexOf('returned code 404') != -1) return null;
      if (n == 5) {
        throw e;
      }
      Utilities.sleep((Math.pow(2, n) * 1000) + (Math.round(Math.random() * 1000)));
    }
  }
}

/**
* Frels - provides a facility to lookup ContactsApp.Field enums mapped to 'rel' values.
* Ref: https://developers.google.com/apps-script/reference/contacts/field and
* and https://developers.google.com/gdata/docs/2.0/elements#gdPhoneNumber
* Author: Peter Herrmann
* Usage: 
*         //  Get a ContactsApp.Field from a rel, defaults to work phone if myRel is undefined
*         //var myField = Frels.phone[myRel] || ContactsApp.Field.WORK_PHONE;
*         //  Get a rel value from a field, defaults to the rel value for work phone if myField is undefined
*         //var myRel = Frels.phone[myField] || Frels.phone[ContactsApp.Field.WORK_PHONE];
*/
var Frels = {
  'phone': {
    'http://schemas.google.com/g/2005#work': ContactsApp.Field.WORK_PHONE,
    'WORK_PHONE': 'http://schemas.google.com/g/2005#work',
    'http://schemas.google.com/g/2005#work_fax': ContactsApp.Field.WORK_FAX,
    'WORK_FAX': 'http://schemas.google.com/g/2005#work_fax',
    'http://schemas.google.com/g/2005#mobile': ContactsApp.Field.MOBILE_PHONE,
    'MOBILE_PHONE': 'http://schemas.google.com/g/2005#mobile',
    'http://schemas.google.com/g/2005#home': ContactsApp.Field.HOME_PHONE,
    'HOME_PHONE': 'http://schemas.google.com/g/2005#home',
    'http://schemas.google.com/g/2005#home_fax': ContactsApp.Field.HOME_FAX,
    'HOME_FAX': 'http://schemas.google.com/g/2005#home_fax'
  },
  'email': {
    'http://schemas.google.com/g/2005#home': ContactsApp.Field.HOME_EMAIL,
    'HOME_EMAIL': 'http://schemas.google.com/g/2005#home',
    'http://schemas.google.com/g/2005#work': ContactsApp.Field.WORK_EMAIL,
    'WORK_EMAIL': 'http://schemas.google.com/g/2005#work'
  },
  'address': {
    'http://schemas.google.com/g/2005#work': ContactsApp.Field.WORK_ADDRESS,
    'WORK_ADDRESS': 'http://schemas.google.com/g/2005#work',
    'http://schemas.google.com/g/2005#home': ContactsApp.Field.HOME_ADDRESS,
    'HOME_ADDRESS': 'http://schemas.google.com/g/2005#home'
  },
  'url': {
    'blog': ContactsApp.Field.BLOG,
    'BLOG': 'blog',
    'ftp': ContactsApp.Field.FTP,
    'FTP': 'ftp',
    'home-page': ContactsApp.Field.HOME_PAGE,
    'HOME_PAGE': 'home-page',
    'home': ContactsApp.Field.HOME_WEBSITE,
    'HOME_WEBSITE': 'home',
    'profile': ContactsApp.Field.PROFILE,
    'PROFILE': 'profile',
    'work': ContactsApp.Field.WORK_WEBSITE,
    'WORK_WEBSITE': 'work'
  }
};
/**
Tracing example:
   
  //... I want to trace a particular line of my code
  ProfilesApp.traceRequests = true; //set this here to start
  //UrlFetch requests, responses, retries and exceptions will be traced to Logger.log - very verbose
  profile.setJobTitle('test');  
  ProfilesApp.traceRequests = false; //set to false to stop
*/
var traceRequests = false; //set to true to invoke logging on UrlFetch requests, responses, retries and exceptions
// loggerFunction is used if traceRequests is true. You can pass a function that will be used to log to in the case of a retry. 
//   For example, var loggerFunction = Logger.log (no parentheses) will work.
var loggerFunction;
//WARNING: if you set goFaster to true, profile data cannot be reused after a set or add operation because it 
// is not reloaded with the latest data. Does not incur the 4000 millisecond time cost. 
// Useful to quickly add/update/set/remove a single field on many profiles
var goFaster = false;
function fixXmlns_(text) {
  // add xmlns https://code.google.com/p/google-script-examples/issues/detail?id=28
  var from = '<entry xmlns:gd="http://schemas.google.com/g/2005"';
  var to = '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:gd="http://schemas.google.com/g/2005"';
  var newtext = text.replace(from, to);
  return newtext;
}
function encodeHtml_(text) {
  if (text || text === '') {
    return text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    //.replace(/"/g, '&quot;');
    //.replace(/'/g, '&apos;'); 
  }
  //  .replace(/"/g, '&quot;') .replace(/'/g, '&apos;'); not required for xml
}
function decodeHtml_(text) {
  return text.replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<');
  //  " and ' not required for xml because toXmlString does that
}
