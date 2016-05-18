(function () {
  'use strict';

  angular
    .module('organisations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Organisations',
      state: 'organisations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'organisations', {
      title: 'List Organisations',
      state: 'organisations.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'organisations', {
      title: 'Create Organisation',
      state: 'organisations.create',
      roles: ['user']
    });
  }
}());
