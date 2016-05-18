'use strict';

/**
 * Module dependencies
 */
var organisationsPolicy = require('../policies/organisations.server.policy'),
  organisations = require('../controllers/organisations.server.controller');

module.exports = function (app) {
  // Organisations collection routes
  app.route('/api/organisations').all(organisationsPolicy.isAllowed)
    .get(organisations.list)
    .post(organisations.create);

  // Single organisation routes
  app.route('/api/organisations/:organisationId').all(organisationsPolicy.isAllowed)
    .get(organisations.read)
    .put(organisations.update)
    .delete(organisations.delete);

  // Finish by binding the organisation middleware
  app.param('organisationId', organisations.organisationByID);
};
