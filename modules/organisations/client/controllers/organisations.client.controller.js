(function () {
  'use strict';

  angular
    .module('organisations')
    .controller('OrganisationsController', OrganisationsController);

  OrganisationsController.$inject = ['$scope', '$state', 'organisationResolve', '$window', 'Authentication'];

  function OrganisationsController($scope, $state, organisation, $window, Authentication) {
    var vm = this;

    vm.organisation = organisation;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Organisation
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.organisation.$remove($state.go('organisations.list'));
      }
    }

    // Save Organisation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.organisationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.organisation._id) {
        vm.organisation.$update(successCallback, errorCallback);
      } else {
        vm.organisation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('organisations.view', {
          organisationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
