const mongoose = require("mongoose");
const moment = require("moment");

const vendasModel = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientesModel",
    },
    nomeCliente: {
      type: String,
      required: true,
    },
    vendedorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendedorModel",
    },
    nomeVendedor: {
      type: String,
      required: true,
    },
    dataCompra: {
      type: String,
      default: moment(Date.now()).format("DD-MM-YYYY HH:mm:ss"),
    },
    valorCompra: {
      type: Number,
      required: true,
    },
    formaPagamento: {
      type: String,
      enum: ["pix", "cartão", "dinheiro"],
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

module.exports = mongoose.model("vendas", vendasModel);
