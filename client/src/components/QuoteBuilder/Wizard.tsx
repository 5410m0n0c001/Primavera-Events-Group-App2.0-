import React, { useState, useMemo } from 'react';
import type { QuoteDraft } from '../../types';

import SmartCategory from './SmartCategory';
import ManualItemForm from './ManualItemForm';
import QuoteBreakdown from './QuoteBreakdown';

// Mock Data for MVP - Replace with API calls
const DATA_CATEGORIES = [
    {
        id: 'cat_estructuras', title: 'Estructuras y Carpas', items: [
            { id: 'est_1', name: 'base de madera plegable para mesa', price: 30, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'est_2', name: 'cubo metálico base', price: 40, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'est_3', name: 'base metálica alta (centro de mesa)', price: 50, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'est_4', name: 'descanso metálico', price: 25, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'est_5', name: 'descansó de madera', price: 35, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'est_6', name: 'Sombrilla', price: 300, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'est_7', name: 'pieza de templete de madera', price: 150, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'est_8', name: 'portería metálica negra', price: 1500, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'est_9', name: 'Portería metálica dorada', price: 1500, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'est_10', name: 'back redondo metálico', price: 800, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
        ]
    },
    {
        id: 'cat_mesas', title: 'Mesas', items: [
            { id: 'mes_1', name: 'mesa redonda', price: 80, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_2', name: 'tablon', price: 70, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_3', name: 'Mesa cuadrada de madera', price: 90, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_4', name: 'Mesa rectangular tipo marmol', price: 120, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_5', name: 'mesa rectangular de madera color miel', price: 100, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_6', name: 'mesa rectangular de madera color nogal clasico', price: 100, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_7', name: 'mesa plegable cuadrada', price: 60, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_8', name: 'mesa infantil', price: 50, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_9', name: 'mesa madera blanca ceremonia', price: 90, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_10', name: 'mesa de centro', price: 70, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_11', name: 'Rueda madera para mesa de coctel', price: 150, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_12', name: 'Rueda metálica con repisas de madera', price: 200, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'mes_13', name: 'Base metálica para mesa', price: 40, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
        ]
    },
    {
        id: 'cat_sillas', title: 'Sillas y Sillones', items: [
            { id: 'sil_1', name: 'silla negra plegable', price: 20, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_2', name: 'silla Tiffany blanca', price: 35, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_3', name: 'silla tiffany chocolate', price: 35, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_4', name: 'silla tiffany blanca infantil', price: 20, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_5', name: 'silla cross back madera tono nogal', price: 45, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_6', name: 'silla cross back madera tono miel', price: 45, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_7', name: 'silla metalica boss', price: 45, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_8', name: 'silla metálica Lotus', price: 45, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_9', name: 'Sillón principal gris Oxford', price: 300, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_10', name: 'sillón principal palo de rosa (alita)', price: 300, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_11', name: 'sillón principal beige', price: 300, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_12', name: 'banco metálico alto', price: 45, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_13', name: 'banco madera alto', price: 45, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_14', name: 'banco alto tejido plástico negro', price: 50, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_15', name: 'cojín para silla tiffany', price: 10, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_16', name: 'cojín para silla lotus', price: 10, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_17', name: 'cojín para silla boss', price: 10, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'sil_18', name: 'Banca para novios', price: 200, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
        ]
    },
    {
        id: 'cat_lounge', title: 'Salas Lounge y Periqueras', items: [
            { id: 'lou_1', name: 'periquera alta madera', price: 80, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'lou_2', name: 'Periquera alta metal', price: 80, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'lou_3', name: 'Sala lounge madera', price: 150, unit: 'set', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'lou_4', name: 'banca larga sin respaldo', price: 60, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'lou_5', name: 'banca larga con respaldo', price: 80, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'lou_6', name: 'banco individual puff', price: 45, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
        ]
    },
    {
        id: 'cat_loza', title: 'Loza, Cristalería y Cuchillería', items: [
            { id: 'loz_1', name: 'Plato trinche (27)', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_2', name: 'Plato sopero negro', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_3', name: 'Plato sopero redondo blanco', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_4', name: 'Plato sopero cuadrado blanco', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_5', name: 'Plato entremes blanco', price: 10, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_6', name: 'Plato postre', price: 8, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_7', name: 'Plato base romano', price: 20, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_8', name: 'Plato base vintage', price: 20, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_9', name: 'Plato base concha dorado', price: 18, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_10', name: 'Plato base chocolate', price: 20, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_11', name: 'Plato gotico', price: 20, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_12', name: 'Plato base plateado', price: 20, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_13', name: 'plato base tipo espiral', price: 20, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'loz_14', name: 'Plato base cristal aperlado', price: 20, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },

            { id: 'cri_1', name: 'Copa flauta', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_2', name: 'Copa de agua trasparente', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_3', name: 'Copa de vino trasparente', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_4', name: 'Copa de vino ambar', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_5', name: 'Copa de vino uva', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_6', name: 'Copa de vino verde olivo', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_7', name: 'Copa de vino azul', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_8', name: 'Copa de agua roja', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_9', name: 'Copa agua romana', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_10', name: 'Copa martinera', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_11', name: 'Vaso cubero', price: 8, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_12', name: 'Vaso old fashion', price: 8, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cri_13', name: 'Tequilero', price: 6, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },

            { id: 'cub_1', name: 'Cuchara sopera plateada', price: 10, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_2', name: 'Cuchara sopera dorada', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_3', name: 'Cuchara sopera gold rose', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_4', name: 'Cuchara sopera negra', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_5', name: 'Cuchillo plateado', price: 10, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_6', name: 'Cuchillo dorado', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_7', name: 'Cuchillo gold rose', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_8', name: 'Cuchillo negro', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_9', name: 'Tenedor plateado carne', price: 10, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_10', name: 'Tenedor dorado ensalada', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_11', name: 'Tenedor dorado carne', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_12', name: 'Tenedor gold rose ensalada', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_13', name: 'Tenedor gold rose carne', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_14', name: 'Tenedor negro carne', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_15', name: 'Tenedor negro ensalada', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_16', name: 'Tenedor plateado ensalada', price: 10, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_17', name: 'cucharita plateada', price: 10, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_18', name: 'Cucharita dorada', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_19', name: 'Cucharita gold rose', price: 15, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_20', name: 'Cucharita negra', price: 12, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
            { id: 'cub_21', name: 'Cuchillos', price: 20, unit: 'pz', description: 'Loza y Cristalería', category: 'Loza y Cristalería' },
        ]
    },
    {
        id: 'cat_manteles', title: 'Mantelería y Caminos', items: [
            { id: 'man_1', name: 'Matel blanco cuadrado', price: 40, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'man_2', name: 'Mantel blanco redondo', price: 40, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'man_3', name: 'Mantel negro cuadrado', price: 40, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'man_4', name: 'Mantel Caki cuadrado', price: 40, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'man_5', name: 'Mantel azul marino cuadrado', price: 40, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'man_6', name: 'Mantel arena cuadrado', price: 40, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'man_7', name: 'Mantel chocolate cuadrado', price: 40, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'man_8', name: 'Mantel blanco para tablón', price: 40, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'man_9', name: 'Bambalinas negras para tablón', price: 35, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'man_10', name: 'Bambalina negra para tablón', price: 35, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'man_11', name: 'Mantel blanco tipo macrame', price: 60, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },

            { id: 'cman_1', name: 'Cubre mantel dorado', price: 25, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cman_2', name: 'Cubre mantel palo de rosa', price: 25, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cman_3', name: 'Cubre mantel rojo', price: 25, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cman_4', name: 'Cubre mantel verde', price: 25, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cman_5', name: 'Cubre mantel amarillo', price: 25, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },

            { id: 'cam_1', name: 'Camino champange', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_2', name: 'Camino dorado', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_3', name: 'Camino verde olivo', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_4', name: 'Camino azul rey', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_5', name: 'Camino azul marino', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_6', name: 'Camino azul cielo', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_7', name: 'Camino Azul Turquesa', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_8', name: 'Camino palo de rosa', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_9', name: 'Camino rosa baby', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_10', name: 'Caminos Rosa blush', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_11', name: 'Camino rosa brillante', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_12', name: 'Camino fiuxa', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_13', name: 'Camino Corrugado Ivory', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_14', name: 'Camino verde bandera', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_15', name: 'Camino shedron', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_16', name: 'Camino beige', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_17', name: 'Camino rojo', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_18', name: 'Camino negro', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_19', name: 'Camino caki', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_20', name: 'Camino chocolate', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_21', name: 'Camino arena', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_22', name: 'Camino Durazno', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_23', name: 'Camino lila', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_24', name: 'Camino verde navidad', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_25', name: 'Camino morado', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_26', name: 'Camino salmón', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_27', name: 'Camino mexicano', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_28', name: 'Camino corrugado verde olivo', price: 18, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_29', name: 'Camino hueso', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
        ]
    },
    {
        id: 'cat_decoracion', title: 'Decoración y Letras Iluminadas', items: [
            { id: 'dec_1', name: 'caballete madera', price: 100, unit: 'pz', description: 'Decoración', category: 'Decoración' },
            { id: 'dec_2', name: 'Atril de madera', price: 100, unit: 'pz', description: 'Decoración', category: 'Decoración' },
            { id: 'dec_3', name: 'Reclinatorio', price: 150, unit: 'pz', description: 'Decoración', category: 'Decoración' },
            { id: 'dec_4', name: 'Cuadro virgen maría', price: 200, unit: 'pz', description: 'Decoración', category: 'Decoración' },
            { id: 'dec_5', name: 'unifila madera', price: 50, unit: 'pz', description: 'Decoración', category: 'Decoración' },
            { id: 'dec_6', name: 'Alfombra roja', price: 300, unit: 'pz', description: 'Decoración', category: 'Decoración' },
            { id: 'dec_7', name: 'cruz madera para ceremonia', price: 350, unit: 'pz', description: 'Decoración', category: 'Decoración' },
            { id: 'dec_8', name: 'Letra gigante xv 1.10mt', price: 600, unit: 'set', description: 'Decoración Iluminada', category: 'Decoración Iluminada' },
            { id: 'dec_9', name: 'Letra gigante XV 1.80mt', price: 900, unit: 'set', description: 'Decoración Iluminada', category: 'Decoración Iluminada' },
            { id: 'dec_10', name: 'letra gigante L', price: 150, unit: 'set', description: 'Decoración Iluminada', category: 'Decoración Iluminada' },
            { id: 'dec_11', name: 'Letra gigante O', price: 150, unit: 'set', description: 'Decoración Iluminada', category: 'Decoración Iluminada' },
            { id: 'dec_12', name: 'Letra gigante V', price: 150, unit: 'set', description: 'Decoración Iluminada', category: 'Decoración Iluminada' },
            { id: 'dec_13', name: 'Letra gigante E', price: 150, unit: 'set', description: 'Decoración Iluminada', category: 'Decoración Iluminada' },
            { id: 'dec_14', name: 'Corazón gigante', price: 700, unit: 'pz', description: 'Decoración Iluminada', category: 'Decoración Iluminada' },
        ]
    },
    {
        id: 'cat_accesorios', title: 'Accesorios y Miscelánea', items: [
            { id: 'acc_1', name: 'rack metálico para platos', price: 100, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_2', name: 'Charola bar', price: 30, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_3', name: 'Charola grasa', price: 30, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_4', name: 'Ceniceros', price: 5, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_5', name: 'garrafón de plástico 19 lts', price: 40, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_6', name: 'Tablas para pan (madera)', price: 25, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_7', name: 'Numeros para mesa en madera', price: 15, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'acc_8', name: 'Números de mesa acrílico', price: 20, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'acc_9', name: 'base metálica para numeración de mesas', price: 10, unit: 'pz', description: 'Mobiliario', category: 'Mobiliario' },
            { id: 'acc_10', name: 'Pinzas para hielo', price: 10, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_11', name: 'Hielera metálica pequeña', price: 100, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_12', name: 'Jarra de plástico', price: 25, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_13', name: 'Tarja para hielo', price: 150, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_14', name: 'Pica hielo', price: 15, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_15', name: 'Licuadora', price: 200, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_16', name: 'Vitrolero de plástico grande', price: 80, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_17', name: 'Vitrolero de cristal pequeño', price: 50, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_18', name: 'Exprimidor de limon', price: 15, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_19', name: 'Salsero', price: 15, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
            { id: 'acc_20', name: 'Tortillero', price: 15, unit: 'pz', description: 'Accesorios y Miscelánea', category: 'Accesorios y Miscelánea' },
        ]
    },
    {
        id: 'cat_extras', title: 'Extras', items: [
            { id: 'ext_1', name: 'Carrito de snaks', price: 2500, unit: 'pz', description: 'Extras', category: 'Extras' },
            { id: 'ext_2', name: 'Tapa de carrito de snacks ( shots)', price: 500, unit: 'pz', description: 'Extras', category: 'Extras' },
            { id: 'ext_3', name: 'Tapa de carrito de snacks ( esquites)', price: 500, unit: 'pz', description: 'Extras', category: 'Extras' },
            { id: 'pkg_gob', name: 'Paquete Gobernador', price: 900, unit: 'persona', description: 'Venue: Convenciones Presidente. 3 tiempos, Coctel, DJ 8 hrs', category: 'Paquetes' },
            { id: 'pkg_pres', name: 'Paquete Presidente', price: 1100, unit: 'persona', description: 'Venue: Convenciones Presidente. 4 tiempos, Capitán, Grupo Musical', category: 'Paquetes' },
            { id: 'pho_1', name: 'Video Memorias', price: 9900, unit: 'paquete', description: 'Fotos y video del evento', category: 'Foto/Video' }
        ]
    }
];

import { useQuoteCalculations } from '../../hooks/useQuoteCalculations';

const QuoteWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [draft, setDraft] = useState<QuoteDraft>({
        eventName: '',
        guestCount: 100,
        date: '',
        selectedItems: [], // { item: any, quantity: number }
        discount: 0,
        downPaymentPercentage: 30, // Default 30%
        paymentLimitDate: ''
    });
    const [budget, setBudget] = useState(0);
    const [showManualForm, setShowManualForm] = useState(false);

    // Use the centralized calculation hook
    const totals = useQuoteCalculations(draft);

    // Leads Management
    const [showLeads, setShowLeads] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);

    React.useEffect(() => {
        if (showLeads) fetchLeads();
    }, [showLeads]);

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/clients');
            if (res.ok) {
                const data = await res.json();
                setLeads(data.filter((c: any) => c.type === 'LEAD'));
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteLead = async (id: string) => {
        if (!confirm('¿Eliminar este lead?')) return;
        try {
            const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLeads(prev => prev.filter(l => l.id !== id));
            }
        } catch (e) { console.error(e); }
    };

    const handleResumeLead = (lead: any) => {
        setDraft(prev => ({
            ...prev,
            eventName: `${lead.firstName} ${lead.lastName}`,
            guestCount: 100 // Default or if captured in lead
        }));
        setShowLeads(false);
        alert(`Lead ${lead.firstName} cargado. Puedes comenzar a cotizar.`);
    };

    const handleEditLead = async (lead: any) => {
        const newName = prompt('Editar Nombre:', lead.firstName);
        if (newName && newName !== lead.firstName) {
            try {
                // Simple update for MVP
                const res = await fetch(`/api/clients/${lead.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...lead, firstName: newName })
                });
                if (res.ok) fetchLeads();
            } catch (e) { console.error(e); }
        }
    };


    // Dynamic Quantity Scaling when guestCount changes
    // This solves the bug: "los datos no son dinámicos al cambiar el número de invitados"
    React.useEffect(() => {
        // Only run if there are selected items to update
        if (draft.selectedItems.length === 0) return;

        setDraft(prev => {
            let hasChanges = false;
            const updatedItems = prev.selectedItems.map(si => {
                const isPerPerson = si.item?.unit?.toLowerCase() === 'persona' || si.item?.unit?.toLowerCase() === 'pax';
                if (!isPerPerson && !si.item?.name?.toLowerCase().includes('mesero') && !si.item?.name?.toLowerCase().includes('mesa')) {
                    return si; // Keep same quantity if it doesn't auto-scale
                }

                // Re-apply smart quantity rule
                let suggestedQty = si.quantity;
                if (isPerPerson) suggestedQty = prev.guestCount;
                if (si.item?.name?.toLowerCase().includes('mesero')) suggestedQty = Math.ceil(prev.guestCount / 15);
                if (si.item?.name?.toLowerCase().includes('mesa') && !si.item?.name?.toLowerCase().includes('principal')) suggestedQty = Math.ceil(prev.guestCount / 10);

                if (suggestedQty !== si.quantity) {
                    hasChanges = true;
                }

                return {
                    ...si,
                    quantity: suggestedQty,
                    cost: suggestedQty * si.unitPrice
                };
            });
            // Prevent infinite loop by returning exact same reference if nothing actually changed
            return hasChanges ? { ...prev, selectedItems: updatedItems } : prev;
        });
    }, [draft.guestCount]); // Solo debe reaccionar al cambio del contador de invitados

    // Capacity Validation checks absolute max venue size.
    const locationCapacity = 800; // Max venue capacity for C.C Presidente
    const isOverCapacity = draft.guestCount > locationCapacity;

    const handleToggleItem = (item: any, quantity: number) => {
        setDraft(prev => {
            const existing = prev.selectedItems.find(i => i.item?.id === item.id);
            if (quantity <= 0) {
                return { ...prev, selectedItems: prev.selectedItems.filter(i => i.item?.id !== item.id) };
            }
            if (existing) {
                return { ...prev, selectedItems: prev.selectedItems.map(i => i.item?.id === item.id ? { ...i, quantity } : i) };
            }
            // Ensure strictly typed and structured QuoteItem
            const newItem = {
                item,
                quantity,
                id: `qi_${Date.now()}_${item.id}`,
                quoteId: 'temp',
                serviceItemId: item.id || 'manual',
                serviceItem: item,
                unitPrice: Number(item.price) || 0,
                cost: (Number(item.price) || 0) * quantity
            };
            return { ...prev, selectedItems: [...prev.selectedItems, newItem as any] };
        });
    };

    const handleAddManualItem = (newItem: any) => {
        handleToggleItem(newItem, 1);
    };

    const handleRemoveItem = (itemId: string) => {
        setDraft(prev => ({
            ...prev,
            selectedItems: prev.selectedItems.filter(i => i.item?.id !== itemId)
        }));
    };

    const handleSaveDraft = async (status: 'DRAFT' | 'ACCEPTED' = 'DRAFT') => {
        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventName: draft.eventName,
                    guestCount: draft.guestCount,
                    date: draft.date,
                    items: draft.selectedItems,
                    totals,
                    status, // Dynamic status
                    discount: draft.discount,
                    downPaymentPercentage: draft.downPaymentPercentage,
                    paymentLimitDate: draft.paymentLimitDate
                })
            });

            if (response.ok) {
                const action = status === 'ACCEPTED' ? 'aprobada y registrada' : 'guardada';
                alert(`Cotización ${action} exitosamente.`);
                resetForm();
            } else {
                const err = await response.json();
                alert('Error al guardar: ' + (err.error || 'Error desconocido'));
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión con el servidor.');
        }
    };

    const resetForm = () => {
        setDraft({
            eventName: '',
            guestCount: 100,
            date: '',
            selectedItems: [],
            discount: 0,
            downPaymentPercentage: 30,
            paymentLimitDate: ''
        });
        setStep(1);
        setBudget(0);
    };

    const handleNextStep = async () => {
        // Validation Step 1
        if (!draft.eventName.trim()) {
            alert('Por favor agrega un Nombre del Evento.');
            return;
        }
        if (!draft.date) {
            alert('Por favor selecciona una Fecha.');
            return;
        }
        if (draft.guestCount <= 0) {
            alert('El número de invitados debe ser mayor a 0.');
            return;
        }

        // Hybrid Validation: Validate with backend before showing final summary -> MOVED TO FINALIZE
        // But we can do basic check here.
        setStep(2);
    };

    const handleFinalize = async () => {
        try {
            // Hybrid Validation: Validate with backend before showing final summary
            const response = await fetch('/api/quotes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: draft.selectedItems,
                    guestCount: draft.guestCount
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.valid && data.items) {
                    // Update draft with validated items (source of truth)
                    // This updates unitPrices if backend applies rules/corrections
                    setDraft(prev => ({ ...prev, selectedItems: data.items }));
                }
            }
        } catch (e) {
            console.error("Validation warning:", e);
        }
        setStep(3);
    };

    const handleGeneratePDF = async () => {
        const payload = {
            eventName: draft.eventName,
            guestCount: draft.guestCount,
            date: draft.date,
            items: draft.selectedItems.map(i => ({
                name: i.item?.name || 'Item',
                quantity: i.quantity,
                price: Number(i.unitPrice || i.item?.price || 0),
                unit: i.item?.unit || 'pz'
            })),
            totals // Include calculated totals
        };
        try {
            const response = await fetch('/api/quotes/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Cotizacion-${draft.eventName}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8 relative">

            {/* Main Content */}
            <div className="flex-1 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif text-primavera-gold font-bold mb-2 break-words">
                        Nueva Cotización Inteligente
                    </h1>
                    <div className="flex justify-between items-end">
                        <p className="text-gray-500">Diseña el evento perfecto con cálculos automáticos.</p>
                        <button
                            onClick={() => setShowLeads(true)}
                            className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold hover:bg-purple-200 transition flex items-center gap-1"
                        >
                            📋 Leads Pendientes
                        </button>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex gap-4 mb-8 text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-4 overflow-x-auto">
                    <span className={step === 1 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>1. Evento</span>
                    <span className={step === 2 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>2. Servicios</span>
                    <span className={step === 3 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>3. Finalizar</span>
                </div>

                {step === 1 && (
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6">Detalles del Evento</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Nombre del Evento</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-primavera-gold focus:border-transparent outline-none transition"
                                    placeholder="e.j. Boda Juan y Maria"
                                    value={draft.eventName}
                                    onChange={e => setDraft({ ...draft, eventName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Fecha Tentativa</label>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 rounded-lg p-3 border"
                                    value={draft.date}
                                    onChange={e => setDraft({ ...draft, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Número de Invitados</label>
                                <input
                                    type="number"
                                    className="w-full border-gray-300 rounded-lg p-3 border font-bold text-lg"
                                    value={draft.guestCount}
                                    onChange={e => setDraft({ ...draft, guestCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Presupuesto Objetivo (Opcional)</label>
                                <input
                                    type="number"
                                    className="w-full border-gray-300 rounded-lg p-3 border"
                                    placeholder="$0.00"
                                    value={budget}
                                    onChange={e => setBudget(parseInt(e.target.value) || 0)}
                                />
                            </div>

                            {/* Financial Settings */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 mt-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Descuento ($)</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg p-3 border"
                                        placeholder="0.00"
                                        value={draft.discount || ''}
                                        onChange={e => setDraft({ ...draft, discount: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Anticipo Mínimo (%)</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg p-3 border"
                                        placeholder="30"
                                        value={draft.downPaymentPercentage || ''}
                                        onChange={e => setDraft({ ...draft, downPaymentPercentage: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Fecha Límite de Pago</label>
                                    <input
                                        type="date"
                                        className="w-full border-gray-300 rounded-lg p-3 border"
                                        value={draft.paymentLimitDate || ''}
                                        onChange={e => setDraft({ ...draft, paymentLimitDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={handleNextStep} className="w-full md:w-auto bg-primavera-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                                Siguiente: Seleccionar Servicios →
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowManualForm(true)}
                                className="w-full md:w-auto bg-white border border-primavera-gold text-primavera-gold px-4 py-2 rounded-lg font-bold hover:bg-yellow-50 transition flex items-center justify-center gap-2"
                            >
                                + Agregar Elemento Manual
                            </button>
                        </div>

                        {DATA_CATEGORIES.map(cat => (
                            <SmartCategory
                                key={cat.id}
                                title={cat.title}
                                items={cat.items}
                                selectedItems={draft.selectedItems}
                                onToggleItem={handleToggleItem}
                                guestCount={draft.guestCount}
                            />
                        ))}
                        <div className="flex flex-col-reverse md:flex-row justify-between pt-6 gap-4">
                            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black font-medium py-2">
                                ← Volver
                            </button>
                            <button onClick={handleFinalize} className="bg-primavera-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                                Ver Resumen Final →
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                        <div className="mb-6">
                            <span className="text-6xl">🎉</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">¡Cotización Lista!</h2>
                        <p className="text-gray-600 mb-8">Has configurado un evento para {draft.guestCount} personas.</p>

                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <button onClick={handleGeneratePDF} className="bg-primavera-gold text-white px-8 py-3 rounded-lg font-bold hover:brightness-110 transition flex items-center justify-center gap-2">
                                <span>📄</span> Descargar PDF
                            </button>
                            <button onClick={() => handleSaveDraft('DRAFT')} className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition">
                                Guardar como Borrador
                            </button>
                            <button onClick={() => handleSaveDraft('ACCEPTED')} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg flex items-center gap-2">
                                <span>✅</span> Aprobar y Registrar Evento
                            </button>
                        </div>
                        <button onClick={() => setStep(2)} className="mt-6 text-gray-500 underline text-sm">
                            Volver a editar
                        </button>
                    </div>
                )}

            </div>

            {/* Sidebar Calculator - Replaced by Breakdown Panel */}
            <div className="w-full md:w-96 flex-shrink-0 relative order-first md:order-last">
                <div className="sticky top-6">
                    <QuoteBreakdown
                        draft={draft}
                        onRemove={handleRemoveItem}
                    />

                    {isOverCapacity && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2 animate-pulse">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <strong>Capacidad Excedida</strong>
                                <p>Tus recintos soportan un máximo operativo regular de {locationCapacity} personas, pero tienes configurado {draft.guestCount} invitados. Confirme logística.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showManualForm && (
                <ManualItemForm
                    categories={DATA_CATEGORIES.map(c => c.title)}
                    onSave={handleAddManualItem}
                    onClose={() => setShowManualForm(false)}
                />
            )}

            {/* Leads Drawer */}
            {showLeads && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Leads Pendientes</h2>
                            <button onClick={() => setShowLeads(false)} className="text-gray-500 text-2xl">&times;</button>
                        </div>

                        <div className="space-y-4">
                            {leads.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No hay leads pendientes.</p>
                            ) : leads.map(lead => (
                                <div key={lead.id} className="border rounded-lg p-4 hover:shadow-md transition bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{lead.firstName} {lead.lastName}</h3>
                                            <p className="text-sm text-gray-500">{lead.email}</p>
                                            <p className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pendiente</span>
                                    </div>

                                    <div className="flex gap-2 mt-4 border-t pt-3">
                                        <button
                                            onClick={() => handleResumeLead(lead)}
                                            className="flex-1 bg-primavera-gold text-white px-2 py-1 rounded text-sm font-bold hover:brightness-105"
                                        >
                                            Cotizar
                                        </button>
                                        <button
                                            onClick={() => handleEditLead(lead)}
                                            className="px-3 py-1 border rounded text-sm hover:bg-white"
                                            title="Modificar Nombre"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLead(lead.id)}
                                            className="px-3 py-1 border border-red-200 text-red-500 rounded text-sm hover:bg-red-50"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};

export default QuoteWizard;
