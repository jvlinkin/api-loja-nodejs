const mongoose = require("mongoose");
const moment = require("moment");
const axios = require("axios");

const adminModel = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    senha: {
      type: String,
      required: true,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    accessToken: {
      type: String,
      select: false,
    },

    accessTokenExpires: {
      type: Date,
      select: false,
    },
    ativo: {
      type: Boolean,
      default: true,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("admin", adminModel);
