import { createBot, createProvider, createFlow,
        addKeyword } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { validacionValoresPredeterminados,
        validacionValoresPredeterminadosMenu,
        } from './validaciones.js'

        import { fileURLToPath } from 'url';
        import path from 'path';
        import fs from 'fs';

        import { buscarProducto } from './busquedaProducto.js'


const PORT = process.env.PORT ?? 3008

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta de la carpeta donde están las imágenes
const directoryPath = path.join(__dirname, './images/ofertas/');

console.log('Ruta absoluta:', directoryPath);

// Función para obtener solo los nombres de los archivos
function obtenerRutas(dir) {
    let nombres = [];

    // Lee los archivos del directorio
    fs.readdirSync(dir).forEach(file => {
        // Obtiene la ruta completa del archivo
        const filePath = path.join(dir, file);

        // Verifica si es un archivo
        if (fs.statSync(filePath).isFile()) {
            // Si es un archivo, guarda solo el nombre del archivo
            nombres.push(path.basename(filePath));
        }
    });

    return nombres;
}


const rutasDeArchivos = obtenerRutas(directoryPath);



////////////////////////////////////////////////////////////////
////////////////////////////////
////////////////////////////////////////////////////////////////



const welcomeFlow = addKeyword(['hi', 'hello', 'hola'])
    .addAnswer([
                "Hola soy Carlitos el asistente virtual de Farmacia Altimed Don Pancho 👨‍⚕️",
    ])
    .addAnswer([
                "¿En que puedo ayudarte?",
                "1.Medicamentos 💊 ",
                "2.Ofertas y promociones 🏷 ",
                "3.Ubicacion 🗺 ",
                "4.Horarios ⏳ ",
            ],{capture:true}, async (ctx,{gotoFlow, fallBack})=>{

                

                if(await validacionValoresPredeterminadosMenu(ctx)){
                    
                    

                    switch(ctx.body){
                        case '1':
                        case 'Medicamentos':
                            return gotoFlow(flujoMedicamentos);
                            
                        case '2':
                        case 'Ofertas':
                        case 'Promociones':
                        case 'Ofertas y promociones':
                            return gotoFlow(flujoOfertas);
                            
                        case '3':
                            return gotoFlow(flujoUbicacion);
                        
                        case '4':
                            return gotoFlow(flujoHorario);
                            
                        default:
                            return gotoFlow(welcomeFlow)

                    }
                }else{
                    return fallBack('opcion no valida')
                }

            }
    )


    const flujoMedicamentos = addKeyword(['medicamentos'])
    .addAnswer('Que medicamento buscas?' 
        ,{capture: true}
        ,async (ctx, {gotoFlow,flowDynamic }) => {
            const productoBuscar = await buscarProducto(ctx.body);

            if (productoBuscar){
                await flowDynamic([{
                    body: "Si contamos con el producto que está buscando",
                     // Usa la URL aquí
                    
                }]);
                return gotoFlow(flujoDespedidaProducto)
            }else{
                await flowDynamic([{
                    body: "De momento no contamos con el producto que está buscando",
                     // Usa la URL aquí
                    
                }]);
                return gotoFlow(flujoDespedidaProducto)
            }

        }
    )


    const flujoOfertas = 
    addKeyword(['ofertas'])
    .addAnswer('Estas son algunas de nuestras ofertas...')
    .addAction(
        async (_, {flowDynamic,gotoFlow}) => {
            for (let index = 0; index < rutasDeArchivos.length; index++) {
                // Construye la ruta absoluta de la imagen
                const rutaAbsoluta = path.resolve(__dirname, './images/ofertas/' + rutasDeArchivos[index]);

                // Convierte la ruta a una URL de archivo
                const urlArchivo = new URL(`${rutaAbsoluta}`);

                await flowDynamic([{
                    body: " ",
                    media: urlArchivo.href, // Usa la URL aquí
                    
                }]);
            }
            return gotoFlow(flujoDespedida);
        }
    );




   const flujoUbicacion = addKeyword(['ubicacion'])
   .addAnswer('Te esperamos en...')
   .addAction(
    {delay: 200},
    async (ctx, { provider,gotoFlow }) => {
        const number = ctx.key.remoteJid
        await provider.vendor.sendMessage(
            number,{
            location: {
                degreesLatitude: 19.93623811656241,
                degreesLongitude: -105.2523658570094,
                name: "Farmacia Altimed Don Pancho",
                address: "Graciano Sánchez 198 B, Col Las Delicias, Tomatlán, Jal."
            }
        }
        )
        return gotoFlow(flujoDespedida)
    }
)

 const flujocontactoAgente = addKeyword(['persona'])
    .addAnswer(['En un momento un agernte se comunicara contigo...'])

    const flujoHorario = addKeyword(['horario'])
    .addAnswer([
        "Horario de atencion",
        "Lunes a Domingo",
        "9:00 a.m. - 8:00 p.m.",
    ])
    .addAction( async (_, { gotoFlow} )=> {
        
        return gotoFlow(flujoDespedida);
    })

    const flujoDespedida = addKeyword(['despedida'])
    .addAnswer(["¿Te puedo ayudar en algo más?", "1:Si", "2:NO"],
        {capture:true},
        async (ctx, { gotoFlow}) => {
            if(await validacionValoresPredeterminados(ctx)){
                return gotoFlow(welcomeFlow)
            } else{
                return gotoFlow(flujoGracias)
            }
        }
    )
    const flujoDespedidaProducto = addKeyword(['despedida'])
    .addAnswer(["¿Te puedo ayudar en algo más?", "1:Si", "2:NO"],
        {capture:true},
        async (ctx, { gotoFlow}) => {
            if(await validacionValoresPredeterminados(ctx)){
                return gotoFlow(flujocontactoAgente)
            } else{
                return gotoFlow(flujoGracias)
            }
        }
    )

    
    const flujoGracias = 
    addKeyword(['gracias'])
    .addAnswer(['Muchas gracias por tu preferencia',

    'Te atendio Carlitos, el asistente virtual de Farmacia Altimed Don Pancho 👨‍⚕️'])
    
    
    







////////////////////////////////
////////////////////////////////
////////////////////////////////





const main = async () => {
    const adapterFlow = createFlow([
        welcomeFlow,
        flujoGracias, 
        flujoUbicacion,
        flujoOfertas,
        flujoMedicamentos,
        flujoDespedida,
        flujoHorario,
        flujocontactoAgente,
        flujoDespedidaProducto
    ])
    
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
