'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Organisation = mongoose.model('Organisation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an organisation
 */
exports.create = function (req, res) {
  var organisation = new Organisation(req.body);
  organisation.user = req.user;

  organisation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(organisation);
    }
  });
};

/**
 * Show the current organisation
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var organisation = req.organisation ? req.organisation.toJSON() : {};

  // Add a custom field to the Organisation, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Organisation model.
  organisation.isCurrentUserOwner = !!(req.user && organisation.user && organisation.user._id.toString() === req.user._id.toString());

  res.json(organisation);
};

/**
 * Update an organisation
 */
exports.update = function (req, res) {
  var organisation = req.organisation;

  organisation.title = req.body.title;
  organisation.content = req.body.content;

  organisation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(organisation);
    }
  });
};

/**
 * Delete an organisation
 */
exports.delete = function (req, res) {
  var organisation = req.organisation;

  organisation.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(organisation);
    }
  });
};

/**
 * List of Organisations
 */
exports.list = function (req, res) {
  Organisation.find().sort('-created').populate('user', 'displayName').exec(function (err, organisations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(organisations);
    }
  });
};

/**
 * Organisation middleware
 */
exports.organisationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Organisation is invalid'
    });
  }

  Organisation.findById(id).populate('user', 'displayName').exec(function (err, organisation) {
    if (err) {
      return next(err);
    } else if (!organisation) {
      return res.status(404).send({
        message: 'No organisation with that identifier has been found'
      });
    }
    req.organisation = organisation;
    next();
  });
};
