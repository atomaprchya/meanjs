'use strict';

describe('Organisations E2E Tests:', function () {
  describe('Test organisations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/organisations');
      expect(element.all(by.repeater('organisation in organisations')).count()).toEqual(0);
    });
  });
});
