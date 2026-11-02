"use strict";

const gastos = [
    { descripcion: "Flores artificiales para mampara", monto: 82.50, categoria: "decoracion" },
    { descripcion: "Globos para montaje", monto: 34.75, categoria: "decoracion" },
    { descripcion: "Rollo de neón flex", monto: 125, categoria: "rotulos" },
    { descripcion: "Lámina de acrílico", monto: 67.75, categoria: "rotulos" },
    { descripcion: "Traslado de estructuras", monto: 45, categoria: "transporte" },
    { descripcion: "Combustible para entregas", monto: 28, categoria: "transporte" },
    { descripcion: "Anuncio de servicios en redes", monto: 17, categoria: "publicidad" },
    { descripcion: "Reparación de estructura para eventos", monto: 200, categoria: "decoracion" }
];

function calcularTotal(gastos) {
    let suma = 0;

    for (let posicion = 0; posicion < gastos.length; posicion++) {
        const importe = gastos[posicion].monto;

        if (typeof importe !== "number") {
            throw new Error("Revisa el gasto '" + gastos[posicion].descripcion + "': su monto debe ser numérico.");
        }

        suma = suma + importe;
    }

    return suma;
}

function calcularPromedio(gastos) {
    const cantidad = gastos.length;

    if (cantidad === 0) {
        throw new Error("El promedio necesita al menos un gasto; se recibió un arreglo vacío.");
    }

    const suma = calcularTotal(gastos);
    return suma / cantidad;
}

function filtrarPorCategoria(gastos, categoria) {
    const seleccion = [];

    for (let posicion = 0; posicion < gastos.length; posicion++) {
        const gastoActual = gastos[posicion];

        if (gastoActual.categoria === categoria) {
            seleccion[seleccion.length] = gastoActual;
        }
    }

    return seleccion;
}

function obtenerMayorGasto(gastos) {
    let referenciaMayor = null;

    for (let posicion = 0; posicion < gastos.length; posicion++) {
        const gastoActual = gastos[posicion];

        if (referenciaMayor === null || gastoActual.monto > referenciaMayor.monto) {
            referenciaMayor = gastoActual;
        }
    }

    return referenciaMayor;
}

function clasificarGasto(monto) {
    let nivel;

    if (monto >= 100) {
        nivel = "Alto";
    } else if (monto >= 50) {
        nivel = "Medio";
    } else {
        nivel = "Bajo";
    }

    return nivel;
}

function describirCategoria(categoria) {
    switch (categoria) {
        case "decoracion":
            return "Materiales y estructuras para ambientar eventos.";
        case "rotulos":
            return "Insumos para fabricar letreros personalizados.";
        case "transporte":
            return "Traslados y entregas del emprendimiento.";
        case "publicidad":
            return "Promoción de productos y servicios.";
        default:
            return "Gasto sin una categoría definida en el informe.";
    }
}

function crearContadorDeAltos() {
    let cantidadRegistrada = 0;

    // Esta función flecha conserva el contador mediante un cierre.
    return () => {
        cantidadRegistrada += 1;
        return cantidadRegistrada;
    };
}

const mostrarDinero = (cantidad) => "$" + cantidad.toFixed(2);

try {
    const total = calcularTotal(gastos);
    const gastosClasificados = [];
    const resumenPorCategoria = {};
    const registrarAlto = crearContadorDeAltos();
    let cantidadAltos = 0;

    // El mismo recorrido construye la tabla, cuenta los altos y agrupa los montos.
    for (let posicion = 0; posicion < gastos.length; posicion++) {
        const gastoActual = gastos[posicion];
        const nivel = clasificarGasto(gastoActual.monto);
        const categoriaActual = gastoActual.categoria;

        gastosClasificados[gastosClasificados.length] = {
            descripcion: gastoActual.descripcion,
            monto: gastoActual.monto,
            categoria: categoriaActual,
            nivel: nivel,
            descripcionCategoria: describirCategoria(categoriaActual)
        };

        if (nivel === "Alto") {
            cantidadAltos = registrarAlto();
        }

        if (resumenPorCategoria[categoriaActual] === undefined) {
            resumenPorCategoria[categoriaActual] = 0;
        }

        resumenPorCategoria[categoriaActual] += gastoActual.monto;
    }

    const promedio = calcularPromedio(gastos);
    const mayorGasto = obtenerMayorGasto(gastos);
    const categoriaConsultada = "rotulos";
    const gastosConsultados = filtrarPorCategoria(gastos, categoriaConsultada);

    console.log("1. DETALLE DE GASTOS DEL EMPRENDIMIENTO");
    console.table(gastosClasificados);

    console.log("2. BALANCE DEL REGISTRO");
    console.log("Importe total registrado: " + mostrarDinero(total));
    console.log("Importe promedio por gasto: " + mostrarDinero(promedio));

    if (mayorGasto === null) {
        console.log("No se encontró un gasto mayor porque el registro está vacío.");
    } else {
        console.log(
            "La inversión más alta corresponde a '" + mayorGasto.descripcion +
            "', por " + mostrarDinero(mayorGasto.monto) +
            ", en la categoría '" + mayorGasto.categoria + "'."
        );
    }

    console.log("Gastos de nivel Alto (desde $100): " + cantidadAltos);
    console.log("Consulta de la categoría '" + categoriaConsultada + "':", gastosConsultados);

    const informe = {
        total: total,
        promedio: promedio,
        cantidadAltos: cantidadAltos,
        mayorGasto: mayorGasto,
        resumenPorCategoria: resumenPorCategoria
    };

    console.log("3. INFORME GENERAL EN JSON");
    console.log(JSON.stringify(informe, null, 2));
} catch (error) {
    console.error("No se pudo completar el informe: " + error.message);
}

console.log("4. COMPROBACIÓN CONTROLADA CON UN REGISTRO VACÍO");

try {
    calcularPromedio([]);
} catch (error) {
    console.error("Prueba controlada: " + error.message);
}
