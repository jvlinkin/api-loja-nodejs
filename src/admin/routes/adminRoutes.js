const { Router } = require("express");
const adminRoutes = Router();
const { celebrate, Joi, Segments } = require("celebrate");
const AdminController = require("../controller/AdminController");
const clientesRoutes = require("../../clientes/routes/clientesRoutes");
const ClienteController = require("../../clientes/controller/ClienteController");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const adminController = new AdminController();


const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

//Somente ADMIN com a proprieda isAdmin == true no banco consegue cadastrar admin novos no sistema.
adminRoutes.post(
  "/:usuario_id/cadastro",
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      usuario_id: Joi.string()
        .length(24)
        .message("Número de caracteres inválido")
        .required(),
    }),
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

adminRoutes.get(
  "/:usuario_id/resumo/:mes/:ano",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      usuario_id: Joi.string()
        .length(24)
        .message("Número de caracteres inválido")
        .required(),
      mes: Joi.string()
        .length(2)
        .message("Número de caracteres deve ter no máximo dois dígitos")
        .pattern(new RegExp("^(0[1-9]|1[0-2])$"))
        .message("Mês inválido.")
        .required(),
      ano: Joi.string()
        .length(4)
        .message("Número de caracteres deve ter quatro dígitos")
        .pattern(new RegExp("^(20[2-9][0-9])$"))
        .message("ANo inválido.")
        .required(),
    }),
  }),
  adminController.Resumo
);

module.exports = adminRoutes;
