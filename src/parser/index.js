import parseXlsx from './xlsx-parser';

function parseFileExcelFile(file, callback) {
  const reader = new FileReader();

  reader.onload = event =>
    parseXlsx(event.target.result)
    .then(data => callback({ data }))
    .catch(error => callback({ error }));

  reader.readAsBinaryString(file);
}


export default htmlFile =>
  new Promise((resolve, reject) => {
    parseFileExcelFile(htmlFile, (result) => {
      if (result.error) {
        reject(result.error);
      }
      resolve(result.data);
    });
  });
