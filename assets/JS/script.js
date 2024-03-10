document.getElementById("buscar").addEventListener("click", convertirMoneda);
document.getElementById("cantidad").addEventListener("input", validarCantidad);

function validarCantidad() {
  const cantidadInput = document.getElementById("cantidad");
  let cantidad = parseFloat(cantidadInput.value); // Obtiene el valor del input como número
  if (cantidad < 0) {
    cantidadInput.value = "";
  }
}
async function convertirMoneda() {
  const cantidad = document.getElementById("cantidad").value;
  const moneda = document.getElementById("moneda").value;
  if (!cantidad || isNaN(cantidad)) {
    alert("Por favor, ingresa una cantidad válida.");
    return;
  }
  try {
    const response = await fetch("https://mindicador.cl/api");
    const data = await response.json();
    let resultado;
    if (moneda === "usd") {
      resultado = cantidad / data.dolar.valor;
      informacion("dolar", moneda);
    } else if (moneda === "euro") {
      resultado = cantidad / data.euro.valor;
      informacion("euro", moneda);
    } else if (moneda === "uf") {
      resultado = cantidad / data.uf.valor;
      informacion("uf", moneda);
    }
    document.getElementById(
      "resultado"
    ).innerHTML = `Resultado: $${resultado.toFixed(2)} ${moneda.toUpperCase()}`;
    document.getElementById("myChart").style.display = "block";
  } catch (error) {
    console.error("Error al obtener los datos de la API:", error);
    document.getElementById("resultado").innerHTML =
      "Error al obtener los datos de la API.";
  }
}

const informacion = async (variable, nombreMoneda) => {
  const res = await fetch(`https://mindicador.cl/api/${variable}`);
  const data = await res.json();
  let series = data.serie.slice(0, 9);
  console.log(series);
  let fechas = [];
  let valores = [];
  series.forEach((item) => {
    let fecha = new Date(item.fecha).toLocaleDateString("en-GB");
    if (fecha) {
      fechas.push(fecha);
      valores.push(item.valor);
    }
  });
  const xValues = fechas.reverse();
  const yValues = valores.reverse();

  new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          label: nombreMoneda.toUpperCase(),
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0, 255, 66, 1)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          data: yValues,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            fontColor: "white",
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: "white",
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: "white",
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
        ],
      },
    },
  });
};
