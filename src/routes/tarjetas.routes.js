const express = require('express');
const router = express.Router();

const {
    obtenerTarjetas,
    obtenerTarjetaPorId,
    crearTarjeta,
    actualizarTarjeta,
    eliminarTarjeta
} = require('../controllers/tarjetas.controller');

router.get('/', obtenerTarjetas);
router.get('/:id', obtenerTarjetaPorId);
router.post('/', crearTarjeta);
router.put('/:id', actualizarTarjeta);
router.delete('/:id', eliminarTarjeta);

module.exports = router;