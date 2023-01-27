const { Router } = require("express");
const vendedorRoutes = Router();
const VendedorController = require("../controller/VendedorController");

const { celebrate, Joi, Segments } = require("celebrate");
const isAuthenticated = require("../../middlewares/isAuthenticated");

//Instanciando a classe VendedorController para podermos utilizar seus métodos.
const vendedorController = new VendedorController();
const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

vendedorRoutes.post(
  "/cadastrar",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      nome: Joi.string()
        .min(3)
        .message("Numero de caracteres não é válido.")
        .max(15)
        .message("Numero de caracteres não é válido.")
        .required(),
      idade: Joi.number().min(18).message("Idade não permitida").required(),
      cidade: Joi.string()
        .max(25)
        .message("Numero de caracteres não é válido.")
        .required(),
      email: Joi.string()
        .pattern(emailRegex)
        .message("Padrão de e-mail incorreto")
        .max(200)
        .required(),
      porcentagemComissao: Joi.number().optional(),
    }),
  }),
  vendedorController.cadastrarVendedor
);

//Criar rota que mostre os vendedores ativos da loja, (ALFABÉTICA), e se está trabalhando ou não.
vendedorRoutes.get("/status", vendedorController.listaTodos);

vendedorRoutes.get("/:id", vendedorController.ListaVendedor);

vendedorRoutes.patch(
  "/editar/:id/:usuario_id",
  isAuthenticated,
  vendedorController.Editar
);

//routes

module.exports = vendedorRoutes;
