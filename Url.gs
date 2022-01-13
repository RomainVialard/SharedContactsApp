/*
   Url Field
 
   Copyright (c) 2013 Romain Vialard, Peter Herrmann & ProfilesApp 
   Contributors
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

- - - - - - - Class url - - - - - - - 

Members:
- deleteUrlField()
- getValue()
- setAddress()
- getLabel()
- setLabel()

*/

ProfilesApp.url = function (url, profile) {
  this.url = url;
  this.parent = profile;
};

var urlClass = ProfilesApp.url.prototype;

urlClass.deleteUrlField = function () {
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var url = this.url.toXmlString().replace(xmlHeader, '');
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(url, ""), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
};
urlClass.getAddress = function () {
  var value = this.url.getAttribute('href').getValue();
  return value;
};
urlClass.setAddress = function (text) {
  if (text === '') {return this.deleteUrlField();}
  if (this.getAddress() === text) {return this;}
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var oldEntry = this.url.toXmlString().replace(xmlHeader, '');
  var newEntry = this.url.toXmlString().replace(xmlHeader, '').replace(this.url.getAttribute('href').getValue(), text);
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
  this.url = Xml.parse(newEntry).getElement();
  return this;
};
urlClass.getLabel = function () {
  var label = this.url.getAttribute('rel');
  if(label == null) return '';
  label = label.getValue();
  label = Frels.url[label] || ContactsApp.Field.WORK_WEBSITE;
  return label;
};
urlClass.setLabel = function (label) {
  //label = encodeHtml_(label);
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var oldEntry = this.url.toXmlString().replace(xmlHeader, '');
  label = Frels.url[label] || ContactsApp.Field.WORK_WEBSITE;
  var newEntry = this.url.toXmlString().replace(xmlHeader, '').replace(encodeHtml_(this.url.getAttribute('rel').getValue()), label);
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
  this.url = Xml.parse(newEntry).getElement();
  return this;
};