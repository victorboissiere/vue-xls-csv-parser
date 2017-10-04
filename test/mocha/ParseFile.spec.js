const _ = require('lodash');
const expect = require('chai').expect;
const parseXlsxFile = require('../../src/parser/xlsx-parser').default;
const lang = require('../../src/lang').default;

describe('File parsing', () => {
  const xlsxTests = [
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
  ];

  const csvTests = [
    {
      filename: 'simple',
      description: 'Simple',
      columnNumber: 3,
      rowNumber: 2,
    },
    {
      filename: 'empty_file',
      description: 'Empty file',
      columnNumber: 0,
      rowNumber: 0,
      errorMessage: 'The worksheet is empty',
    },
    {
      filename: 'only_headers',
      description: 'File with no rows and only headers',
      columnNumber: 3,
      rowNumber: 0,
    },
  ];

  const runTests = (tests, directory, extension) => tests.forEach((test) => {
    it(`[${directory}] ${test.description}`, () =>
      parseXlsxFile(`./test/mocha/data/${directory}/${test.filename}.${extension}`, lang.en).then(({ worksheet }) => {
        expect(test).to.not.have.key('errorMessage');
        expect(worksheet).to.be.an('array');
        expect(worksheet).to.have.lengthOf(test.columnNumber, 'Wrong number of columns');
        worksheet.forEach((column) => {
          expect(column).to.be.an('object');
          expect(column).to.have.key('name', 'data');
          expect(column.data).to.have.lengthOf(test.rowNumber, 'Wrong number of rows');
        });
      }).catch((errorData) => {
        if (!_.has(test, 'errorMessage')) {
          throw new Error(`Should not ave failed with error : ${errorData}`);
        } else {
          expect(errorData.error).to.equals(test.errorMessage);
        }
      }));
  });

  runTests(xlsxTests, 'xlsx', 'xlsx');
  runTests(csvTests, 'csv', 'csv');
});
