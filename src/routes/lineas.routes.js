const express = require('express');
const router = express.Router();

const {
    obtenerLineas,
    obtenerLineasId,
    crearLinea,
    actualizarLinea,
    eliminarLinea
} = require('../controllers/lineas.controller');

router.get('/', obtenerLineas);
router.get('/:id', obtenerLineasId);
router.post('/', crearLinea);
router.put('/:id', actualizarLinea);
router.delete('/:id', eliminarLinea);

module.exports = router;
