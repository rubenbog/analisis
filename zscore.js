document.getElementById('neuroForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";
  const edad = parseInt(this.edad.value);
  const educ = parseInt(this.educacion.value);

  for (let campo of this.elements) {
    if (!normas[campo.name] || campo.value === "") continue;

    const puntaje = parseFloat(campo.value);
    const media = normas[campo.name].media;
    const sd = normas[campo.name].sd;
    const z = ((puntaje - media) / sd).toFixed(2);

    let interpretacion = "Normal";
    if (z <= -2) interpretacion = "Alteración moderada/severa";
    else if (z <= -1.5) interpretacion = "Rendimiento bajo";
    else if (z <= -1) interpretacion = "Límite";

    resultado.innerHTML += `<p><strong>${campo.name}</strong>: Z = ${z} (${interpretacion})</p>`;
  }
});
