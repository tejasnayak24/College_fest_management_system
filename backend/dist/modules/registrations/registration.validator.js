"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.createRegistrationSchema = zod_1.z.object({
    eventId: zod_1.z.string().cuid("Event id must be a valid cuid"),
});
