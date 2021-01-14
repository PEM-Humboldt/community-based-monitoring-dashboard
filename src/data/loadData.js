import Papa from 'papaparse';
import regLluviaCsv from 'url:./registros_lluvia.csv';
import disturbiosCsv from 'url:./disturbios.csv';
import habCrecimientoCsv from 'url:./habito_crecimiento.csv';
import fenologiaCsv from 'url:./fenologia.csv';

const graphData = {
  reg_diarios: regLluviaCsv,
  disturbios: disturbiosCsv,
  habito_crecimiento: habCrecimientoCsv,
  fenologia1: fenologiaCsv,
  fenologia2: fenologiaCsv,
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

const processHabCrecimiento = (rawData) => {
  const bars = {};
  rawData.forEach((row) => {
    if (!bars[row.habito_de_crecimiento_categ_lab]) {
      bars[row.habito_de_crecimiento_categ_lab] = { x: [], y: [] };
    }
    bars[row.habito_de_crecimiento_categ_lab].x.push(row.fecha_id);
    bars[row.habito_de_crecimiento_categ_lab].y.push(
      parseFloat(row.habito_de_crecimiento_prop.replace(/,/g, '.'))
    );
  });
  return bars;
};

const processFenologia1 = (rawData) => {
  const charts = {
    Fruto: {},
    Flor: {},
    Hoja: {},
  };
  const precipitacion = { prom: {}, err: {} };
  rawData.forEach((row) => {
    const {
      parte,
      parte_categ: parteCat,
      fecha_id: fecha,
      valor_prom: prom,
      valor_std: std,
      precipitacion_prom: precProm,
      precipitacion_std: precStd,
    } = row;
    if (!charts[parte][parteCat]) {
      charts[parte][parteCat] = { x: [], y: [], err: [] };
    }
    charts[parte][parteCat].x.push(fecha);
    charts[parte][parteCat].y.push(prom);
    charts[parte][parteCat].err.push(parseFloat(std.replace(/,/g, '.')));
    precipitacion.prom[fecha] = precProm;
    precipitacion.err[fecha] = precStd;
  });
  charts.precipitacion = { x: [], y: [], err: [] };
  Object.keys(precipitacion.prom).forEach((date) => {
    charts.precipitacion.x.push(date);
    charts.precipitacion.y.push(
      parseFloat(precipitacion.prom[date].replace(/,/g, '.'))
    );
    charts.precipitacion.err.push(
      parseFloat(precipitacion.err[date].replace(/,/g, '.'))
    );
  });
  return charts;
};

const processFenologia2 = (rawData) => {
  const charts = {
    Fruto: {},
    Flor: {},
    Hoja: {},
  };
  const precipitacion = {
    min: {},
    max: {},
  };
  rawData.forEach((row) => {
    const {
      parte,
      parte_categ: parteCat,
      fecha_id: fecha,
      valor_min: vMin,
      valor_max: vMax,
      precipitacion_min: pMin,
      precipitacion_max: pMax,
    } = row;
    if (!charts[parte][parteCat]) {
      charts[parte][parteCat] = {
        min: {
          x: [],
          y: [],
          err: [],
        },
        max: {
          x: [],
          y: [],
          err: [],
        },
      };
    }
    charts[parte][parteCat].min.x.push(fecha);
    charts[parte][parteCat].min.y.push(vMin);
    charts[parte][parteCat].max.x.push(fecha);
    charts[parte][parteCat].max.y.push(vMax);
    precipitacion.min[fecha] = pMin;
    precipitacion.max[fecha] = pMax;
  });
  charts.precipitacion = {
    min: {
      x: [],
      y: [],
    },
    max: {
      x: [],
      y: [],
    },
  };
  Object.keys(precipitacion.min).forEach((date) => {
    charts.precipitacion.min.x.push(date);
    charts.precipitacion.min.y.push(
      parseFloat(precipitacion.min[date].replace(/,/g, '.'))
    );
    charts.precipitacion.max.x.push(date);
    charts.precipitacion.max.y.push(
      parseFloat(precipitacion.max[date].replace(/,/g, '.'))
    );
  });
  return charts;
};

const graphProcess = {
  reg_diarios: processRegLluvia,
  disturbios: processDisturbios,
  habito_crecimiento: processHabCrecimiento,
  fenologia1: processFenologia1,
  fenologia2: processFenologia2,
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
