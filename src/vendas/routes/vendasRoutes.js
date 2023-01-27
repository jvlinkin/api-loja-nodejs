const { Router } = require("express");
const VendasController = require("../controller/VendasController");
const vendasRoutes = Router();
const vendasController = new VendasController();
const { celebrate, Joi, Segments } = require("celebrate");

//routes
vendasRoutes.post(
  "/cadastrar",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      clienteId: Joi.string()
        .min(24)
        .message("Número de caracteres inválido")
        .max(24)
        .message("Número de caracteres inválido")
        .required(),
      vendedorId: Joi.string()
        .min(24)
        .message("Número de caracteres inválido")
        .max(24)
        .message("Número de caracteres inválido")
        .required(),
      valorCompra: Joi.number()
        .min(1)
        .message("Número de caracteres inválido")
        .max(1000000)
        .message("Número de caracteres inválido")
        .required(),
      formaPagamento: Joi.string()
        .min(3)
        .message("Forma de pagamento inválida")
        .max(8)
        .message("Forma de pagamento inválida")
        .required(),
    }),
  }),
  vendasController.cadastrarVenda
);

vendasRoutes.get("/listatodos", vendasController.listatodos);
vendasRoutes.get('/:id', vendasController.listavenda);

module.exports = vendasRoutes;
