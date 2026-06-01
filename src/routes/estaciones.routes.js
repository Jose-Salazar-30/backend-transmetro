const express = require('express');
const router = express.Router();

const {
    obtenerEstaciones,
    obtenerEstacionPorId,
    crearEstacion,
    actualizarEstacion,
    eliminarEstacion
} = require('../controllers/estaciones.controller');

router.get('/', obtenerEstaciones);
router.get('/:id', obtenerEstacionPorId);
router.post('/', crearEstacion);
router.put('/:id', actualizarEstacion);
router.delete('/:id', eliminarEstacion);

module.exports = router;