import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";
import { Role } from "@prisma/client";
import { eventController } from "./event.controller";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles(Role.ADMIN, Role.COORDINATOR),
  eventController.createEvent,
);

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.put(
  "/:id",
  authenticateToken,
  eventController.updateEvent,
);
router.delete(
  "/:id",
  authenticateToken,
  eventController.deleteEvent,
);

export default router;
