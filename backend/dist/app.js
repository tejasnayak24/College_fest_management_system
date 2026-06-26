"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const event_routes_1 = __importDefault(require("./modules/events/event.routes"));
const registration_routes_1 = __importDefault(require("./modules/registrations/registration.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.get("/", (req, res) => {
    res.send("FestSphere API is running 🚀");
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/events", event_routes_1.default);
app.use("/api/registrations", registration_routes_1.default);
exports.default = app;
