const clienteModel = require("../models/clientesModel");
const vendedorModel = require("../../vendedores/models/vendedorModel");
const vendasModel = require("../../vendas/models/vendasModel");

class ClienteController {
  async CadastrarCliente(req, res) {
    const { nome, idade, email, telefone, cpf, cep, complemento, vendedorId } =
      req.body;

    const cliente = await clienteModel.findOne({ email });

    if (cliente) {
      return res.status(400).json({ message: "Cliente já está cadastrado." });
    }

    //vendedorId.toString();
    const vendedor = await vendedorModel.findById(vendedorId);

    if (!vendedor) {
      return res.status(400).json({ message: "Vendedor não encontrado." });
    }

    const clienteData = new clienteModel({
      nome,
      idade,
      email,
      telefone,
      cpf,
      cep,
      complemento,
      vendedorId,
      vendedorNome: vendedor.nome,
    });

    await clienteData
      .save()
      .then(() => {
        return res
          .status(200)
          .json({ message: "Cliente cadastrado com sucesso!", clienteData });
      })
      .catch((error) => {
        console.log(error);
        if (error.isCepInvalid) {
          return res.status(400).json({ message: "CEP inválido" });
        } else {
          return res.status(500).json({
            message: "Ocorreu um erro ao cadastrar o cliente. Tente novamente.",
          });
        }
      });
  }

  async ListarClientes(req, res) {
    const clientes = await clienteModel.find({ ativo: true }).sort("nome");

    if (!clientes) {
      return res.status(200).json({ message: "Nenhum cliente encontrado." });
    }

    const listaClientes = [];

    //recuperar data ultima compra
    const promises = clientes.map(async (cliente) => {
      const ultimaCompra = await vendasModel
        .find({ clienteId: cliente._id, ativo: true })
        .sort({ dataCompra: -1 })
        .limit(1)
        .exec();

      listaClientes.push({
        nome_cliente: cliente.nome,
        vendedor: cliente.vendedorNome,
        ultima_compra: ultimaCompra[0].dataCompra,
      });
    });
    await Promise.all(promises);

    return res.status(200).json(listaClientes);
  }

  async ListaCliente(req, res) {
    const { id } = req.params;

    const cliente = await clienteModel.findById(id);

    if (!cliente) {
      return res.status(200).json({ message: "Cliente não encontrado." });
    }

    const compras = await vendasModel
      .find({ clienteId: id })
      .sort({ dataCompra: -1 });
    const compras_resumo = [];

    compras.forEach((compra) => {
      compras_resumo.push({
        compra_id: compra._id,
        compra_data: compra.dataCompra,
        compra_valor: compra.valorCompra,
        forma_pagamento: compra.formaPagamento,
      });
    });
    const clienteData = {
      dados_cliente: {
        cliente_id: cliente._id,
        cliente_nome: cliente.nome,
        cliente_idade: cliente.idade,
        email: cliente.email,
        telefone: cliente.telefone,
        cpf: cliente.cpf,
        cep: cliente.cep,
        endereco: cliente.logradouro,
        bairro: cliente.bairro,
        cidade: cliente.cidade,
        estado: cliente.estado,
      },
      vendedor: {
        nome_vendedor: cliente.vendedorNome,
      },
      compras: compras_resumo,
    };

    return res.status(200).json(clienteData);
  }
}

module.exports = ClienteController;
