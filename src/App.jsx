import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import loadCsv from './data/loadData';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dataFunc = async () => setData(await loadCsv('reg_diarios'));
    dataFunc();
  }, []);

  return (
    <>
      <h1>Avances monitoreo comunitario</h1>
      <div id="06_medicion_lluvia">
        <h2>M06 - Medición de lluvia</h2>
        <div id="reg_diarios">
          {!data ? (
            'cargando...'
          ) : (
            <Plot
              data={Object.keys(data).map((name) => ({
                ...data[name],
                name,
                type: 'scatter',
              }))}
              layout={{
                title: {
                  text: 'Precipitación diaria',
                  pad: 0,
                  yanchor: 'top',
                },
                xaxis: { title: 'Fecha', automargin: true },
                yaxis: { title: 'precipitación (cm)' },
              }}
              config={{ displayModeBar: false, scrollZoom: true }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
