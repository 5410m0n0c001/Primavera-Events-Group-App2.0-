const fs = require('fs');
const path = require('path');

const raw_items = `base de madera plegable para mesa 
cubo metálico base
base metálica alta (centro de mesa)
descanso metálico 
mesa redonda
tablon 
Mesa cuadrada de madera
Mesa rectangular tipo marmol
mesa rectangular de madera color miel 
descansó de madera
mesa rectangular de madera color nogal clasico
mesa plegable cuadrada
mesa infantil
mesa madera blanca ceremonia
periquera alta madera 
Periquera alta metal 
Sala lounge madera
mesa de centro 
banca larga sin respaldo 
banca larga con respaldo 
banco individual puff 
silla negra plegable
silla Tiffany blanca 
silla tiffany chocolate 
silla tiffany blanca infantil
silla cross back madera tono nogal
silla cross back madera tono miel
banco metálico alto 
banco madera alto 
silla metalica boss
silla metálica Lotus
Sillón principal gris Oxford 
sillón principal palo de rosa (alita) 
sillón principal beige
Sombrilla 
pieza de templete de madera
caballete madera 
Atril de madera
Reclinatorio 
Cuadro virgen maría 
Rueda madera para mesa de coctel
unifila madera 
Rueda metálica con repisas de madera
cojín para silla tiffany 
cojín para silla lotus
cojín para silla boss
Base metálica para mesa
banco alto tejido plástico negro 
rack metálico para platos 
Letra gigante xv 1.10mt 
Letra gigante XV 1.80mt 
letra gigante L 
Letra gigante O 
Letra gigante V 
Letra gigante E 
Corazón gigante 
Alfombra roja 
portería metálica negra
Portería metálica dorada
back redondo metálico
Carrito de snaks
Tapa de carrito de snacks ( shots)
Tapa de carrito de snacks ( esquites)
Charola bar 
Charola grasa 
Plato trinche (27)
Plato sopero negro 
Plato sopero redondo blanco 
Plato sopero cuadrado blanco
Plato entremes blanco
Plato postre
Plato base romano 
Plato base vintage 
Plato base concha dorado
Plato base chocolate 
Plato gotico 
Copa flauta 
Copa de agua trasparente 
Copa de vino trasparente 
Copa de vino ambar 
Copa de vino uva
Copa de vino verde olivo
Copa de vino azul
Copa de agua roja
Copa agua romana 
Cuchara sopera plateada
Cuchara sopera dorada
Cuchara sopera gold rose
Cuchara sopera negra 
Copa martinera
Cuchillo plateado 
Cuchillo dorado
Cuchillo gold rose
Cuchillo negro
Tenedor plateado carne
Tenedor dorado ensalada
Tenedor dorado carne
Tenedor gold rose ensalada
cucharita plateada 
Cucharita dorada
Cucharita gold rose
Cucharita negra
Tenedor plateado ensalada
Tenedor gold rose carne
Tenedor negro carne
Tenedor negro ensalada
Vaso cubero
Vaso old fashion
Tequilero
Ceniceros
garrafón de plástico 19 lts
Tablas para pan (madera) 
Plato base plateado
plato base tipo espiral
Plato base cristal aperlado
Numeros para mesa en madera
Números de mesa acrílico 
base metálica para numeración de mesas
Pinzas para hielo 
Hielera metálica pequeña
Matel blanco cuadrado
Mantel blanco redondo
Mantel negro cuadrado
Mantel Caki cuadrado 
Mantel azul marino cuadrado
Mantel arena cuadrado
Mantel chocolate cuadrado
Mantel blanco para tablón 
Bambalinas negras para tablón 
Bambalina negra para tablón 
Cubre mantel dorado 
Cubre mantel palo de rosa
Cubre mantel rojo
Cubre mantel verde 
Cubre mantel amarillo
Camino champange 
Camino dorado 
Camino verde olivo 
Camino azul rey 
Camino azul marino
Camino azul cielo 
Camino Azul Turquesa
Camino palo de rosa
Camino rosa baby 
Caminos Rosa blush
Camino rosa brillante 
Camino fiuxa
Camino Corrugado Ivory
Camino verde bandera
Camino shedron
Camino beige 
Camino rojo 
Camino negro
Camino caki
Camino chocolate
Camino arena 
Camino Durazno 
Camino lila 
Camino verde navidad
Camino morado
Camino salmón 
Camino mexicano
Camino corrugado verde olivo
Camino hueso 
Jarra de plástico 
Tarja para hielo 
Pica hielo
Licuadora
Vitrolero de plástico grande
Vitrolero de cristal pequeño
Exprimidor de limon 
Cuchillos
Salsero
Tortillero
Banca para novios
Mantel blanco tipo macrame 
cruz madera para ceremonia`;

