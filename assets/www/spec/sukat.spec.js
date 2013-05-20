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

describe('Person model', function () {
  describe('when creating an empty person', function () {
    beforeEach(function () {
      this.person = new Person();
    });

    it('should have givenName Unknown', function () {
      expect(this.person.get('givenName')).toEqual("Unknown");
    });

    it('should have sn Unknown', function () {
      expect(this.person.get('sn')).toEqual("Unknown");
    });

    it('should have displayName Unknown', function () {
      expect(this.person.get('displayName')).toEqual("Unknown");
    });

    it('should have no mail address', function () {
      expect(this.person.get('mail')).toEqual("");
    });

    it('should have telephoneNumber as the phone exchange number', function () {
      expect(this.person.get('telephoneNumber')).toEqual("+468162000");
    });
  });
});

describe('Person collection', function () {
  describe('creating an empty collection', function () {
    beforeEach(function () {
      this.persons = new Persons();
    });

    it('should have Person for model', function () {
      expect(this.persons.model).toBe(Person);
    });

    it('should have a url pointing at broker geo api', function () {
      expect(this.persons.url()).toMatch(/http:\/\/.+\.su\.se\/sukat\/.+/);
    });
  });

  describe('fetching a collection of persons', function () {
    beforeEach(function () {
      this.persons = new Persons();
      this.fixture = this.fixtures.Persons.valid;

      this.server = sinon.fakeServer.create();
      this.server.respondWith(
          "GET",
          this.persons.url(),
          this.validResponse(this.fixture)
      );
    });

    afterEach(function () {
      this.server.restore();
    });

    it('should make a correct request', function () {
      this.persons.fetch({reset: true});
      expect(this.server.requests.length).toEqual(1);
      expect(this.server.requests[0].method).toEqual("GET");
      expect(this.server.requests[0].url).toMatch(/.*\/search/);
    });

    it('should return all persons', function () {
      this.persons.fetch({reset: true});
      this.server.respond();
      expect(this.persons.length).toEqual(2);
    });

    it('should override defaults', function () {
      this.persons.fetch({reset: true});
      this.server.respond();
      var firstPerson = this.persons.get("test1");
      expect(firstPerson.get('id')).toEqual("test1");
      expect(firstPerson.get('uid')).toEqual('test1');
      expect(firstPerson.get('displayName')).toEqual('Test1 Räksmörgås');
      expect(firstPerson.get('mail')).toEqual('test1@su.se');
      expect(firstPerson.get('telephoneNumber')).toEqual('foobar');
      expect(firstPerson.get('sn')).toEqual('Räksmörgås');
      expect(firstPerson.get('cn')).toEqual('Test1 Räksmörgås');
      expect(firstPerson.get('givenName')).toEqual('Test1');
      expect(firstPerson.get('eduPersonPrincipalName')).toEqual('test1@su.se');
    });
  });
});

describe('Search view', function () {
  beforeEach(function () {
    $('#stage').replaceWith("<div id='search-page'><div id='search_view'></div></div>");

    this.view = new SukatSearchView({el: $('#search_view')});
  });

  afterEach(function () {
    $('#search-page').replaceWith("<div id='stage'></div>");
  });

  describe('instantiation', function () {
    it('should create a div of #search_view', function () {
      expect(this.view.el.nodeName).toEqual("DIV");
      expect(this.view.el.id).toEqual("search_view");
    });
  });
});
