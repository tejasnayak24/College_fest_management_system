import { Router, type NextFunction, type Request, type Response } from "express";
import { authenticateToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";
import { Role } from "@prisma/client";
import { registrationController } from "./registration.controller";

const router = Router();

router.post("/", authenticateToken, authorizationGuard, registrationController.createRegistration);
router.get("/my", authenticateToken, registrationController.getMyRegistrations);
router.get(
  "/event/:eventId",
  authenticateToken,
  authorizeRoles(Role.ADMIN, Role.COORDINATOR),
  registrationController.getEventRegistrations,
);
router.delete("/:id", authenticateToken, registrationController.cancelRegistration);

function authorizationGuard(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  if (req.user.role !== Role.STUDENT) {
    res.status(403).json({ success: false, message: "Only students can register for events" });
    return;
  }

  next();
}

export default router;
