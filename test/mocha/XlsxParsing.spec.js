const _ = require('lodash');
const expect = require('chai').expect;
const parseXlsxFile = require('../../src/parser/xlsx-parser').default;

describe('XLSX parsing', () => {
  const tests = [
    {
      filename: 'simple',
      description: 'Simple file',
      columnNumber: 2,
      rowNumber: 3,
    },
    {
      filename: 'empty_column',
      description: 'Empty column',
      columnNumber: 2,
      rowNumber: 3,
    },
    {
      filename: 'empty_row',
      description: 'Empty row and empty column',
      columnNumber: 2,
      rowNumber: 2,
    },
    {
      filename: 'merged_cell',
      description: 'Merged cell',
      columnNumber: 2,
      rowNumber: 2,
    },
    {
      filename: 'cheese',
      description: 'Test uneven file',
      errorMessage: 'File has some undefined values',
    },
  ];
  tests.forEach((test) => {
    it(test.description, () =>
      parseXlsxFile(`./test/mocha/data/xlsx/${test.filename}.xlsx`).then(({ worksheet }) => {
        expect(test).to.not.have.key('errorMessage');
        expect(worksheet).to.be.an('array');
        expect(worksheet).to.have.lengthOf(test.columnNumber, 'Wrong number of columns');
        worksheet.forEach((column) => {
          expect(column).to.be.an('object');
          expect(column).to.have.key('name', 'data');
          expect(column.data).to.have.lengthOf(test.rowNumber, 'Wrong number of rows');
        });
      }).catch(({ error }) => {
        if (!_.has(test, 'errorMessage')) {
          throw new Error('Should not have failed with error : ', errorMessage);
        } else if (error) {
          expect(error).to.equals(test.errorMessage);
        }
      }));
  });
});
