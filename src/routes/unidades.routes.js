const express = require('express');
const router = express.Router();

const {
    obtenerUnidades,
    obtenerUnidadPorId,
    crearUnidad,
    actualizarUnidad,
    eliminarUnidad
} = require('../controllers/unidades.controller');

router.get('/', obtenerUnidades);
router.get('/:id', obtenerUnidadPorId);
router.post('/', crearUnidad);
router.put('/:id', actualizarUnidad);
router.delete('/:id', eliminarUnidad);

module.exports = router;