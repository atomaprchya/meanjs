(function () {
  'use strict';

  describe('Organisations Route Tests', function () {
    // Initialize global variables
    var $scope,
      OrganisationsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OrganisationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OrganisationsService = _OrganisationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('organisations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/organisations');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('organisations.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/organisations/client/views/list-organisations.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          OrganisationsController,
          mockOrganisation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('organisations.view');
          $templateCache.put('modules/organisations/client/views/view-organisation.client.view.html', '');

          // create mock organisation
          mockOrganisation = new OrganisationsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Organisation about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          OrganisationsController = $controller('OrganisationsController as vm', {
            $scope: $scope,
            organisationResolve: mockOrganisation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:organisationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.organisationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            organisationId: 1
          })).toEqual('/organisations/1');
        }));

        it('should attach an organisation to the controller scope', function () {
          expect($scope.vm.organisation._id).toBe(mockOrganisation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/organisations/client/views/view-organisation.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OrganisationsController,
          mockOrganisation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('organisations.create');
          $templateCache.put('modules/organisations/client/views/form-organisation.client.view.html', '');

          // create mock organisation
          mockOrganisation = new OrganisationsService();

          // Initialize Controller
          OrganisationsController = $controller('OrganisationsController as vm', {
            $scope: $scope,
            organisationResolve: mockOrganisation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.organisationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/organisations/create');
        }));

        it('should attach an organisation to the controller scope', function () {
          expect($scope.vm.organisation._id).toBe(mockOrganisation._id);
          expect($scope.vm.organisation._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/organisations/client/views/form-organisation.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OrganisationsController,
          mockOrganisation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('organisations.edit');
          $templateCache.put('modules/organisations/client/views/form-organisation.client.view.html', '');

          // create mock organisation
          mockOrganisation = new OrganisationsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Organisation about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          OrganisationsController = $controller('OrganisationsController as vm', {
            $scope: $scope,
            organisationResolve: mockOrganisation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:organisationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.organisationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            organisationId: 1
          })).toEqual('/organisations/1/edit');
        }));

        it('should attach an organisation to the controller scope', function () {
          expect($scope.vm.organisation._id).toBe(mockOrganisation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/organisations/client/views/form-organisation.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('organisations.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('organisations/');
          $rootScope.$digest();

          expect($location.path()).toBe('/organisations');
          expect($state.current.templateUrl).toBe('modules/organisations/client/views/list-organisations.client.view.html');
        }));
      });

    });
  });
}());
