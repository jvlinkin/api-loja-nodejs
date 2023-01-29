const vendedorModel = require("../models/vendedorModel");
const adminModel = require("../../admin/models/adminModel");
const moment = require("moment");
const mongoose = require("mongoose");
const vendasModel = require("../../vendas/models/vendasModel");

class VendedorController {
  async cadastrarVendedor(req, res) {
    const { usuario_id } = req.params; //admin
    const { nome, idade, cidade, email, porcentagemComissao } = req.body;

    const isAdmin = await adminModel.findById(usuario_id);
    if (!isAdmin.isAdmin) {
      return res.status(400).json({
        message: "Admin não autorizado a fazer esse tipo de operação.",
      });
    }

    const user = await vendedorModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Vendedor já existe." });
    }

    const userData = new vendedorModel({
      nome,
      idade,
      cidade,
      email,
      porcentagemComissao,
    });

    await userData
      .save()
      .then(() => {
        return res
          .status(200)
          .json({ message: "Vendedor cadastrado com sucesso!" });
      })
      .catch((err) => {
        console.log("ERRO: ", err);
        return res.status(400).json({
          message: "Ocorreu um erro ao cadastrar o vendedor. Tente novamente.",
        });
      });
  }

  async listaTodos(req, res) {
    const vendedores = await vendedorModel.find({ ativo: true }).sort("nome");

    if (!vendedores) {
      return res.status(200).json({ message: "Nenhum vendedor encontrado." });
    }

    const horaAtual = moment();
    const listaVendedores = [];

    vendedores.map((vendedor) => {
      const horaEntrada = moment(vendedor.horaEntrada, "HH:mm");
      const horaSaida = moment(vendedor.horaSaida, "HH:mm");
      const trabalhando = horaAtual.isBetween(horaEntrada, horaSaida)
        ? "Sim"
        : "Não";

      listaVendedores.push({
        nome: vendedor.nome,
        trabalhando: trabalhando,
      });
    });

    return res.json(listaVendedores);
  }

  async ListaVendedor(req, res) {
    const { id } = req.params;
    const vendedor = await vendedorModel.findById(id);

    if (!vendedor) {
      return res.status(400).json({ message: "Vendedor não encontrado." });
    }

    const quantidadeVendas = await vendasModel.find({ vendedorId: id }).count(); //quantidade de vendas.

    const somaVendas = await vendasModel
      .aggregate([
        {
          $match: { vendedorId: mongoose.Types.ObjectId(id) }, // usar o id do vendedor para filtrar
        },
        {
          $group: { _id: null, total: { $sum: "$valorCompra" } }, // somar todos os valores de valorCompra
        },
      ])
      .exec();
    //console.log(somaVendas[0]);

    const vendedor_info = {
      dados_vendedor: {
        id_vendedor: vendedor._id,
        nome_vendedor: vendedor.nome,
        idade_vendedor: vendedor.idade,
        cidade_vendedor: vendedor.cidade,
        email_vendedor: vendedor.email,
        data_contratacao: vendedor.dataContratacao,
        hr_entrada: vendedor.horaEntrada,
        hr_saida: vendedor.horaSaida,
      },
      resumo_vendas: {
        quantidade_vendas: quantidadeVendas, //2
        valor_total_vendas: somaVendas[0].total, //soma dos valores;
        comissao: somaVendas[0].total * vendedor.porcentagemComissao,
      },
    };

    return res.status(200).json(vendedor_info);
  }

  async Editar(req, res) {
    const { id, usuario_id } = req.params;
    const vendedorBody = req.body;

    try {
      const isAdmin = await adminModel.findById(usuario_id);
      if (!isAdmin) {
        return res.status(400).json({ message: "Admin não encontrado." });
      }

      if (!isAdmin.isAdmin) {
        return res.status(400).json({ message: "Admin não tem permissão." });
      }
      const vendedor = await vendedorModel.findById(id);

      if (!vendedor) {
        return res.status(200).json({ message: "Vendedor não encontrado." });
      }

      if (Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ message: "Naõ existe nenhum dado para atualizar." });
      }

      const vendedorData = {
        ...vendedorBody,
      };

      await vendedorModel.findByIdAndUpdate(id, vendedorData);

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

module.exports = VendedorController;
