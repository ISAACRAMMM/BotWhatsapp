

const valoresPermitidos = ["1", "Si"];

export async function validacionValoresPredeterminados(ctx) {
    if (valoresPermitidos.includes(ctx.body)) {
        return true;
    } else {
        return false;
    }
}

const valoresPermitidosMenuPrincipal = ["1", '2', '3','4'];

export async function validacionValoresPredeterminadosMenu(ctx) {
    if (valoresPermitidosMenuPrincipal.includes(ctx.body)) {
        return true;
    } else {
        return false;
    }
}