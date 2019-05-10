const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    const vocablistsetting = "Thietlapdanh sach hoc :)) _ du lieu de tam day cho no co thoi =))  ";
    res.render('thietlapdanhsachhoc', { fakeinfo: vocablistsetting });
})

module.exports = router;