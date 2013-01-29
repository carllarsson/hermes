describe('Person model', function () {
  describe('when creating an empty person', function () {
    beforeEach(function () {
      var self = this;
      var done = false;

      require(['sukat/js/models/personmodel'], function (Person) {
        self.person = new Person.Model();
        done = true;
      });

      waitsFor(function () {
        return done;
      }, "Create Models");
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
      var self = this;
      var done = false;

      require(['sukat/js/models/personmodel'], function (Person) {
        self.persons = new Person.Collection();
        self.personModel = Person.Model;
        done = true;
      });

      waitsFor(function () {
        return done;
      }, "Create Models");
    });

    it('should have Person for model', function () {
      expect(this.persons.model).toBe(this.personModel);
    });

    it('should have a url pointing at broker geo api', function () {
      expect(this.persons.url()).toMatch(/http:\/\/.+\.su\.se\/sukat\/.+/);
    });
  });

  describe('fetching a collection of persons', function () {
    beforeEach(function () {
      var self = this;
      var done = false;

      require([
        'sukat/js/models/personmodel',
        'fixtures/persons'
      ], function (Person, Fixtures) {
        self.persons = new Person.Collection();
        self.fixture = Fixtures.valid;
        done = true;
      });

      waitsFor(function () {
        return done;
      }, "Create Fixtures");

      runs(function () {
        this.server = sinon.fakeServer.create();
        this.server.respondWith(
            "GET",
            this.persons.url(),
            this.validResponse(this.fixture)
        );
      });
    });

    afterEach(function () {
      this.server.restore();
    });

    it('should make a correct request', function () {
      this.persons.fetch();
      expect(this.server.requests.length).toEqual(1);
      expect(this.server.requests[0].method).toEqual("GET");
      expect(this.server.requests[0].url).toMatch(/.*\/search/);
    });

    it('should return all persons', function () {
      this.persons.fetch();
      this.server.respond();
      expect(this.persons.length).toEqual(2);
    });

    it('should override defaults', function () {
      this.persons.fetch();
      this.server.respond();
      var firstPerson = this.persons.get("test1");
      expect(firstPerson.get('id')).toEqual("test1");
      expect(firstPerson.get('uid')).toEqual('test1');
      expect(firstPerson.get('displayName')).toEqual('Test1 Räksmörgås');
      expect(firstPerson.get('mail')).toEqual('test1@su.se');
      expect(firstPerson.get('telephoneNumber')).toEqual('+468162000');
      expect(firstPerson.get('sn')).toEqual('Räksmörgås');
      expect(firstPerson.get('cn')).toEqual('Test1 Räksmörgås');
      expect(firstPerson.get('givenName')).toEqual('Test1');
      expect(firstPerson.get('eduPersonPrincipalName')).toEqual('test1@su.se');
    });
  });
});

describe('Search view', function () {
  beforeEach(function () {
    var self = this;
    var done = false;

    this.origBody = $('body').html;
    $('body').append("<div id='page-search'><div id='search_view'></div></div>");

    require(['sukat/js/views/app-view'], function (AppView) {
      self.view = new AppView({el:$('#search_view')});
      done = true;
    });

    waitsFor(function () {
      return done;
    }, "Create Views");
  });

  afterEach(function () {
    $('body').html = this.origBody;
  });

  describe('instantiation', function () {
    it('should create a div of #search_view', function () {
      expect(this.view.el.nodeName).toEqual("DIV");
      expect(this.view.el.id).toEqual("search_view");
    });
  });
});
