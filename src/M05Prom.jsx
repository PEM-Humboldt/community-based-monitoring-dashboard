import Plot from 'react-plotly.js';
import React, { useState, useEffect } from 'react';

import loadCsv from './data/loadData';

const M05Prom = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => setData(await loadCsv('fenologia1'));
    getData();
  }, []);

  return (
    <div id="05_medicion_floracion_fructificacion_interaccion">
      <h2>M05 - Medición floración, fructificación e interacción</h2>
      <h3>Relación de periodos de floración y fructificación con lluvias</h3>
      <div id="fenologia">
        {!data ? (
          'cargando...'
        ) : (
          <Plot
            data={Object.keys(data.Flor)
              .map((name) => ({
                x: data.Flor[name].x,
                y: data.Flor[name].y,
                name,
                error_y: {
                  type: 'data',
                  array: data.Flor[name].err,
                  visible: true,
                },
                type: 'scatter',
              }))
              .concat([
                {
                  x: data.precipitacion.x,
                  y: data.precipitacion.y,
                  name: 'Precipitacion',
                  error_y: {
                    type: 'data',
                    array: data.precipitacion.err,
                    visible: true,
                  },
                  yaxis: 'y2',
                  type: 'scatter',
                },
              ])}
            layout={{
              title: 'Flor',
              xaxis: { title: 'Fecha' },
              yaxis: { title: 'Centidad (?)' },
              yaxis2: {
                title: 'Precipitación (cm)',
                overlaying: 'y',
                side: 'right',
              },
              legend: {
                x: 1.1,
              },
            }}
            config={{ displayModeBar: false, scrollZoom: true }}
          />
        )}
      </div>
    </div>
  );
};

export default M05Prom;
