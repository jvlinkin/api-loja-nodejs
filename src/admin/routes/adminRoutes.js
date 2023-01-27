const { Router } = require("express");
const adminRoutes = Router();
const { celebrate, Joi, Segments } = require("celebrate");
const AdminController = require("../controller/AdminController");
const clientesRoutes = require("../../clientes/routes/clientesRoutes");
const ClienteController = require("../../clientes/controller/ClienteController");
const adminController = new AdminController();

//cadastrar um cliente

const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
adminRoutes.post(
  "/cadastro",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nome: Joi.string()
        .min(3)
        .message("Numero de caracteres não é válido.")
        .max(15)
        .message("Numero de caracteres não é válido.")
        .required(),
      email: Joi.string()
        .pattern(emailRegex)
        .message("Padrão de e-mail incorreto")
        .max(200)
        .required(),
      senha: Joi.string()
        .min(4)
        .message("Número de caracteres inválido")
        .max(20)
        .message("Número de caracteres inválido")
        .required(),
    }),
  }),
  adminController.Cadastro
);

adminRoutes.post(
  "/login",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string()
        .pattern(emailRegex)
        .message("Padrão de e-mail incorreto")
        .max(200)
        .required(),
      senha: Joi.string()
        .min(4)
        .message("Número de caracteres inválido")
        .max(20)
        .message("Número de caracteres inválido")
        .required(),
    }),
  }),
  adminController.Login
);

module.exports = adminRoutes;
