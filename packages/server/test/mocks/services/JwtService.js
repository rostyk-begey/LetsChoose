"use strict";
exports.__esModule = true;
// import config from '../../../config';
// import {
//   AuthTokenPayload,
//   BaseTokenPayload,
//   IJwtService,
//   TokenPair,
// } from '../../../services/JwtService';
var JwtService = {
    generateAuthTokenPair: function (userId, passwordVersion) {
        if (passwordVersion === void 0) { passwordVersion = 0; }
        var payload = { userId: userId, passwordVersion: passwordVersion };
        var accessToken = this.generateAccessToken(payload);
        var refreshToken = this.generateRefreshToken(payload);
        return { accessToken: accessToken, refreshToken: refreshToken };
    },
    generateAccessToken: function (payload) {
        return JSON.stringify(payload);
    },
    generateRefreshToken: function (payload) {
        return JSON.stringify(payload);
    },
    generateResetPasswordToken: function (userId) {
        return JSON.stringify({ userId: userId });
    },
    generateEmailToken: function (userId) {
        return JSON.stringify({ userId: userId });
    },
    verifyAccessToken: function (token) {
        return JSON.parse(token);
        // return jwt.verify(token, config.jwt.accessSecret) as AuthTokenPayload;
    },
    verifyRefreshToken: function (token) {
        return JSON.parse(token);
    },
    verifyEmailToken: function (token) {
        return JSON.parse(token);
    },
    verifyPasswordResetToken: function (token) {
        return JSON.parse(token);
    },
};
JwtService.generateAuthTokenPair = jest.fn(JwtService.generateAuthTokenPair);
JwtService.generateAccessToken = jest.fn(JwtService.generateAccessToken);
JwtService.generateRefreshToken = jest.fn(JwtService.generateRefreshToken);
JwtService.generateResetPasswordToken = jest.fn(JwtService.generateResetPasswordToken);
JwtService.generateEmailToken = jest.fn(JwtService.generateEmailToken);
JwtService.verifyAccessToken = jest.fn(JwtService.verifyAccessToken);
JwtService.verifyRefreshToken = jest.fn(JwtService.verifyRefreshToken);
JwtService.verifyEmailToken = jest.fn(JwtService.verifyEmailToken);
JwtService.verifyPasswordResetToken = jest.fn(JwtService.verifyPasswordResetToken);
exports["default"] = JwtService;
