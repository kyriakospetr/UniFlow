import { Router } from "express";
import { verifyUser } from "../../../global/middlewares/verify.user.middleware.js";
import { buddyController } from "../controllers/buddy.controller.js";
import asyncWrapper from "../../../global/cores/asyncWrapper.core.js";
import { validateSchema } from "../../../global/middlewares/validate.schema.middleware.js";
import { FindBuddySchema } from "../schema/buddy.schema.js";

const buddyRouter = Router();

buddyRouter.post("/add", verifyUser, validateSchema(FindBuddySchema) ,asyncWrapper(buddyController.findBuddy))
buddyRouter.get("/", verifyUser, asyncWrapper(buddyController.listAllBuddies));

export default buddyRouter;