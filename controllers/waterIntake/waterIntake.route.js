const waterIntake = require('./waterIntake.controller');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest =  require('../../helpers/validate-requres');
const { verify,isAdmin } = require('../../middlewares/authorize');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('atlasImage');


router.post('/addWaterSettings',verify ,waterIntake.addWaterSettings);
router.get('/getWaterSettings',verify ,waterIntake.getWaterSettings);
router.put('/updateWaterSettings/:waterSettingsID',verify ,waterIntake.updateWaterSettings);
router.post('/waterIntaking',verify ,waterIntake.waterIntaking);
router.get('/waterHistory',verify ,waterIntake.waterHistory);
router.get('/waterTodaysRecord',verify ,waterIntake.waterTodaysRecord);

module.exports = router;