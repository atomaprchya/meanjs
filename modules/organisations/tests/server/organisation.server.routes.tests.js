'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Organisation = mongoose.model('Organisation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  organisation;

/**
 * Organisation routes tests
 */
describe('Organisation CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new organisation
    user.save(function () {
      organisation = {
        title: 'Organisation Title',
        content: 'Organisation Content'
      };

      done();
    });
  });

  it('should be able to save an organisation if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new organisation
        agent.post('/api/organisations')
          .send(organisation)
          .expect(200)
          .end(function (organisationSaveErr, organisationSaveRes) {
            // Handle organisation save error
            if (organisationSaveErr) {
              return done(organisationSaveErr);
            }

            // Get a list of organisations
            agent.get('/api/organisations')
              .end(function (organisationsGetErr, organisationsGetRes) {
                // Handle organisation save error
                if (organisationsGetErr) {
                  return done(organisationsGetErr);
                }

                // Get organisations list
                var organisations = organisationsGetRes.body;

                // Set assertions
                (organisations[0].user._id).should.equal(userId);
                (organisations[0].title).should.match('Organisation Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an organisation if not logged in', function (done) {
    agent.post('/api/organisations')
      .send(organisation)
      .expect(403)
      .end(function (organisationSaveErr, organisationSaveRes) {
        // Call the assertion callback
        done(organisationSaveErr);
      });
  });

  it('should not be able to save an organisation if no title is provided', function (done) {
    // Invalidate title field
    organisation.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new organisation
        agent.post('/api/organisations')
          .send(organisation)
          .expect(400)
          .end(function (organisationSaveErr, organisationSaveRes) {
            // Set message assertion
            (organisationSaveRes.body.message).should.match('Title cannot be blank');

            // Handle organisation save error
            done(organisationSaveErr);
          });
      });
  });

  it('should be able to update an organisation if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new organisation
        agent.post('/api/organisations')
          .send(organisation)
          .expect(200)
          .end(function (organisationSaveErr, organisationSaveRes) {
            // Handle organisation save error
            if (organisationSaveErr) {
              return done(organisationSaveErr);
            }

            // Update organisation title
            organisation.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing organisation
            agent.put('/api/organisations/' + organisationSaveRes.body._id)
              .send(organisation)
              .expect(200)
              .end(function (organisationUpdateErr, organisationUpdateRes) {
                // Handle organisation update error
                if (organisationUpdateErr) {
                  return done(organisationUpdateErr);
                }

                // Set assertions
                (organisationUpdateRes.body._id).should.equal(organisationSaveRes.body._id);
                (organisationUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of organisations if not signed in', function (done) {
    // Create new organisation model instance
    var organisationObj = new Organisation(organisation);

    // Save the organisation
    organisationObj.save(function () {
      // Request organisations
      request(app).get('/api/organisations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single organisation if not signed in', function (done) {
    // Create new organisation model instance
    var organisationObj = new Organisation(organisation);

    // Save the organisation
    organisationObj.save(function () {
      request(app).get('/api/organisations/' + organisationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', organisation.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single organisation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/organisations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Organisation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single organisation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent organisation
    request(app).get('/api/organisations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No organisation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an organisation if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new organisation
        agent.post('/api/organisations')
          .send(organisation)
          .expect(200)
          .end(function (organisationSaveErr, organisationSaveRes) {
            // Handle organisation save error
            if (organisationSaveErr) {
              return done(organisationSaveErr);
            }

            // Delete an existing organisation
            agent.delete('/api/organisations/' + organisationSaveRes.body._id)
              .send(organisation)
              .expect(200)
              .end(function (organisationDeleteErr, organisationDeleteRes) {
                // Handle organisation error error
                if (organisationDeleteErr) {
                  return done(organisationDeleteErr);
                }

                // Set assertions
                (organisationDeleteRes.body._id).should.equal(organisationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an organisation if not signed in', function (done) {
    // Set organisation user
    organisation.user = user;

    // Create new organisation model instance
    var organisationObj = new Organisation(organisation);

    // Save the organisation
    organisationObj.save(function () {
      // Try deleting organisation
      request(app).delete('/api/organisations/' + organisationObj._id)
        .expect(403)
        .end(function (organisationDeleteErr, organisationDeleteRes) {
          // Set message assertion
          (organisationDeleteRes.body.message).should.match('User is not authorized');

          // Handle organisation error error
          done(organisationDeleteErr);
        });

    });
  });

  it('should be able to get a single organisation that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new organisation
          agent.post('/api/organisations')
            .send(organisation)
            .expect(200)
            .end(function (organisationSaveErr, organisationSaveRes) {
              // Handle organisation save error
              if (organisationSaveErr) {
                return done(organisationSaveErr);
              }

              // Set assertions on new organisation
              (organisationSaveRes.body.title).should.equal(organisation.title);
              should.exist(organisationSaveRes.body.user);
              should.equal(organisationSaveRes.body.user._id, orphanId);

              // force the organisation to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the organisation
                    agent.get('/api/organisations/' + organisationSaveRes.body._id)
                      .expect(200)
                      .end(function (organisationInfoErr, organisationInfoRes) {
                        // Handle organisation error
                        if (organisationInfoErr) {
                          return done(organisationInfoErr);
                        }

                        // Set assertions
                        (organisationInfoRes.body._id).should.equal(organisationSaveRes.body._id);
                        (organisationInfoRes.body.title).should.equal(organisation.title);
                        should.equal(organisationInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single organisation if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new organisation model instance
    organisation.user = user;
    var organisationObj = new Organisation(organisation);

    // Save the organisation
    organisationObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new organisation
          agent.post('/api/organisations')
            .send(organisation)
            .expect(200)
            .end(function (organisationSaveErr, organisationSaveRes) {
              // Handle organisation save error
              if (organisationSaveErr) {
                return done(organisationSaveErr);
              }

              // Get the organisation
              agent.get('/api/organisations/' + organisationSaveRes.body._id)
                .expect(200)
                .end(function (organisationInfoErr, organisationInfoRes) {
                  // Handle organisation error
                  if (organisationInfoErr) {
                    return done(organisationInfoErr);
                  }

                  // Set assertions
                  (organisationInfoRes.body._id).should.equal(organisationSaveRes.body._id);
                  (organisationInfoRes.body.title).should.equal(organisation.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (organisationInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single organisation if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new organisation model instance
    var organisationObj = new Organisation(organisation);

    // Save the organisation
    organisationObj.save(function () {
      request(app).get('/api/organisations/' + organisationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', organisation.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single organisation, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Organisation
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new organisation
          agent.post('/api/organisations')
            .send(organisation)
            .expect(200)
            .end(function (organisationSaveErr, organisationSaveRes) {
              // Handle organisation save error
              if (organisationSaveErr) {
                return done(organisationSaveErr);
              }

              // Set assertions on new organisation
              (organisationSaveRes.body.title).should.equal(organisation.title);
              should.exist(organisationSaveRes.body.user);
              should.equal(organisationSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the organisation
                  agent.get('/api/organisations/' + organisationSaveRes.body._id)
                    .expect(200)
                    .end(function (organisationInfoErr, organisationInfoRes) {
                      // Handle organisation error
                      if (organisationInfoErr) {
                        return done(organisationInfoErr);
                      }

                      // Set assertions
                      (organisationInfoRes.body._id).should.equal(organisationSaveRes.body._id);
                      (organisationInfoRes.body.title).should.equal(organisation.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (organisationInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Organisation.remove().exec(done);
    });
  });
});
