import { Router } from "express";
import { getContactsForDmList, searchContact } from "../controllers/contactsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContact);
contactRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDmList);

export default  contactRoutes;