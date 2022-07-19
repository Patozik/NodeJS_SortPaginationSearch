const express = require('express');
const router = new express.Router();
const UserController = require('../controllers/user-controller');
const PageController = require('../controllers/page-controller');

router.get('/', PageController.showHome);
router.get('/uzytkownicy', UserController.showUsers);
router.get('/uzytkownicy/:id/:mode?', UserController.showUser);
//add
router.get('/admin/uzytkownicy/dodaj', UserController.showCreateUser);
router.post('/admin/uzytkownicy/dodaj', UserController.createUser);
//edit
router.get('/admin/uzytkownicy/:id/edytuj', UserController.showEditUser);
router.post('/admin/uzytkownicy/:id/edytuj', UserController.editUser);
//delete
router.get('/admin/uzytkownicy/:id/usun', UserController.deleteUser);
//error
router.get('*', PageController.showNotFound);

module.exports = router;