const price_mapping = {
    "base de madera plegable para mesa": 30,
    "cubo metálico base": 40,
    "base metálica alta (centro de mesa)": 50,
    "descanso metálico": 25,
    "mesa redonda": 80,
    "tablon": 70,
    "Mesa cuadrada de madera": 90,
    "Mesa rectangular tipo marmol": 120,
    "mesa rectangular de madera color miel": 100,
    "descansó de madera": 35,
    "mesa rectangular de madera color nogal clasico": 100,
    "mesa plegable cuadrada": 60,
    "mesa infantil": 50,
    "mesa madera blanca ceremonia": 90,
    "periquera alta madera": 80,
    "Periquera alta metal": 80,
    "Sala lounge madera": 150,
    "mesa de centro": 70,
    "banca larga sin respaldo": 60,
    "banca larga con respaldo": 80,
    "banco individual puff": 45,
    "silla negra plegable": 20,
    "silla Tiffany blanca": 35,
    "silla tiffany chocolate": 35,
    "silla tiffany blanca infantil": 20,
    "silla cross back madera tono nogal": 45,
    "silla cross back madera tono miel": 45,
    "banco metálico alto": 45,
    "banco madera alto": 45,
    "silla metalica boss": 45,
    "silla metálica Lotus": 45,
    "Sillón principal gris Oxford": 300,
    "sillón principal palo de rosa (alita)": 300,
    "sillón principal beige": 300,
    "Sombrilla": 300,
    "pieza de templete de madera": 150,
    "caballete madera": 100,
    "Atril de madera": 100,
    "Reclinatorio": 150,
    "Cuadro virgen maría": 200,
    "Rueda madera para mesa de coctel": 150,
    "unifila madera": 50,
    "Rueda metálica con repisas de madera": 200,
    "cojín para silla tiffany": 10,
    "cojín para silla lotus": 10,
    "cojín para silla boss": 10,
    "Base metálica para mesa": 40,
    "banco alto tejido plástico negro": 50,
    "rack metálico para platos": 100,
    "Letra gigante xv 1.10mt": 600,
    "Letra gigante XV 1.80mt": 900,
    "letra gigante L": 150,
    "Letra gigante O": 150,
    "Letra gigante V": 150,
    "Letra gigante E": 150,
    "Corazón gigante": 700,
    "Alfombra roja": 300,
    "portería metálica negra": 1500,
    "Portería metálica dorada": 1500,
    "back redondo metálico": 800,
    "Carrito de snaks": 2500,
    "Tapa de carrito de snacks ( shots)": 500,
    "Tapa de carrito de snacks ( esquites)": 500,
    "Charola bar": 30,
    "Charola grasa": 30,
    "Plato trinche (27)": 15,
    "Plato sopero negro": 15,
    "Plato sopero redondo blanco": 12,
    "Plato sopero cuadrado blanco": 12,
    "Plato entremes blanco": 10,
    "Plato postre": 8,
    "Plato base romano": 20,
    "Plato base vintage": 20,
    "Plato base concha dorado": 18,
    "Plato base chocolate": 20,
    "Plato gotico": 20,
    "Copa flauta": 12,
    "Copa de agua trasparente": 12,
    "Copa de vino trasparente": 12,
    "Copa de vino ambar": 15,
    "Copa de vino uva": 15,
    "Copa de vino verde olivo": 15,
    "Copa de vino azul": 15,
    "Copa de agua roja": 15,
    "Copa agua romana": 15,
    "Cuchara sopera plateada": 10,
    "Cuchara sopera dorada": 15,
    "Cuchara sopera gold rose": 15,
    "Cuchara sopera negra": 12,
    "Copa martinera": 12,
    "Cuchillo plateado": 10,
    "Cuchillo dorado": 15,
    "Cuchillo gold rose": 15,
    "Cuchillo negro": 12,
    "Tenedor plateado carne": 10,
    "Tenedor dorado ensalada": 15,
    "Tenedor dorado carne": 15,
    "Tenedor gold rose ensalada": 15,
    "cucharita plateada": 10,
    "Cucharita dorada": 15,
    "Cucharita gold rose": 15,
    "Cucharita negra": 12,
    "Tenedor plateado ensalada": 10,
    "Tenedor gold rose carne": 15,
    "Tenedor negro carne": 12,
    "Tenedor negro ensalada": 12,
    "Vaso cubero": 8,
    "Vaso old fashion": 8,
    "Tequilero": 6,
    "Ceniceros": 5,
    "garrafón de plástico 19 lts": 40,
    "Tablas para pan (madera)": 25,
    "Plato base plateado": 20,
    "plato base tipo espiral": 20,
    "Plato base cristal aperlado": 20,
    "Numeros para mesa en madera": 15,
    "Números de mesa acrílico": 20,
    "base metálica para numeración de mesas": 10,
    "Pinzas para hielo": 10,
    "Hielera metálica pequeña": 100,
    "Matel blanco cuadrado": 40,
    "Mantel blanco redondo": 40,
    "Mantel negro cuadrado": 40,
    "Mantel Caki cuadrado": 40,
    "Mantel azul marino cuadrado": 40,
    "Mantel arena cuadrado": 40,
    "Mantel chocolate cuadrado": 40,
    "Mantel blanco para tablón": 40,
    "Bambalinas negras para tablón": 35,
    "Bambalina negra para tablón": 35,
    "Cubre mantel dorado": 25,
    "Cubre mantel palo de rosa": 25,
    "Cubre mantel rojo": 25,
    "Cubre mantel verde": 25,
    "Cubre mantel amarillo": 25,
    "Camino champange": 15,
    "Camino dorado": 15,
    "Camino verde olivo": 15,
    "Camino azul rey": 15,
    "Camino azul marino": 15,
    "Camino azul cielo": 15,
    "Camino Azul Turquesa": 15,
    "Camino palo de rosa": 15,
    "Camino rosa baby": 15,
    "Caminos Rosa blush": 15,
    "Camino rosa brillante": 15,
    "Camino fiuxa": 15,
    "Camino Corrugado Ivory": 15,
    "Camino verde bandera": 15,
    "Camino shedron": 15,
    "Camino beige": 15,
    "Camino rojo": 15,
    "Camino negro": 15,
    "Camino caki": 15,
    "Camino chocolate": 15,
    "Camino arena": 15,
    "Camino Durazno": 15,
    "Camino lila": 15,
    "Camino verde navidad": 15,
    "Camino morado": 15,
    "Camino salmón": 15,
    "Camino mexicano": 15,
    "Camino corrugado verde olivo": 18,
    "Camino hueso": 15,
    "Jarra de plástico": 25,
    "Tarja para hielo": 150,
    "Pica hielo": 15,
    "Licuadora": 200,
    "Vitrolero de plástico grande": 80,
    "Vitrolero de cristal pequeño": 50,
    "Exprimidor de limon": 15,
    "Cuchillos": 20,
    "Salsero": 15,
    "Tortillero": 15,
    "Banca para novios": 200,
    "Mantel blanco tipo macrame": 60,
    "cruz madera para ceremonia": 350
};

