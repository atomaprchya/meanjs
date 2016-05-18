(function () {
  'use strict';

  angular
    .module('organisations.services')
    .factory('OrganisationsService', OrganisationsService);

  OrganisationsService.$inject = ['$resource'];

  function OrganisationsService($resource) {
    return $resource('api/organisations/:organisationId', {
      organisationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
