const { Router } = require("express");
const ClienteController = require("../controller/ClienteController");
const clientesRoutes = Router();
const clienteController = new ClienteController();
const { celebrate, Joi, Segments } = require("celebrate");

//cadastrar um cliente

const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
clientesRoutes.post(
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
      email: Joi.string()
        .pattern(emailRegex)
        .message("Padrão de e-mail incorreto")
        .max(200)
        .required(),
      telefone: Joi.string()
        .min(9)
        .message("Número de caracteres inválido")
        .max(11)
        .message("Número de caracteres inválido")
        .required(),
      cpf: Joi.string()
        .min(11)
        .message("Número de caracteres inválido")
        .max(11)
        .message("Número de caracteres inválido")
        .required(),
      cep: Joi.string()
        .min(8)
        .message("Número de caracteres inválido")
        .max(8)
        .message("Número de caracteres inválido")
        .required(),
      complemento: Joi.string().max(20).optional(),
      vendedorId: Joi.string()
        .min(24)
        .message("Número de caracteres inválido")
        .max(24)
        .message("Número de caracteres inválido")
        .required(),
    }),
  }),
  clienteController.CadastrarCliente
);

clientesRoutes.get("/listar", clienteController.ListarClientes);
clientesRoutes.get("/:id", clienteController.ListaCliente);
clientesRoutes.patch("/editar/:id", clienteController.Editar);

module.exports = clientesRoutes;