function getCat(name) {
    const n = name.toLowerCase();
    if (n.includes('mesa') || n.includes('tablon') || n.includes('periquera') || n.includes('lounge') || n.includes('banca') || n.includes('banco') || n.includes('silla') || n.includes('sill')) return 'Mobiliario';
    if (n.includes('letra') || n.includes('corazón') || n.includes('corazon')) return 'Decoración Iluminada';
    if (n.includes('portería') || n.includes('back') || n.includes('sombrilla') || n.includes('templete')) return 'Estructuras';
    if (n.includes('carrito') || n.includes('snacks')) return 'Extras';
    if (n.includes('plato') || n.includes('copa') || n.includes('cuchara') || n.includes('cuchillo') || n.includes('tenedor') || n.includes('vaso') || n.includes('tequilero')) return 'Loza y Cristalería';
    if (n.includes('mantel') || n.includes('bambalina') || n.includes('camino') || n.includes('matel')) return 'Mantelería';
    if (n.includes('caballete') || n.includes('atril') || n.includes('reclinatorio') || n.includes('cuadro') || n.includes('unifila') || n.includes('alfombra') || n.includes('cruz')) return 'Decoración';
    return 'Accesorios y Miscelánea';
}

const lines = raw_items.split('\\n');
const finalLines = [];
let item_id = 0;

