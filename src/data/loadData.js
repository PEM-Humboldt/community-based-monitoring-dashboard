import Papa from 'papaparse';
import regLluviaCsv from 'url:./registros_lluvia.csv';

const graphData = {
  reg_diarios: regLluviaCsv,
};

const processRegLluvia = (rawData) => {
  const lines = {};
  rawData.forEach((row) => {
    if (!lines[row.vereda_name]) lines[row.vereda_name] = { x: [], y: [] };
    lines[row.vereda_name].x.push(row.fecha_id);
    lines[row.vereda_name].y.push(row.precipitacion);
  });
  return lines;
};

const graphProcess = {
  reg_diarios: processRegLluvia,
};

const loadCsv = (graphName) => {
  const csvFile = graphData[graphName];
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          return reject(errors.reduce((acc, cv) => acc + cv.message, ''));
        }
        return resolve(graphProcess[graphName](data));
      },
      error: reject,
    });
  });
};

export default loadCsv;
