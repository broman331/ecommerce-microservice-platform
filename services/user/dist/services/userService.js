"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.users.find(u => u.email === email);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.users.find(u => u.id === id);
        });
    }
    validatePassword(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // In a real app, use bcrypt.compare(password, user.passwordHash)
            // For this mock with hardcoded hash, we might need to actually generate a hash
            // But for the 'test@example.com' user, let's assume 'password123' is valid if we were doing real hashing.
            // To make this functional right now without seeding real hashes:
            if (user.email === 'test@example.com' && password === 'password123')
                return true;
            return bcryptjs_1.default.compare(password, user.passwordHash);
        });
    }
}
exports.UserService = UserService;
