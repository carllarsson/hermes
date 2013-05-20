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

$(document).on('deviceready', function () {
  window.gaPlugin = window.plugins.gaPlugin;
  gaPlugin.init(
      null, /* suppress success */
      null, /* suppress errors */
      config.core.ga.account,
      10 // Seconds between sending stats.
  );
});

/*
 * Default handling of generic header triggered by data-header attribute
 */
$(document).on('pagecreate', '[data-role="page"][data-header]', function () {
  var $this = $(this),
      headerTemplate = $this.data("header"),
      headerOptions = $this.data("header-options") || "",
      optionsArr = headerOptions.split(" ");

  var attrs = {
    "data-theme": "a",
    "data-role": "header"
  };
  if (optionsArr.indexOf("notfixed") < 0) {
    attrs["data-position"] = "fixed";
  }

  var templateData = _.inject(optionsArr, function (memo, option) {
    memo[option] = true;
    return memo;
  }, {
    title: $this.data('header-title') || ($(document).attr('title') || 'Titel saknas'),
    backbutton: false,
    menubutton: false,
    homebutton: false
  });

  var addClass = templateData.menubutton || templateData.homebutton || templateData.backbutton ? "" : "nobuttons";

  $this.find('[data-role="header"]').remove();

  $('<div></div>').attr(attrs).prependTo(this).html(function () {
    return JST[headerTemplate](templateData);
  }).addClass(addClass);

});

/*
 * Default handling of external link by target=_blank attribute
 */
$(document).on("click", "a[target=_blank][data-rel!=external]", function (event) {
  event.preventDefault();

  var href = $(this).attr("href");

  var $externalLinkDialog = $('#external-link-dialog');
  $externalLinkDialog.remove();

  $externalLinkDialog = $('<div id="external-link-dialog" data-role="popup" data-theme="a" data-overlay-theme="a"></div>').html(JST["common/external-link-dialog"]({
    href: href
  })).appendTo('body');

  $('#external-link-dialog').i18n();

  $externalLinkDialog.find("a[target=_system]").click(function (event) {
    event.preventDefault();
    window.open(href, '_system');
    $externalLinkDialog.popup('close');
  });

  $externalLinkDialog.popup();
  $externalLinkDialog.trigger('create');
  $externalLinkDialog.popup('open');
});

/*
 * Handles suppression of 300ms delay on click event
 */

$(document).ready(function () {
  FastClick.attach(document.body);
});
