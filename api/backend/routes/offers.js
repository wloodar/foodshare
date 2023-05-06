const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const OfferController = require('../controllers/offers');

router.post('/share-new', checkAuth, OfferController.addNewOffer);

router.post('/edit', checkAuth, OfferController.editOffer);

router.get('/get/all-from-school', checkAuth, OfferController.getAllOffersFromSchool);

router.get('/get/all-user', checkAuth, OfferController.getAllUserOffers);

router.get('/get/exact/:id', checkAuth, OfferController.getExactOffer);

router.get('/get/edit/:id', checkAuth, OfferController.getOfferToEdit);

router.post('/delete', checkAuth, OfferController.deleteOffer);

router.post('/pickup/generate-code', checkAuth, OfferController.pickupGenerateNewCode);

module.exports = router;