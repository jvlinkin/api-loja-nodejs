const clienteModel = require("../models/clientesModel");
const vendedorModel = require("../../vendedores/models/vendedorModel");
const vendasModel = require("../../vendas/models/vendasModel");
const adminModel = require("../../admin/models/adminModel");

class ClienteController {
  async CadastrarCliente(req, res) {
    const { nome, idade, email, telefone, cpf, cep, complemento, vendedorId } =
      req.body;

    const cliente = await clienteModel.findOne({ email });

    if (cliente) {
      return res.status(400).json({ message: "Cliente já está cadastrado." });
    }

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
        return res.status(200).json({
          status: 200,
          message: "Cliente cadastrado com sucesso!",
        });
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
    const clientes = await clienteModel
      .find({ ativo: true })
      .sort({ nome: 1 })
      .exec();

    if (!clientes) {
      return res.status(404).json({ message: "Nenhum cliente encontrado." });
    }

    const listaClientes = [];

    const promises = clientes.map(async (cliente) => {
      const ultimaCompra = await vendasModel
        .find({ clienteId: cliente._id, ativo: true })
        .sort({ dataCompra: -1 })
        .limit(1)
        .exec();

      let dataCompra = undefined;
      if (ultimaCompra.length > 0) {
        dataCompra = ultimaCompra[0].dataCompra;
      }

      listaClientes.push({
        nome_cliente: cliente.nome,
        vendedor: cliente.vendedorNome,
        ultima_compra: dataCompra,
      });
    });
    await Promise.all(promises);

    //A lista não estava vindo de forma alfabética, pois a operação dentro do map é assíncrona. Correção:
    listaClientes.sort((a, b) => a.nome_cliente.localeCompare(b.nome_cliente));

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

  async Editar(req, res) {
    const { id, usuario_id } = req.params;
    const clienteBody = req.body;

    try {
      const isAdmin = await adminModel.findById(usuario_id);
      if (!isAdmin.isAdmin) {
        return res.status(400).json({
          message: "Admin não tem permissão para executar essa ação.",
        });
      }

      const cliente = await clienteModel.findById(id);

      if (!cliente) {
        return res.status(200).json({ message: "Cliente não encontrado." });
      }

      if (Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ message: "Naõ existe nenhum dado para atualizar." });
      }

      const clienteData = {
        ...clienteBody,
      };

      const dados_atualizados = await clienteModel.findByIdAndUpdate(
        id,
        clienteData
      );

      return res.status(200).json({
        status: 200,
        message: "Dados atualizados com sucesso.",
      });
    } catch (error) {
      console.log("ERRO: ", error);
      return res
        .status(500)
        .json({ message: "Ocorreu um erro, tente novamente" });
    }
  }
}

module.exports = ClienteController;
