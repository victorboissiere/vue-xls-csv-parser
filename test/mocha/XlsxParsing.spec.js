const _ = require('lodash');
const expect = require('chai').expect;
const parseXlsxFile = require('../../src/parser/xlsx-parser').default;

describe('XLSX parsing', () => {
  const tests = [
    {
      filename: 'simple',
      columnNumber: 5,
      rowNumber: 4,
    },
  ];
  tests.forEach((test) => {
    it(`test file ${test.filename}`, () =>
      parseXlsxFile(`./test/mocha/data/xlsx/${test.filename}.xlsx`).then(({ data }) => {
        const columns = _.keys(data);
        expect(columns).to.have.lengthOf(test.columnNumber);
        _.forEach(data, (row) => {
          expect(row).to.have.lengthOf(test.rowNumber);
        });
      }));
  });
});
