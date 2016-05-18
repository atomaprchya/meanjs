(function (app) {
  'use strict';

  app.registerModule('organisations', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('organisations.services');
  app.registerModule('organisations.routes', ['ui.router', 'core.routes', 'organisations.services']);
}(ApplicationConfiguration));
