/*
 * Copyright (c) 2013, IT Services, Stockholm University
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name of Stockholm University nor the names of its contributors
 * may be used to endorse or promote products derived from this software
 * without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

if (!("JST" in window) || "JST" === undefined) {
  window.JST = {};
}

JST['map/infoWindow/building'] = _.template(" \
<% if (hasElevators === true) { %> \
<i class='elevator'></i> <%= i18n.t('map.infoWindow.elevator.exists') %> \
<% } else { %> \
<%= i18n.t('map.infoWindow.elevator.noexists') %> \
<% } %> \
<br/>\
<% if (tFloors != '') { %> \
<i class='toilet'></i> <%= i18n.t('map.infoWindow.toilet.exists') + ' ' + tFloors %> \
<% } else { %> \
<%= i18n.t('map.infoWindow.toilet.noexists') %> \
<% } %> \
<br/>\
<% if (hasEntrances === true) { %> \
<i class='entrance'></i> \
<a class='showRelated' data-related-by='building' data-related-types='entrance' href='javascript:;'><%= i18n.t('map.infoWindow.entrance.show') %></a> \
<a class='hideRelated' data-related-by='building' data-related-types='entrance' href='javascript:;'><%= i18n.t('map.infoWindow.entrance.hide') %></a> \
<% } else { %> \
<%= i18n.t('map.infoWindow.entrance.noexists') %> \
<% } %> \
");

JST['map/infoWindow'] = _.template(" \
<div id='info_window' class='iw'>\
  <h3><%= name %></h3>\
  <% if (itemText != null) { %>\
  <%= itemText  %>\
  <% } %> \
  <% if (model.get('type') === 'building'){ %> \
  <%= JST['map/infoWindow/building']({hasElevators: hasElevators, tFloors: tFloors, hasEntrances: hasEntrances}) %> \
  <% } %>\
  <% if (model.get('type') === 'auditorium' && model.get('handicapAdapted') === true) { %> \
  <i class='hearing_loop'></i> <%= i18n.t('map.infoWindow.hearing_loop.exists') %> \
  <% } else if (model.get('type') === 'auditorium') { %> \
  <%= i18n.t('map.infoWindow.hearing_loop.noexists') %> \
  <% } %> \
  <% if (displayDirections === true) { %> \
  <div id='directions' style='display: inline'> \
    <div data-i18n='map.infoWindow.directions'><%= i18n.t('map.infoWindow.directions') %>:</div> \
    <div id='travel_modes_div' class='dir-tm kd-buttonbar kd-button'> \
      <a class='kd-button kd-button-left dir-button' href='javascript:void(0)' id='walking' \
         title='<%= i18n.t('map.infoWindow.walking') %>'> \
        <img class='dir-tm-w' src='http://maps.gstatic.com/mapfiles/transparent.png'> \
      </a> \
      <a class='kd-button kd-button-mid dir-button' href='javascript:void(0)' id='bicycling' \
         title='<%= i18n.t('map.infoWindow.bicycling') %>'> \
        <img class='dir-tm-b' src='http://maps.gstatic.com/mapfiles/transparent.png'> \
      </a>\
      <a class='kd-button kd-button-mid dir-button' href='javascript:void(0)' id='publicTransp' \
         title='<%= i18n.t('map.infoWindow.publicTransit') %>'> \
        <img class='dir-tm-r' src='http://maps.gstatic.com/mapfiles/transparent.png'> \
      </a> \
      <a class='kd-button kd-button-right dir-button' href='javascript:void(0)' id='driving' \
         title='<%= i18n.t('map.infoWindow.car') %>'> \
        <img class='dir-tm-d' src='http://maps.gstatic.com/mapfiles/transparent.png'> \
      </a> \
    </div> \
  </div>\
  <% } %> \
</div> \
");
