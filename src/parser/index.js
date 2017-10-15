import parseXlsx from './xlsx-parser';

function parseFileExcelFile(file, lang, callback) {
  const reader = new FileReader();

  const type = file.type && file.type === 'text/csv' ? 'string' : 'binary';

  reader.onload = event =>
    parseXlsx(event.target.result, lang, type)
      .then(result => callback(result))
      .catch(error => callback(error));

  if (type === 'string') {
    reader.readAsText(file);
  } else {
    reader.readAsBinaryString(file);
  }
}


export default (htmlFile, lang) =>
  new Promise((resolve, reject) => {
    parseFileExcelFile(htmlFile, lang, (result) => {
      if (result.error) {
        return reject(result.error);
      }
      return resolve(result.worksheet);
    });
  });
