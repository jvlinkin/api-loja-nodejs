const mongoose = require("mongoose");
const moment = require("moment");
const axios = require("axios");

const clienteModel = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    idade: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    telefone: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
    },
    cep: {
      type: String,
      required: true,
    },
    logradouro: {
      type: String,
    },
    bairro: {
      type: String,
    },
    cidade: {
      type: String,
    },
    estado: {
      type: String,
    },
    complemento: {
      type: String,
    },
    vendedorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendedorModel",
    },
    vendedorNome: {
      type: String,
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

clienteModel.pre("save", function (next) {
  axios
    .get(`https://viacep.com.br/ws/${this.cep}/json/`)
    .then((response) => {
      if (response.data.erro) {
        //construindo um erro para poder tratar na rota.
        const error = new Error("CEP inválido");
        error.isCepInvalid = true;
        return next(error);
      } else {
        this.logradouro = response.data.logradouro;
        this.bairro = response.data.bairro;
        this.cidade = response.data.localidade;
        this.estado = response.data.uf;
        return next();
      }
    })
    .catch((error) => {
      return next(error);
    });
});

module.exports = mongoose.model("clientes", clienteModel);
