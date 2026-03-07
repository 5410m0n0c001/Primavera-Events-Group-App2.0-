import re

raw_items = """base de madera plegable para mesa 
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
cruz madera para ceremonia"""

price_mapping = {
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
}

def get_cat(n):
    n = n.lower()
    if 'mesa' in n or 'tablon' in n or 'periquera' in n or 'lounge' in n or 'banca' in n or 'banco' in n or 'silla' in n or 'sill' in n: return 'Mobiliario'
    if 'letra' in n or 'corazón' in n or 'corazon' in n: return 'Decoración Iluminada'
    if 'portería' in n or 'back' in n or 'sombrilla' in n or 'templete' in n: return 'Estructuras'
    if 'carrito' in n or 'snacks' in n: return 'Extras'
    if 'plato' in n or 'copa' in n or 'cuchara' in n or 'cuchillo' in n or 'tenedor' in n or 'vaso' in n or 'tequilero' in n: return 'Loza y Cristalería'
    if 'mantel' in n or 'bambalina' in n or 'camino' in n or 'matel' in n: return 'Mantelería'
    if 'caballete' in n or 'atril' in n or 'reclinatorio' in n or 'cuadro' in n or 'unifila' in n or 'alfombra' in n or 'cruz' in n: return 'Decoración'
    return 'Accesorios y Miscelánea'

lines = raw_items.split('\\n')
final_lines = []
for line in lines:
    name = line.strip()
    if not name: continue
    price = price_mapping.get(name, 25)
    cat = get_cat(name)
    unit = 'pz'
    
    # fix unit
    if 'set' in name.lower() or 'lounge' in name.lower() or 'letra' in name.lower():
        unit = 'set'
        
    final_lines.append(f"            {{ nombre: '{name}', categoria: '{cat}', precioRenta: {price}, unidad: '{unit}' }}")

full_arr = "        const inventario = [\n" + ",\n".join(final_lines) + "\n        ];"

path_inv = "c:/Users/quant/OneDrive/Desktop/Primavera-Events-Group-App2.0/server/src/routes/inventario.ts"

with open(path_inv, "r", encoding="utf-8") as f:
    text = f.read()

import re
text = re.sub(r'const inventario = \[.*?\];', full_arr, text, flags=re.DOTALL)

with open(path_inv, "w", encoding="utf-8") as f:
    f.write(text)


wiz_cats = [
    ('cat_furniture', 'Mobiliario', 'Mobiliario'),
    ('cat_structures', 'Estructuras y Decoración', 'Decoración|Estructuras|Decoración Iluminada'),
    ('cat_glassware', 'Cristalería, Loza y Plaquetería', 'Loza|Cristalería'),
    ('cat_mantels', 'Mantelería y Caminos', 'Mantelería'),
    ('cat_extras', 'Extras y Barras', 'Accesorios|Extras')
]
wiz_lines = []
wiz_lines.append("export const DATA_CATEGORIES = [")

for idx, (cid, title, regex_cat) in enumerate(wiz_cats):
    wiz_lines.append(f"    {{")
    wiz_lines.append(f"        id: '{cid}', title: '{title}', items: [")
    cat_items = []
    
    item_id = 0
    for line in lines:
        name = line.strip()
        if not name: continue
        cat = get_cat(name)
        price = price_mapping.get(name, 25)
        
        if re.search(regex_cat, cat):
            unit = 'pz'
            if 'lounge' in name.lower() or 'letra gigante' in name.lower() or 'set' in name.lower():
                unit = 'set'
            idStr = f"{cid.split('_')[1][:3]}_{item_id}"
            cat_items.append(f"            {{ id: '{idStr}', name: '{name}', price: {price}, unit: '{unit}', description: '{cat}', category: '{cat}' }}")
            item_id += 1
            
    wiz_lines.append(",\\n".join(cat_items))
    wiz_lines.append("        ]")
    if idx < len(wiz_cats) - 1:
        wiz_lines.append("    },")
    else:
        wiz_lines.append("    }")

wiz_lines.append("];")

wiz_full = "\\n".join(wiz_lines)

path_wiz = "c:/Users/quant/OneDrive/Desktop/Primavera-Events-Group-App2.0/client/src/components/QuoteBuilder/Wizard.tsx"

with open(path_wiz, "r", encoding="utf-8") as f:
    wiz_text = f.read()

wiz_text = re.sub(r'export const DATA_CATEGORIES = \[.*?\n\];', wiz_full, wiz_text, flags=re.DOTALL)

with open(path_wiz, "w", encoding="utf-8") as f:
    f.write(wiz_text)

print("Actualizado inventario.ts y Wizard.tsx masivamente.")
