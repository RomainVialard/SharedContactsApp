/*
   Address
 
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

- - - - - - - Class Address - - - - - - - 

Members:
- deleteAddressField()
- getAddress()
- setAddress()
- getLabel()
- setLabel()

*/

ProfilesApp.address = function (address, profile) {
  this.address = address;
  this.parent = profile;
};

var addressClass = ProfilesApp.address.prototype;

addressClass.deleteAddressField = function () {
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var address = this.address.toXmlString().replace(xmlHeader, '').replace(xmlnsGd, '');
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(address, ""), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
};
addressClass.getAddress = function () {
  return this.address.getElement(gd, 'formattedAddress').getText();
};
addressClass.setAddress = function (text) {
  if (text === '') { return this.deleteAddressField(); }
  text = encodeHtml_(text);
  if (this.getAddress() === text) { return this; }
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var oldEntry = '<gd:formattedAddress>' + encodeHtml_(this.address.getElement(gd, 'formattedAddress').getText()) + '</gd:formattedAddress>';
  var newEntry = '<gd:formattedAddress>' + text + '</gd:formattedAddress>';
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
  this.address = Xml.parse(this.address.toXmlString().replace(oldEntry, newEntry)).getElement();
  return this;
};
addressClass.getLabel = function () {
  var label = this.address.getAttribute('rel');
  if (label == null) return '';
  label = label.getValue();
  label = Frels.address[label] || ContactsApp.Field.WORK_ADDRESS;
  return label;
};
addressClass.setLabel = function (label) {
  var linkUrl = findUrlToUpdateElement_(this.parent.profile);
  var oldEntry = '<gd:structuredPostalAddress rel="' + this.address.getAttribute('rel').getValue() + '">';
  var rel = Frels.address[label] || Frels.address[ContactsApp.Field.WORK_ADDRESS];
  var newEntry = '<gd:structuredPostalAddress rel="' + rel + '">';
  var xmlOutput = profilesRequest_('put', this.parent.profile.toXmlString().replace(oldEntry, newEntry), linkUrl);
  this.parent.profile = reGetProfileXml_(this.parent.getId(), xmlOutput.getElement());
  this.address = Xml.parse(this.address.toXmlString().replace(this.address.getAttribute('rel').getValue(), rel)).getElement();
  return this;
};