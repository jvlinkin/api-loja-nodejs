const clienteModel = require("../../clientes/models/clientesModel");
const vendedorModel = require("../../vendedores/models/vendedorModel");
const vendasModel = require("../models/vendasModel");
const moment = require("moment");
class VendasController {
  async cadastrarVenda(req, res) {
    const { clienteId, vendedorId, valorCompra, formaPagamento } = req.body;

    const cliente = await clienteModel.findById(clienteId);
    if (!cliente) {
      return res.status(400).json({ message: "Cliente não encontrado." });
    }

    const vendedor = await vendedorModel.findById(vendedorId);
    if (!vendedor) {
      return res.status(400).json({ message: "Vendedor não encontrado." });
    }
    if (
      formaPagamento != "pix" &&
      formaPagamento != "dinheiro" &&
      formaPagamento != "cartão"
    ) {
      return res.status(400).json({ message: "Forma de pagamento inválida" });
    }

    //o vendedor não consegue vender pra um cliente que não seja um cliente DELE.
    if (cliente.vendedorId != vendedorId) {
      return res.status(400).json({
        message: "Vendedor não autorizado a vender para esse cliente",
      });
    }

    const vendaData = new vendasModel({
      clienteId,
      nomeCliente: cliente.nome,
      vendedorId,
      nomeVendedor: vendedor.nome,
      valorCompra,
      formaPagamento,
    });

    await vendaData
      .save()
      .then(() => {
        return res
          .status(200)
          .json({ message: "Venda cadastrada com sucesso!" });
      })
      .catch((err) => {
        console.log("ERRO: ", err);
        return res.status(400).json({
          message: "Ocorreu um erro ao cadastrar a venda. Tente novamente.",
        });
      });
  }

  async listatodos(req, res) {
    const vendas = await vendasModel
      .find({ ativo: true })
      .sort({ dataCompra: -1 });

    if (!vendas) {
      return res.status(203).json({ message: "Não há vendas" });
    }

    const listaVendas = [];

    vendas.map((venda) => {
      listaVendas.push({
        id_venda: venda._id,
        nome_cliente: venda.nomeCliente,
        valor_venda: venda.valorCompra,
        data_compra: venda.dataCompra,
      });
    });

    return res.status(200).json(listaVendas);
  }

  async listavenda(req, res) {
    const { id } = req.params;
    const venda = await vendasModel.findById(id);

    if (!venda) {
      return res.status(200).json({ message: "Nenhuma venda encontrada." });
    }
    const cliente = await clienteModel.findById(venda.clienteId);

    if (!cliente) {
      return res.status(200).json({ message: "Nenhum cliente encontrado." });
    }

    const venda_info = {
      dados_venda: {
        id_venda: venda._id,
        nome_cliente: venda.nomeCliente,
        data_venda: venda.dataCompra,
        valor_venda: venda.valorCompra,
        forma_pagamento: venda.formaPagamento,
      },
      dados_cliente: {
        id_cliente: cliente._id,
        nome_cliente: cliente.nome,
        idade_cliente: cliente.idade,
        cliente_email: cliente.email,
        cliente_telefone: cliente.telefone,
        cliente_cep: cliente.cep,
        cliente_endereco: cliente.logradouro,
        cliente_bairro: cliente.bairro,
        cliente_cidade: cliente.cidade,
        cliente_estado: cliente.estado,
      },
      vendedor: {
        nome_vendedor: venda.nomeVendedor,
      },
    };

    return res.status(200).json(venda_info);
  }

  async Editar(req, res) {
    const { id } = req.params;
    const vendaBody = req.body;

    try {
      const venda = await vendasModel.findById(id);

      if (!venda) {
        return res.status(200).json({ message: "Venda não encontrada." });
      }

      if (Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ message: "Naõ existe nenhum dado para atualizar." });
      }

      const vendaData = {
        ...vendaBody,
      };

      await vendasModel.findByIdAndUpdate(id, vendaData);

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

  async ResumoPorMes(req, res) {}
}

module.exports = VendasController;
