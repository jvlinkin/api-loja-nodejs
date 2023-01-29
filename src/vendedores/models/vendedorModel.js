const mongoose = require("mongoose");
const moment = require("moment");

const vendedorModel = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    idade: {
      type: Number,
      required: true,
    },
    cidade: {
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
    dataContratacao: {
      type: String,
      default: moment(Date.now()).format("DD-MM-YYYY"),
    },
    porcentagemComissao: {
      type: Number,
      default: 0.1,
    },
    horaEntrada: {
      type: String,
      default: moment().startOf("day").hours(9).format("HH:mm"),
      required: true,
    },
    horaSaida: {
      type: String,
      default: moment().startOf("day").hours(18).format("HH:mm"),
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    ativo: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("vendedores", vendedorModel);
