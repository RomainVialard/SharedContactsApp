/*
   Profile
 
   Copyright (c) 2013 Romain Vialard
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

/* 

- - - - - - - Class Profile - - - - - - - 

Members:
- getFullName()
- getGivenName()
- getFamilyName()
- getCompanyName()
- setCompanyName()
- getDepartment()
- setDepartment()
- getJobTitle()
- setJobTitle()
- getEmails()
- addEmail()
- getAddresses()
- addAddress()
- getId()
- getPhones()
- addPhone()
- getCustomFields()
- addCustomField()
- getUrls()
- addUrl()
- getProfilePicture()
- setProfilePicture()
- isIndexed()
- index()
- unindex()


*/
var ProfilesApp = {};
// Namespaces
var gd = 'http://schemas.google.com/g/2005';
var gContact = 'http://schemas.google.com/contact/2008';
var xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
var xmlnsGd = ' xmlns:gd="http://schemas.google.com/g/2005"';
ProfilesApp.profile = function (profile) {
  //  if (!profile.getAttribute('xmlns')) {
  //    var profile = fixXmlns_(profile);
  //  }
  this.profile = profile;
};
var profileClass = ProfilesApp.profile.prototype;
/** 
* Gets the login id (email address) of the Profile's Google account.
*
* @return {String} the login id (email address)
*/
profileClass.getId = function () {
  var id = this.profile.id.getText();
  return id.substr(id.lastIndexOf('/') + 1);
};

