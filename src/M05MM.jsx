import Plot from 'react-plotly.js';
import React, { useState, useEffect } from 'react';

import loadCsv from './data/loadData';

const M05MM = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => setData(await loadCsv('fenologia2'));
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
            data={[
              {
                x: data.Flor['Botón'].min.x,
                y: data.Flor['Botón'].min.y,
                name: 'Botón min',
                type: 'scatter',
                fill: 'none',
                mode: 'lines',
                line: {
                  color: 'indigo',
                },
                legendgroup: 'boton',
              },
              {
                x: data.Flor['Botón'].max.x,
                y: data.Flor['Botón'].max.y,
                name: 'Botón max',
                type: 'scatter',
                fill: 'tonexty',
                mode: 'lines',
                line: {
                  color: 'indigo',
                },
                legendgroup: 'boton',
              },
              {
                x: data.Flor.Abierta.min.x,
                y: data.Flor.Abierta.min.y,
                name: 'Abierta min',
                type: 'scatter',
                fill: 'none',
                mode: 'lines',
                line: {
                  color: 'rgb(234, 153, 153)',
                },
                legendgroup: 'abierta',
              },
              {
                x: data.Flor.Abierta.max.x,
                y: data.Flor.Abierta.max.y,
                name: 'Abierta max',
                type: 'scatter',
                fill: 'tonexty',
                mode: 'lines',
                line: {
                  color: 'rgb(234, 153, 153)',
                },
                legendgroup: 'abierta',
              },
              {
                x: data.precipitacion.min.x,
                y: data.precipitacion.min.y,
                name: 'Precipitación min',
                type: 'scatter',
                fill: 'none',
                mode: 'lines',
                line: {
                  color: '#77b41f',
                },
                legendgroup: 'precipitacion',
                yaxis: 'y2',
              },
              {
                x: data.precipitacion.max.x,
                y: data.precipitacion.max.y,
                name: 'Precipitación max',
                type: 'scatter',
                fill: 'tonexty',
                mode: 'lines',
                line: {
                  color: '#77b41f',
                },
                legendgroup: 'precipitacion',
                yaxis: 'y2',
              },
            ]}
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

export default M05MM;
