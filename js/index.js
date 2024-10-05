function generar() {
    // Obtener los valores ingresados por el usuario
    var cantidad = parseInt(document.getElementById('cantidad').value);
    var materia = document.getElementById('materia').value;
    var inicioParcial = new Date(document.getElementById('inicioParcial').value);
    var finParcial = new Date(document.getElementById('finParcial').value);
    var horasDia = document.getElementById('horasDia').value;
    var diasSemana = document.getElementById('diasSemana').value;
    var grupo = document.getElementById('grupo').value;
    var profesor = document.getElementById('nombre').value;
    var diasFestivos = document.getElementById('diaFestivo').value.split(',').map(festivo => new Date(festivo.trim()));

    // Función para verificar si una fecha es un día de descanso (sábado o domingo)
    function esDiaDeDescanso(fecha) {
        return fecha.getDay() === 0 || fecha.getDay() === 6; // 0 = Domingo, 6 = Sábado
    }

    // Función para verificar si una fecha es festivo
    function esFestivo(fecha, diasFestivos) {
        return diasFestivos.some(festivo => festivo.toDateString() === fecha.toDateString());
    }

    // Función para obtener color de mes
    function obtenerColorMes(fecha) {
        const mes = fecha.getMonth();
        const colores = ['#FFCCCB', '#FFDEAD', '#ADFF2F', '#FFD700', '#FFB6C1', '#87CEFA', '#FF69B4', '#98FB98', '#DDA0DD', '#FF7F50', '#FFE4E1', '#B0E0E6'];
        return colores[mes];
    }

    var fechas = [];
    for (var fecha = new Date(inicioParcial); fecha <= finParcial; fecha.setDate(fecha.getDate() + 1)) {
        fechas.push(new Date(fecha)); // Agrega todas las fechas al array
    }

    // Crear una tabla HTML
    var html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Asistencia</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                h1, h2, h3, h4, h5 {
                    color: #333;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                th, td {
                    padding: 15px;
                    border: 1px solid #ddd;
                    text-align: center;
                }
                th {
                    background-color: #4CAF50; /* Color verde para encabezados */
                    color: white;
                }
                .inhabil {
                    background-color: #FFCDD2; /* Color rojo claro para días inhábiles */
                }
                .habil {
                    background-color: #FFFFFF; /* Color blanco para días hábiles */
                }
                .finDeSemana {
                    background-color: #FFE4B5; /* Color para sábados y domingos */
                }
                .festivo {
                    background-color: #FF4500; /* Color para días festivos */
                }
                input {
                    width: 80%;
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                input:focus {
                    border-color: #4CAF50; /* Color verde al enfocar */
                }
                .header {
                    margin-bottom: 20px;
                    padding: 10px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
            </style>
            <script>
                function cambiarEstado(select) {
                    var celda = select.parentNode;
                    if (select.value === 'A') {
                        celda.style.backgroundColor = '#A0FFA0'; // Color para asistencia
                    } else if (select.value === 'F') {
                        celda.style.backgroundColor = '#FF7F7F'; // Color para falta
                    } else {
                        celda.style.backgroundColor = ''; // Color por defecto
                    }
                }
            </script>
        </head>
        <body>
            <div class="header">
                <h1>Lista de Asistencia</h1>
                <h2>Materia: ${materia}</h2>
                <h3>Profesor: ${profesor}</h3>
                <h4>Grupo: ${grupo}</h4>
                <h5>Horas al día: ${horasDia}, Días a la semana: ${diasSemana}</h5>
                <h5>Días festivos: ${diasFestivos.map(f => f.toLocaleDateString()).join(", ")}</h5>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Alumnos</th>
                        ${fechas.map(fecha => `<th style="background-color: ${obtenerColorMes(fecha)};">${fecha.getDate()}/${fecha.getMonth() + 1}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
    `;

    for (var i = 1; i <= cantidad; i++) {
        html += `<tr>`;
        // Campo para el nombre del alumno
        html += `<td><input type="text" placeholder="Nombre del Alumno ${i}" /></td>`;
        for (var j = 0; j < fechas.length; j++) {
            var esInhabil = esDiaDeDescanso(fechas[j]) || esFestivo(fechas[j], diasFestivos);
            // Campo para el estatus (asistencia o falta)
            var clase = esInhabil ? (esDiaDeDescanso(fechas[j]) ? 'finDeSemana' : 'festivo') : 'habil';
            html += `<td class="${clase}"><select style="width: 60%;" onchange="cambiarEstado(this);">
                <option value="">Seleccionar</option>
                <option value="A">Asistencia</option>
                <option value="F">Falta</option>
            </select></td>`;
        }
        html += `</tr>`;
    }

    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;

    // Abrir la nueva página con la tabla
    var nuevaVentana = window.open();
    nuevaVentana.document.write(html);
    nuevaVentana.document.close();
}