for (let line of lines) {
    const name = line.trim();
    if (!name) continue;

    const price = price_mapping[name] || 25;
    const cat = getCat(name);
    let unit = 'pz';

    if (name.toLowerCase().includes('set') || name.toLowerCase().includes('lounge') || name.toLowerCase().includes('letra')) {
        unit = 'set';
    }

    finalLines.push(\`            { nombre: '\${name}', categoria: '\${cat}', precioRenta: \${price}, unidad: '\${unit}' }\`);
}

const fullArr = "        const inventario = [\n" + finalLines.join(",\n") + "\n        ];";
const pathInv = path.join(__dirname, "server/src/routes/inventario.ts");

let textInv = fs.readFileSync(pathInv, "utf-8");
textInv = textInv.replace(/const inventario = \[[\s\S]*?\];/, fullArr);
fs.writeFileSync(pathInv, textInv);

const wizCats = [
    { id: 'cat_furniture', title: 'Mobiliario', regex: /Mobiliario/i },
    { id: 'cat_structures', title: 'Estructuras y Decoración', regex: /Decoración|Estructuras|Decoración Iluminada/i },
    { id: 'cat_glassware', title: 'Cristalería, Loza y Plaquetería', regex: /Loza|Cristalería/i },
    { id: 'cat_mantels', title: 'Mantelería y Caminos', regex: /Mantelería/i },
    { id: 'cat_extras', title: 'Extras y Barras', regex: /Accesorios|Extras/i }
];

let wizLines = [];
wizLines.push("export const DATA_CATEGORIES = [");

wizCats.forEach((catObj, idx) => {
    wizLines.push(\`    {\`);
    wizLines.push(\`        id: '\${catObj.id}', title: '\${catObj.title}', items: [\`);
    let catItems = [];
    
    let subid = 0;
    lines.forEach(line => {
        const name = line.trim();
        if (!name) return;
        const cat = getCat(name);
        const price = price_mapping[name] || 25;
        
        if (catObj.regex.test(cat)) {
            let unit = 'pz';
            if (name.toLowerCase().includes('lounge') || name.toLowerCase().includes('letra gigante') || name.toLowerCase().includes('set')) {
                unit = 'set';
            }
            const idStr = \`\${catObj.id.split('_')[1].substring(0,3)}_\${subid}\`;
            catItems.push(\`            { id: '\${idStr}', name: '\${name}', price: \${price}, unit: '\${unit}', description: '\${cat}', category: '\${cat}' }\`);
            subid++;
        }
    });
    
    wizLines.push(catItems.join(",\n"));
    wizLines.push("        ]");
    wizLines.push(idx < wizCats.length - 1 ? "    }," : "    }");
});

wizLines.push("];");
const wizFull = wizLines.join("\n");

const pathWiz = path.join(__dirname, "client/src/components/QuoteBuilder/Wizard.tsx");
let wizText = fs.readFileSync(pathWiz, "utf-8");
wizText = wizText.replace(/export const DATA_CATEGORIES = \[[\s\S]*?\];/, wizFull);
fs.writeFileSync(pathWiz, wizText);

console.log("TS files generated successfully via Node.");
