/*
   phone
 
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

- - - - - - - Class phone - - - - - - - 

Members:
- deletePhoneField()
- getPhoneNumber()
- setPhoneNumber()
- getLabel()
- setLabel()

*/

ProfilesApp.phone = function (phone, profile) {
  this.phone = phone;
  this.parent = profile;
};

var phoneClass = ProfilesApp.phone.prototype;

phoneClass.deletePhoneField = function () {
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var phone = this.phone.toXmlString().replace(xmlHeader, '').replace(xmlnsGd, '');
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(phone, ""), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
};
phoneClass.getPhoneNumber = function () {
  return this.phone.getText();
};
// to be fixed
phoneClass.setPhoneNumber = function (text) {
  if (text === '') {return this.deletePhoneField();}
  text = encodeHtml_(text);
  if (this.getPhoneNumber() === text) {return this;}
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var oldEntry = this.phone.toXmlString().replace(xmlHeader, '').replace(xmlnsGd, '');
  var newEntry = this.phone.toXmlString().replace(xmlHeader, '').replace(encodeHtml_(this.phone.getText()), text);
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
  this.phone = Xml.parse(newEntry).getElement();
  return this;
};
phoneClass.getLabel = function () {
  var label = this.phone.getAttribute('rel');
  if(label == null) return '';
  label = label.getValue();
  label = Frels.phone[label] || ContactsApp.Field.WORK_PHONE;
  return label;
};
phoneClass.setLabel = function (label) {
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var oldEntry = '<gd:phoneNumber rel="' + this.phone.getAttribute('rel').getValue() + '">'+this.phone.getText()+'</gd:phoneNumber>';
  var rel = Frels.phone[label] || Frels.phone[ContactsApp.Field.WORK_PHONE];
  var newEntry = '<gd:phoneNumber rel="' + rel + '">'+this.phone.getText()+'</gd:phoneNumber>';
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
  this.phone = Xml.parse(this.phone.toXmlString().replace(this.phone.getAttribute('rel').getValue(),rel)).getElement(); //note this is diff way to the put
  return this;
};