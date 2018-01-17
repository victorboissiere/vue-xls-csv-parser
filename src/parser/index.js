import parseXlsx from './xlsx-parser';

function parseFileExcelFile(file, lang, callback) {
  const reader = new FileReader();

  reader.onload = event =>
    parseXlsx(event.target.result, lang)
    .then(result => callback(result))
    .catch(error => callback(error));

  if (file.type === 'text/csv') {
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
