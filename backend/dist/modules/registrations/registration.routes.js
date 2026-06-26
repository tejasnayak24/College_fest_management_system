"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const client_1 = require("@prisma/client");
const registration_controller_1 = require("./registration.controller");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticateToken, authorizationGuard, registration_controller_1.registrationController.createRegistration);
router.get("/my", auth_middleware_1.authenticateToken, registration_controller_1.registrationController.getMyRegistrations);
router.get("/event/:eventId", auth_middleware_1.authenticateToken, (0, role_middleware_1.authorizeRoles)(client_1.Role.ADMIN, client_1.Role.COORDINATOR), registration_controller_1.registrationController.getEventRegistrations);
router.delete("/:id", auth_middleware_1.authenticateToken, registration_controller_1.registrationController.cancelRegistration);
function authorizationGuard(req, res, next) {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
    }
    if (req.user.role !== client_1.Role.STUDENT) {
        res.status(403).json({ success: false, message: "Only students can register for events" });
        return;
    }
    next();
}
exports.default = router;
