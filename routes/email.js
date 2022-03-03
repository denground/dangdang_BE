const express = require('express');
const router = express.Router();
const emailController = require('../controller/email');

// ID 찾을 때 보내주는 메일
router.post('/users/find', emailController.sendEmail);

module.exports = router;
