import _ from 'lodash';
import XLSX from 'xlsx';

export default (file) => {
  const workbook = typeof require !== 'undefined' ? XLSX.readFile(file) : XLSX.read(file, { type: 'binary' });
  const sheetNames = workbook.SheetNames;
  if (sheetNames.length === 0) {
    return Promise.reject({ error: 'Must have at least one worksheet' });
  }
  const sheets = workbook.Sheets;
  const json = XLSX.utils.sheet_to_json(sheets[sheetNames[0]], {
    header: 1,
    defVal: '',
  });

// Array can be [0, 1, 2, 3, 4] with indexes like [0, 1, 5, 6, 7] (array[5] = 2)
  const rowWithMaxColNumber = _.maxBy(json, row => _.findLastKey(row));
  const maxColumnNumber = _.findLastKey(rowWithMaxColNumber);
  const outputKeys = _.range(0, maxColumnNumber);
// Array with 0,1,2,3 as index and empty array as value
  const normalizedOutput = _.zipObject(outputKeys, outputKeys.map(() => []));

  json.forEach((row) => {
    for (let i = 0; i < maxColumnNumber; i += 1) {
      normalizedOutput[i].push(row[i]);
    }
  });

  const normalizedOutputWithoutEmptyColumns = _.pickBy(
    normalizedOutput, rows => !_.every(rows, row => row === undefined),
  );

  return Promise.resolve({ data: normalizedOutputWithoutEmptyColumns });
};
