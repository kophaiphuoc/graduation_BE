const router = require("express").Router();
const {account_controllers,account_login_controllers} = require('../controllers/account_controllers')
const checkAccount = require('../middleware/middlewareAccount')


router.post("/email",checkAccount.checkRegister,account_controllers.sendOtpEmail);
router.post("/checkotp",account_controllers.checkOtpEmail);
router.post("/checklogin",account_login_controllers.checklogin);

module.exports = router;