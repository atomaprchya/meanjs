(function () {
  'use strict';

  angular
    .module('organisations.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('organisations', {
        abstract: true,
        url: '/organisations',
        template: '<ui-view/>'
      })
      .state('organisations.list', {
        url: '',
        templateUrl: 'modules/organisations/client/views/list-organisations.client.view.html',
        controller: 'OrganisationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Organisations List'
        }
      })
      .state('organisations.create', {
        url: '/create',
        templateUrl: 'modules/organisations/client/views/form-organisation.client.view.html',
        controller: 'OrganisationsController',
        controllerAs: 'vm',
        resolve: {
          organisationResolve: newOrganisation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Organisations Create'
        }
      })
      .state('organisations.edit', {
        url: '/:organisationId/edit',
        templateUrl: 'modules/organisations/client/views/form-organisation.client.view.html',
        controller: 'OrganisationsController',
        controllerAs: 'vm',
        resolve: {
          organisationResolve: getOrganisation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Organisation {{ organisationResolve.title }}'
        }
      })
      .state('organisations.view', {
        url: '/:organisationId',
        templateUrl: 'modules/organisations/client/views/view-organisation.client.view.html',
        controller: 'OrganisationsController',
        controllerAs: 'vm',
        resolve: {
          organisationResolve: getOrganisation
        },
        data: {
          pageTitle: 'Organisation {{ organisationResolve.title }}'
        }
      });
  }

  getOrganisation.$inject = ['$stateParams', 'OrganisationsService'];

  function getOrganisation($stateParams, OrganisationsService) {
    return OrganisationsService.get({
      organisationId: $stateParams.organisationId
    }).$promise;
  }

  newOrganisation.$inject = ['OrganisationsService'];

  function newOrganisation(OrganisationsService) {
    return new OrganisationsService();
  }
}());