profileClass.getFullName = function () {
  return this.profile.getElement(gd, 'name').getElement(gd, 'fullName').getText();
};
profileClass.getGivenName = function () {
  return this.profile.getElement(gd, 'name').getElement(gd, 'givenName').getText();
};
profileClass.getFamilyName = function () {
  return this.profile.getElement(gd, 'name').getElement(gd, 'familyName').getText();
};
profileClass.getCompanyName = function () {
  var org = this.profile.getElement(gd, 'organization');
  if (org == null) return '';
  else if (org.getElement(gd, 'orgName') == null) return '';
  else return org.getElement(gd, 'orgName').getText();
};
profileClass.setCompanyName = function (text) {
  text = encodeHtml_(text);
  if (this.getCompanyName() === text) { return this; }
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var org = this.profile.getElement(gd, 'organization');
  if (org != null) {
    var oldEntry = org.getElement(gd, 'orgName');
    if (oldEntry == null) {
      oldEntry = '</gd:organization>';
      var newEntry = '<gd:orgName>' + text + '</gd:orgName></gd:organization>';
    }
    else if (text === '') { //remove the element, no longer displays label in UI
      oldEntry = '<gd:orgName>' + encodeHtml_(oldEntry.getText()) + '</gd:orgName>';
      var newEntry = '';
    }
    else {
      oldEntry = '<gd:orgName>' + encodeHtml_(oldEntry.getText()) + '</gd:orgName>';
      var newEntry = '<gd:orgName>' + text + '</gd:orgName>';
    }
    var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  }
  else {
    var newEntry = '<gd:organization rel="http://schemas.google.com/g/2005#other"\
    xmlns:gd="http://schemas.google.com/g/2005">\
    <gd:orgName>' + text + '</gd:orgName><gd:orgTitle></gd:orgTitle></gd:organization>';
    var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace("</entry>", newEntry + "</entry>"), linkUrl);
  }
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  return this;
};
//getDepartment
profileClass.getDepartment = function () {
  var org = this.profile.getElement(gd, 'organization');
  if (org == null) return '';
  else if (org.getElement(gd, 'orgDepartment') == null) return '';
  else return org.getElement(gd, 'orgDepartment').getText();
};
profileClass.setDepartment = function (text) {
  text = encodeHtml_(text);
  if (this.getDepartment() === text) { return this; }
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var org = this.profile.getElement(gd, 'organization');
  if (org != null) {
    var oldEntry = org.getElement(gd, 'orgDepartment');
    if (oldEntry == null) {
      oldEntry = '</gd:organization>';
      var newEntry = '<gd:orgDepartment>' + text + '</gd:orgDepartment></gd:organization>';
    }
    else if (text === '') { //remove the element, no longer displays label in UI
      oldEntry = '<gd:orgDepartment>' + encodeHtml_(oldEntry.getText()) + '</gd:orgDepartment>';
      var newEntry = '';
    }
    else {
      oldEntry = '<gd:orgDepartment>' + encodeHtml_(oldEntry.getText()) + '</gd:orgDepartment>';
      var newEntry = '<gd:orgDepartment>' + text + '</gd:orgDepartment>';
    }
    var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  }
  else {
    var newEntry = '<gd:organization rel="http://schemas.google.com/g/2005#other"\
    xmlns:gd="http://schemas.google.com/g/2005">\
    <gd:orgDepartment>' + text + '</gd:orgDepartment><gd:orgTitle></gd:orgTitle></gd:organization>';
    var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace("</entry>", newEntry + "</entry>"), linkUrl);
  }
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  return this;
};
profileClass.getJobTitle = function () {
  var org = this.profile.getElement(gd, 'organization');
  if (org == null) return '';
  else if (org.getElement(gd, 'orgTitle') == null) return '';
  else return org.getElement(gd, 'orgTitle').getText();
};
profileClass.setJobTitle = function (text) {
  text = encodeHtml_(text);
  if (this.getJobTitle() === text) { return this; }
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var org = this.profile.getElement(gd, 'organization');
  if (org != null) {
    var oldEntry = org.getElement(gd, 'orgTitle');
    if (oldEntry == null) {
      oldEntry = '</gd:organization>';
      var newEntry = '<gd:orgTitle>' + text + '</gd:orgTitle></gd:organization>';
    }
    else if (text === '') { //remove the element, no longer displays label in UI
      oldEntry = '<gd:orgTitle>' + encodeHtml_(oldEntry.getText()) + '</gd:orgTitle>';
      var newEntry = '';
    }
    else {
      oldEntry = '<gd:orgTitle>' + encodeHtml_(oldEntry.getText()) + '</gd:orgTitle>';
      var newEntry = '<gd:orgTitle>' + text + '</gd:orgTitle>';
    }
    var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  }
  else {
    var newEntry = '<gd:organization rel="http://schemas.google.com/g/2005#other"\
    xmlns:gd="http://schemas.google.com/g/2005"><gd:orgName>\
    </gd:orgName><gd:orgTitle>' + text + '</gd:orgTitle></gd:organization>';
    var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace("</entry>", newEntry + "</entry>"), linkUrl);
  }
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  return this;
};
//<gd:where valueString="13 Somewhere Square, Mainville VIC 9999, Australia"/> Office location .getAttribute('value').getValue();
profileClass.getOfficeLocation = function () {
  var org = this.profile.getElement(gd, 'organization');
  if (org == null) return '';
  else if (org.getElement(gd, 'where') == null) return '';
  else return org.getElement(gd, 'where').getAttribute('valueString').getValue();
};
profileClass.setOfficeLocation = function (text) {
  text = encodeHtml_(text);
  if (this.getOfficeLocation() === text) { return this; }
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var org = this.profile.getElement(gd, 'organization');
  if (org != null) {
    var oldEntry = org.getElement(gd, 'where');
    if (oldEntry == null) {
      oldEntry = '</gd:organization>';
      var newEntry = '<gd:where valueString="' + text + '"/></gd:organization>';
    }
    else if (text === '') { //remove the element, no longer displays label in UI
      oldEntry = '<gd:where valueString="' + encodeHtml_(oldEntry.getAttribute('valueString').getValue()) + '"/>';
      var newEntry = '';
    }
    else {
      oldEntry = '<gd:where valueString="' + encodeHtml_(oldEntry.getAttribute('valueString').getValue()) + '"/>';
      var newEntry = '<gd:where valueString="' + text + '"/></gd:organization>';
    }
    var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  }
  else {
    var newEntry = '<gd:organization rel="http://schemas.google.com/g/2005#other"\
    xmlns:gd="http://schemas.google.com/g/2005"><gd:orgName>\
    </gd:orgName><gd:where valueString="' + text + '"/></gd:organization>';
    var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace("</entry>", newEntry + "</entry>"), linkUrl);
  }
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  return this;
};
profileClass.getEmails = function () {
  var emails = [];
  var matchLabel = arguments[0]; //Gets the email addresses matching a particular field.
  var temp = this.profile.getElements(gd, 'email');
  for (var i = 0; i < temp.length; i++) emails.push(new ProfilesApp.email(temp[i], this));
  // if matching based on fields, remove the ones that don't match
  if (emails.length > 0 && matchLabel) {
    var len = emails.length;
    while (len--) {
      if (emails[len].getLabel() != matchLabel) emails.splice(len, 1);//remove
    }
  }
  return emails;
};
profileClass.addEmail = function (label, text) {
  text = encodeHtml_(text);
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var rel = Frels.email[label] || Frels.email[ContactsApp.Field.WORK_EMAIL];
  var newEntry = '<gd:email address="' + text + '" rel="' + rel + '"/>';
  var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace("</entry>", newEntry + "</entry>"), linkUrl);
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  if (goFaster) { return; }
  var emails = this.getEmails(label);
  for (var i in emails) {
    if (emails[i].getAddress() === text) { break; }
  }
  return emails[i];
};
profileClass.getAddresses = function () {
  var addresses = [];
  var matchLabel = arguments[0]; //Gets the addresses matching a particular field.
  var temp = this.profile.getElements(gd, 'structuredPostalAddress');
  for (var i = 0; i < temp.length; i++) addresses.push(new ProfilesApp.address(temp[i], this));
  // if matching based on fields, remove the ones that don't match
  if (addresses.length > 0 && matchLabel) {
    var len = addresses.length;
    while (len--) {
      if (addresses[len].getLabel() != matchLabel) addresses.splice(len, 1);//remove
    }
  }
  return addresses;
};
profileClass.addAddress = function (label, text) {
  text = encodeHtml_(text).replace(/"/g, '&quot;');
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var rel = Frels.address[label] || Frels.address[ContactsApp.Field.WORK_ADDRESS];
  var newEntry = '<gd:structuredPostalAddress rel="' + rel + '">\
  <gd:formattedAddress>' + text + '</gd:formattedAddress></gd:structuredPostalAddress>';
  var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace("</entry>", newEntry + "</entry>"), linkUrl);
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  if (goFaster) { return; }
  //return last (the one just added?)
  return this.getAddresses()[this.getAddresses().length - 1];
};
profileClass.getPhones = function () {
  var phones = [];
  var matchLabel = arguments[0]; //Gets the phones matching a particular field.
  var temp = this.profile.getElements(gd, 'phoneNumber');
  for (var i = 0; i < temp.length; i++) phones.push(new ProfilesApp.phone(temp[i], this));
  // if matching based on fields, remove the ones that don't match
  if (phones.length > 0 && matchLabel) {
    var len = phones.length;
    while (len--) {
      if (phones[len].getLabel() != matchLabel) phones.splice(len, 1);//remove
    }
  }
  return phones;
};
profileClass.addPhone = function (label, text) {
  text = encodeHtml_(text).replace(/"/g, '&quot;');
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var rel = Frels.phone[label] || Frels.phone[ContactsApp.Field.WORK_PHONE];
  var newEntry = '<gd:phoneNumber rel="' + rel + '">' + text + '</gd:phoneNumber>';
  var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace("</entry>", newEntry + "</entry>"), linkUrl);
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  if (goFaster) { return; }
  //return last (the one just added)
  return this.getPhones()[this.getPhones().length - 1];
};
profileClass.getCustomFields = function () {
  var customFields = [];
  var matchLabel = arguments[0]; //Gets the custom fields matching a particular field.
  var temp = this.profile.getElements(gContact, 'userDefinedField');
  for (var i = 0; i < temp.length; i++) customFields.push(new ProfilesApp.customField(temp[i], this));
  // if matching based on fields, remove the ones that don't match
  if (customFields.length > 0 && matchLabel) {
    var len = customFields.length;
    while (len--) {
      if (customFields[len].getLabel() != matchLabel) customFields.splice(len, 1);//remove
    }
  }
  return customFields;
};
//obsoleted by above
//profileClass.getCustomFieldByLabel = function (label) {
//  var customField = undefined;
//  var temp = this.profile.getElements(gContact, 'userDefinedField');
//  for(var i = 0; i < temp.length; i++) {
//    if(temp[i].getAttribute('key').getValue() == label) {
//      customField = new ProfilesApp.customField(temp[i], this);
//      break;
//    }
//  }
//  return customField;
//};
profileClass.addCustomField = function (label, text) {
  text = encodeHtml_(text).replace(/"/g, '&quot;');
  label = encodeHtml_(label).replace(/"/g, '&quot;');
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var newEntry = '<gContact:userDefinedField xmlns:gContact="http://schemas.google.com/contact/2008" key="' + label + '" value="' + text + '"/>';
  var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace('</entry>', newEntry + '</entry>'), linkUrl);
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  if (goFaster) { return; }
  //return last (the one just added)
  return this.getCustomFields()[this.getCustomFields().length - 1];
};
profileClass.getUrls = function () {
  var urls = [];
  var matchLabel = arguments[0]; //Gets the urls matching a particular field.
  var temp = this.profile.getElements(gContact, 'website');
  for (var i = 0; i < temp.length; i++) urls.push(new ProfilesApp.url(temp[i], this));
  // if matching based on fields, remove the ones that don't match
  if (urls.length > 0 && matchLabel) {
    var len = urls.length;
    while (len--) {
      if (urls[len].getLabel() != matchLabel) urls.splice(len, 1);//remove
    }
  }
  return urls;
};
profileClass.addUrl = function (label, text) {
  text = encodeHtml_(text);
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var rel = Frels.url[label] || Frels.url[ContactsApp.Field.WORK_WEBSITE];
  var newEntry = '<gContact:website xmlns:gContact="http://schemas.google.com/contact/2008" href="' + text + '" rel="' + rel + '"/>';
  var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace('</entry>', newEntry + '</entry>'), linkUrl);
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  if (goFaster) { return; }
  //return last (the one just added)
  return this.getUrls()[this.getUrls().length - 1];
};
profileClass.getProfilePicture = function () {
  var links = this.profile.getElements('link');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('rel').getValue() == 'http://schemas.google.com/contacts/2008/rel#photo') {
      var url = links[i].getAttribute('href').getValue();
    }
  }
  return profilesRequest_('get', '', url);
};
profileClass.hasProfilePicture = function () {
  var links = this.profile.getElements('link');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('rel').getValue() == 'http://schemas.google.com/contacts/2008/rel#photo') {
      if (links[i].getAttribute('http://schemas.google.com/g/2005', 'etag') !== null) {
        return true;
      }
    }
  }
  return false;
};
profileClass.setProfilePicture = function (blob) {
  var links = this.profile.getElements('link');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('rel').getValue() == 'http://schemas.google.com/contacts/2008/rel#photo') {
      var url = links[i].getAttribute('href').getValue();
    }
  }
  return profilesRequest_('put', blob.getBytes(), url);
};
profileClass.isIndexed = function () {
  return this.profile.getElement(gContact, 'status').getAttribute('indexed').getValue();
};
profileClass.index = function () {
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var oldEntry = '<gContact:status indexed="' + this.isIndexed();
  var newEntry = '<gContact:status indexed="true';
  var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  return this;
};
profileClass.unindex = function () {
  var linkUrl = findUrlToUpdateElement_(this.profile);
  var oldEntry = '<gContact:status indexed="' + this.isIndexed();
  var newEntry = '<gContact:status indexed="false';
  var xmlOutput = profilesRequest_('put', this.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.profile = reGetProfileXml_(this.getId(), xmlOutput.getElement());
  return this;
};