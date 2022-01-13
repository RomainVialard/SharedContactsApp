/*
   Custom Field
 
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

- - - - - - - Class customField - - - - - - - 

Members:
- deleteCustomField()
- getValue()
- setValue()
- getLabel()
- setLabel()

*/

ProfilesApp.customField = function (customField, profile) {
  this.customField = customField;
  this.parent = profile;
};

var customFieldClass = ProfilesApp.customField.prototype;

customFieldClass.deleteCustomField = function () {
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var customField = this.customField.toXmlString().replace(xmlHeader, '');
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(customField, ""), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
};
customFieldClass.getValue = function () {
  var value = this.customField.getAttribute('value').getValue();
  return value;
};
customFieldClass.setValue = function (text) {
debugger;
  if (this.getValue() === text) {return this;}
  text = encodeHtml_(text).replace(/"/g, '&quot;');
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var oldEntry = this.customField.toXmlString().replace(xmlHeader, '');
  var oldEntryValue = encodeHtml_(this.customField.getAttribute('value').getValue()).replace(/"/g, '&quot;');
  var newEntry = this.customField.toXmlString().replace(xmlHeader, '').replace('value="' + oldEntryValue, 'value="' + text); //Has fix for https://code.google.com/p/google-script-examples/issues/detail?id=66
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
  this.customField = Xml.parse(newEntry).getElement();
  return this;
};
customFieldClass.getLabel = function () {
  var label = this.customField.getAttribute('key').getValue();
  return label;
};
customFieldClass.setLabel = function (label) {
  label = encodeHtml_(label);
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var oldEntry = this.customField.toXmlString().replace(xmlHeader, '');
  var newEntry = this.customField.toXmlString().replace(xmlHeader, '').replace(encodeHtml_(this.customField.getAttribute('key').getValue()), label);
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
  this.customField = Xml.parse(newEntry).getElement();
  return this;
};