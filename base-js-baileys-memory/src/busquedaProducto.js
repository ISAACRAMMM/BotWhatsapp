import { promises as fs } from 'fs';
import path from 'path';  // Importa path para trabajar con rutas
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para buscar un producto
export async function buscarProducto(nombreBuscado) {
    try {
        // Usar path.resolve para construir una ruta absoluta
        const filePath = path.resolve(__dirname, 'data', 'productos.json');
       // console.log('Ruta del archivo JSON:', filePath);  // Puedes imprimir la ruta para verificar

        // Leer el archivo JSON
        const data = await fs.readFile(filePath, 'utf8');

        // Parsear el contenido del archivo JSON
        const productosData = JSON.parse(data);
        const productos = productosData.productos;

        // Buscar el producto
        const productoEncontrado = productos.find(p => p.nombre.toLowerCase() === nombreBuscado.toLowerCase());

        if (productoEncontrado) {
            //console.log('Producto encontrado:', productoEncontrado);
            return productoEncontrado;
        } else {
           // console.log('Producto no encontrado');
            return null;
        }
    } catch (err) {
        console.error('Error al leer el archivo:', err);
    }
}
