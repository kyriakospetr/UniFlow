import { Router } from 'express';
import { verifyUser } from '../../../global/middlewares/verify.user.middleware.js';
import { contactController } from '../controllers/contact.controller.js';
import asyncWrapper from '../../../global/core/asyncWrapper.core.js';
import { validateSchema } from '../../../global/middlewares/validate.schema.middleware.js';
import { FindContactSchema } from '../schemas/contact.schema.js';

const contactRouter = Router();

contactRouter.post('/', verifyUser, validateSchema(FindContactSchema), asyncWrapper(contactController.createContact));
contactRouter.get('/', verifyUser, asyncWrapper(contactController.getContacts));

export default contactRouter;
