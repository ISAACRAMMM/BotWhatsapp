const {
    createBot,

    createProvider,

    createFlow,

    addKeyword,
} = require("@bot-whatsapp/bot");

const QRPortal = require("@bot-whatsapp/portal");

const WsProvider = require("@bot-whatsapp/provider/baileys");

const DBProvider = require("@bot-whatsapp/database/mock");

const flujoPedido = addKeyword("1").addAnswer("Que *medicamento* necesitas");

const flujoOfertas = addKeyword("2")
    .addAnswer("Nuestras *ofertas y promociones* son:")

    .addAnswer(
        " ",

        {
            media: "C:/Users/Alberto Joya/Pictures/Promo/1.png",
        }
    )

    .addAnswer(
        " ",

        {
            media: "C:/Users/Alberto Joya/Pictures/Promo/2.png",
        }
    )

    .addAnswer(
        " ",

        {
            media: "C:/Users/Alberto Joya/Pictures/Promo/3.png",
        }
    );

async function validacionValoresPredeterminados(ctx) {
    if (valoresPermitidos.includes(ctx.body)) {
        //  console.log('si')

        return true;
    } else {
        //console.log('no')

        return false;
    }
}

const valoresPermitidos = ["1", "Si"];

const valoresNoper = ["2", "No"];

const flujoUbicacion = addKeyword("3")
    .addAnswer(["Link de Ubicacion", "https://maps.app.goo.gl/wcbHKx71ELM8q2UK7"])

    .addAnswer(
        ["¿Te puedo ayudar en algo más?", "1:Si", "2:NO"],
        {
            capture: true,
        },
        async (ctx, { gotoFlow }) => {
            console.log(validacionValoresPredeterminados(ctx));

            if (validacionValoresPredeterminados(ctx)) {
                console.log("prinipal");

                return gotoFlow(flujoPrincipal);
            }

            if (!validacionValoresPredeterminados(ctx)) {
                console.log("ofertas");

                return gotoFlow(flujoOfertas);
            }
        }
    );

/*

if (valoresPermitidos.includes(ctx.body)) {

    return gotoFlow(flujoPrincipal);

    } else  if (valoresPermitidos.includes(ctx.body)){

       

            return fallBack();

      

    }  

            */

const flujoHorario = addKeyword("4").addAnswer([
    "Horario de atencion",
    "Lunes a Domingo",
    "9:00 a.m. - 8:00 p.m.",
]);

const flujoGraias = addKeyword(["gracias"]).addAnswer([
    "Muchas gracias por tu preferencia",

    "Te atendio Carlitos, el asistente virtual de Farmacia Altimed Don Pancho 👨‍⚕️",
]);

const flujoPrincipal = addKeyword([
    "hola",
    "ola",
    "bueno",
    "buenos",
    "buena",
    "buenas",
])
    .addAnswer([
        "Hola soy Carlitos el asistente virtual de Farmacia Altimed Don Pancho 👨‍⚕️",
    ])

    .addAnswer(
        [
            "¿En que puedo ayudarte?",
            "1.Medicamentos 💊 ",
            "2.Ofertas y promociones 🏷 ",
            "3.Ubicacion 🗺 ",
            "4.Horarios ⏳ ",
        ],

        null,

        null,

        [flujoGraias, flujoPedido, flujoOfertas, flujoUbicacion, flujoHorario]
    );

const main = async () => {
    const adapterDB = new DBProvider();

    const adapterFlow = createFlow([flujoPrincipal]);

    const adapterProvider = createProvider(WsProvider);

    createBot({
        flow: adapterFlow,

        provider: adapterProvider,

        database: adapterDB,
    });
};

QRPortal();

main();
