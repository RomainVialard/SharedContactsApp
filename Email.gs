/*
   Email
 
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

- - - - - - - Class email - - - - - - - 

Members:
- deleteEmailField()
- getAddress()
- setAddress()
- getLabel()
- setLabel()

*/

ProfilesApp.email = function (email, profile) {
  this.email = email;
  this.parent = profile;
};

var emailClass = ProfilesApp.email.prototype;

emailClass.deleteEmailField = function () {
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var email = this.email.toXmlString().replace(xmlHeader, '').replace(xmlnsGd, '');
  Logger.log(email);
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(email, ""), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
};
emailClass.getAddress = function () {
  return this.email.getAttribute('address').getValue();
};
emailClass.setAddress = function (text) {
  text = encodeHtml_(text);
  if (this.getAddress() === text) {return this;}
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var oldEntry = 'address="' + encodeHtml_(this.email.getAttribute('address').getValue()); 
  var newEntry = 'address="' + text;
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
  this.email = Xml.parse(this.email.toXmlString().replace(oldEntry, newEntry)).getElement(); 
  return this;
};
emailClass.getLabel = function () {
  var label = this.email.getAttribute('rel');
  if(label == null) return '';
  label = label.getValue();
  label = Frels.email[label] || ContactsApp.Field.WORK_EMAIL;
  return label;
};
emailClass.setLabel = function (label) {
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var oldEntry = '<gd:email address="'+ this.email.getAttribute('address').getValue() +'" rel="' + this.email.getAttribute('rel').getValue() + '"/>';
  var rel = Frels.email[label] || Frels.email[ContactsApp.Field.WORK_EMAIL];
  var newEntry = '<gd:email address="'+ this.email.getAttribute('address').getValue() +'" rel="' + rel + '"/>';
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(oldEntry, newEntry), linkUrl); 
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement(), xmlOutput.getElement());
  this.email = Xml.parse(this.email.toXmlString().replace(this.email.getAttribute('rel').getValue(),rel)).getElement(); 
  return this;
};