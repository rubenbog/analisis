function obtenerNorma(test, edad, educacion) {
  if (normas[test] && normas[test][edad] && normas[test][edad][educacion]) {
    return normas[test][edad][educacion];
  }
  return null;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("neuroForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const edad = form.edad.value;
    const educacion = form.educacion.value;
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "";
    const zscores = [];
    const labels = [];

    for (let campo of form.elements) {
      const test = campo.name;
      if (
        !campo.name ||
        campo.name.endsWith("_media") ||
        campo.name.endsWith("_sd") ||
        !normas[campo.name] ||
        campo.value === "" ||
        test === "edad" ||
        test === "educacion"
      ) continue;

      const puntaje = parseFloat(campo.value);
      const mediaInput = form.elements[`${test}_media`];
      const sdInput = form.elements[`${test}_sd`];

      let media = mediaInput && mediaInput.value ? parseFloat(mediaInput.value) : null;
      let sd = sdInput && sdInput.value ? parseFloat(sdInput.value) : null;

      if ((!media || !sd) && normas[test]) {
        const norma = obtenerNorma(test, edad, educacion);
        if (norma) {
          media = norma.media;
          sd = norma.ds;
        }
      }

      if (media && sd) {
        const z = ((puntaje - media) / sd).toFixed(2);

        let interpretacion = "Normal";
        if (z <= -2) interpretacion = "Alteración moderada/severa";
        else if (z <= -1.5) interpretacion = "Rendimiento bajo";
        else if (z <= -1) interpretacion = "Límite";

        resultado.innerHTML += `<p><strong>${test}</strong>: Z = ${z} (${interpretacion})</p>`;
        zscores.push(parseFloat(z));
        labels.push(test);
      } else {
        resultado.innerHTML += `<p><strong>${test}</strong>: ⚠️ Faltan datos para calcular Z</p>`;
      }
    }

    if (labels.length > 0) {
      const ctx = document.getElementById("graficoZ").getContext("2d");
      if (window.zChart) window.zChart.destroy();
      window.zChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Z-score por prueba',
            data: zscores,
            backgroundColor: zscores.map(z =>
              z < -2.5 ? '#d73027' :
              z < -2 ? '#fc8d59' :
              z < -1.5 ? '#fee08b' :
              z < -1 ? '#d9ef8b' :
              z < -0.5 ? '#91cf60' :
              z < 0.5 ? '#1a9850' :
              z < 1 ? '#66bd63' :
              z < 1.5 ? '#a6d96a' :
              z < 2 ? '#d9ef8b' :
              z < 2.5 ? '#fdae61' : '#f46d43'
            )
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Z-score' }
            }
          }
        }
      });
    }
  });
});
