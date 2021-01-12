import React, { useState } from 'react';

import M06 from './M06';
import M01 from './M01';

const App = () => {
  const [metodology, setMetodology] = useState('');

  return (
    <>
      <h1>Avances monitoreo comunitario</h1>
      <label htmlFor="sel_metodologia">
        Seleccione la metodología de monitoreo:
        <select
          id="sel_metodologia"
          onChange={(event) => setMetodology(event.target.value)}
          aria-label="metodologia"
        >
          <option disabled selected>
            -- Seleccione una opción --
          </option>
          <option value="01_validacion_coberturas">
            M01 - Validación de coberturas
          </option>
          <option value="06_medicion_lluvia">M06 - Medición de lluvia</option>
        </select>
      </label>
      {metodology === '01_validacion_coberturas' && <M01 />}
      {metodology === '06_medicion_lluvia' && <M06 />}
    </>
  );
};

export default App;
