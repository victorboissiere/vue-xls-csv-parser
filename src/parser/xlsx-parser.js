import _ from 'lodash';
import XLSX from 'xlsx';

export default (file, lang) => {
  const workbook = typeof window === 'undefined' ? XLSX.readFile(file) : XLSX.read(file, { type: 'binary' });
  const sheetNames = workbook.SheetNames;
  if (sheetNames.length === 0) {
    return Promise.reject({ error: lang.error.noWorksheet });
  }
  const sheets = workbook.Sheets;
  const json = XLSX.utils.sheet_to_json(sheets[sheetNames[0]], {
    header: 1,
    defVal: '',
    blankrows: false,
  });

  if (json.length === 0) {
    return Promise.reject({ error: lang.error.emptyWorksheet });
  }

  const transposedMatrix = _.unzip(json);
  const normalizedOutput = transposedMatrix
    .map(columnRows => ({
      name: _.first(columnRows),
      data: _.tail(columnRows),
    }))
    .filter(column => column.data.length === 0 || !column.data.every(data => data === undefined));

  return Promise.resolve({ worksheet: normalizedOutput });
};
