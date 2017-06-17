import _ from 'lodash';
import XLSX from 'xlsx';

export default (file) => {
  const workbook = typeof window === 'undefined' ? XLSX.readFile(file) : XLSX.read(file, { type: 'binary' });
  const sheetNames = workbook.SheetNames;
  if (sheetNames.length === 0) {
    return Promise.reject({ error: 'Must have at least one worksheet' });
  }
  const sheets = workbook.Sheets;
  const json = XLSX.utils.sheet_to_json(sheets[sheetNames[0]], {
    header: 1,
    defVal: '',
    blankrows: false,
  });

  if (json.length === 0) {
    return Promise.reject({ error: 'The worksheet is empty' });
  }

  const transposedMatrix = _.unzip(json);
  const normalizedOutput = transposedMatrix
    .map(columnRows => ({
      name: _.first(columnRows),
      data: _.tail(columnRows),
    }))
    .filter(column => column.data.length === 0 || !column.data.every(data => data === undefined));

  const hasUndefinedValues = _.some(normalizedOutput,
    column => _.some(column.data, data => data === undefined));

  if (hasUndefinedValues) {
    return Promise.reject({ error: 'File has some undefined values' });
  }

  return Promise.resolve({ worksheet: normalizedOutput });
};
