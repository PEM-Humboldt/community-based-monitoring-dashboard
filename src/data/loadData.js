import Papa from 'papaparse';
import regLluviaCsv from 'url:./registros_lluvia.csv';
import disturbiosCsv from 'url:./disturbios.csv';

const graphData = {
  reg_diarios: regLluviaCsv,
  disturbios: disturbiosCsv,
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

const processDisturbios = (rawData) => {
  const result = { values: [], labels: [] };
  rawData.forEach((row) => {
    result.values.push(row.disturbio_n);
    result.labels.push(row.disturbio_categ_lab);
  });
  return result;
};

const graphProcess = {
  reg_diarios: processRegLluvia,
  disturbios: processDisturbios,
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
