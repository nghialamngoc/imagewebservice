"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var app = express_1.default();
app.get('/', (req, res) => {
});
const POST = process.env.PORT || '5000';
app.listen(POST, () => console.log(`Server running on port ${POST}`));
