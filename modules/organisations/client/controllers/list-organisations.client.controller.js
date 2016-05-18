(function () {
  'use strict';

  angular
    .module('organisations')
    .controller('OrganisationsListController', OrganisationsListController);

  OrganisationsListController.$inject = ['OrganisationsService'];

  function OrganisationsListController(OrganisationsService) {
    var vm = this;

    vm.organisations = OrganisationsService.query();
  }
}());
