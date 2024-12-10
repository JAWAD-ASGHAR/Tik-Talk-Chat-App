import { Router } from "express";
import { getAllContacts, getContactsForDmList, searchContact } from "../controllers/contactsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContact);
contactRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDmList);
contactRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

export default  contactRoutes;