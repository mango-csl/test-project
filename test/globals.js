'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

global.assert = chai.assert;
global.expect = chai.expect;
global.srcPath = '../../experiment/promise-pending';
// global.srcPath = process.env.TEST_LIB ? '../../experiment/promise-pending' : '../../src';

// see: https://github.com/domenic/chai-as-promised/issues/173
process.on('unhandledRejection', () => {
});
