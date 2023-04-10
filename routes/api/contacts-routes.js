const express = require('express')

const router = express.Router()

const ctrl = require('../../controllers/contacts-controller')

const { validateBody } = require('../../utils')
const {schemas} = require('../../models/contacts')








router.get('/', ctrl.getAllContacts )

router.get('/:id', ctrl.getContactsById )

router.post('/', validateBody(schemas.addSchema), ctrl.addContact )

router.delete('/:id', ctrl.deleteContacts)

router.put('/:id', validateBody(schemas.addSchema), ctrl.updateContacts)
router.patch('/:id/favorite', validateBody(schemas.updateSchema), ctrl.updateStatusContact)

module.exports = router;
