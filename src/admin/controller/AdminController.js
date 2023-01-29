const moment = require("moment");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const adminModel = require("../models/adminModel");
const auth = require("../../config/auth");
const vendasModel = require("../../vendas/models/vendasModel");
const clienteModel = require("../../clientes/models/clientesModel");

class AdminController {
  async Cadastro(req, res) {
    const { nome, email, senha } = req.body;
    const { usuario_id } = req.params;

    const isAdmin = await adminModel.findById(usuario_id);
    if (!isAdmin) {
      return res.status(400).json({ message: "Admin não encontrado." });
    }
    if (!isAdmin.isAdmin) {
      return res.status(400).json({
        message: "Admin não autorizado a fazer esse tipo de operação.",
      });
    }

    const admin = await adminModel.findOne({ email });

    if (admin) {
      return res.status(400).json({ message: "Admin já existe." });
    }

    const salt = await bcrypt.genSalt(15);
    const senhaHash = await bcrypt.hash(senha, salt);

    const usuarioData = new adminModel({
      nome,
      email,
      senha: senhaHash,
    });

    await usuarioData
      .save()
      .then(() => {
        return res.json({
          status: 200,
          message: "Admin cadastrado com sucesso.",
        });
      })
      .catch((erro) => {
        console.log(erro);
        return res.status(500).json({
          message:
            "Ocorreu um erro inseperado ao cadastrar o admin. Tente novamente.",
        });
      });
  }

  async Login(req, res) {
    const { email, senha } = req.body;

    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        statuscode: 400,
        message: "Email/senha estão incorretos. Por favor, tente novamente.",
      });
    }

    const checkSenha = await bcrypt.compare(senha, admin.senha);

    if (checkSenha === false) {
      return res.status(400).json({
        status: 400,
        message: "Email/senha estão incorretos. Por favor, tente novamente.",
      });
    }

    const secret = process.env.APP_SECRET;
    const token = jwt.sign({}, secret, {
      subject: admin.id,
      expiresIn: auth.jwt.expiresIn,
    });

    //Adicionando 1h de validade do token.
    const now = new Date();
    now.setHours(now.getHours() + 1);

    await adminModel.findByIdAndUpdate(admin.id, {
      $set: {
        accessToken: token,
        accessTokenExpires: now,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Login realizado com sucesso",
      token: token,
    });
  }

  async Resumo(req, res) {
    const { usuario_id, mes, ano } = req.params;

    const dados = {
      qtd_vendas_forma_pagamento: {
        pix: 0, //2,
        cartao: 0, //2,
        dinheiro: 0, //2
      },

      total_vendas_forma_pagamento: {
        pix: 0, //2,
        cartao: 0, //2,
        dinheiro: 0, //2
      },

      qtd_total_formas_pagamento: {
        vendas: 0,
      },
      total_vendas: {
        vendas: 0,
      },

      qtd_total_comissao: {
        quantidade: 0,
      },
      clientes_novos: {
        quantidade: 0,
      },
    };

    try {
      //validando se admin tem permissão para gerar o relatório
      const admIsAdmin = await adminModel.findById(usuario_id);
      if (!admIsAdmin.isAdmin) {
        return res.status(400).json({
          message: "Admin não autorizado a fazer esse tipo de operação.",
        });
      }
      const qtdVendasFormaPagamento = await vendasModel
        .aggregate([
          {
            $match: {
              dataCompra: {
                $gte: new Date(`${ano}-${mes}-01T00:00:00.000Z`),
                $lt: new Date(`${ano}-${mes}-31T23:59:59.999Z`),
              },
            },
          },
          {
            $group: {
              _id: "$formaPagamento",
              quantidade: { $sum: 1 },
            },
          },
        ])
        .exec();

      qtdVendasFormaPagamento.forEach((result) => {
        if (result._id === "pix") {
          dados.qtd_vendas_forma_pagamento.pix += result.quantidade;
        } else if (result._id === "dinheiro") {
          dados.qtd_vendas_forma_pagamento.dinheiro += result.quantidade;
        } else if (result._id === "cartão") {
          dados.qtd_vendas_forma_pagamento.cartao += result.quantidade;
        }
      });

      const vlrTotalVendasFormaPagamento = await vendasModel
        .aggregate([
          {
            $match: {
              dataCompra: {
                $gte: new Date(`${ano}-${mes}-01T00:00:00.000Z`),
                $lt: new Date(`${ano}-${mes}-31T23:59:59.999Z`),
              },
            },
          },
          {
            $group: {
              _id: "$formaPagamento",
              totalVendas: { $sum: "$valorCompra" },
            },
          },
        ])
        .exec();

      vlrTotalVendasFormaPagamento.forEach((result) => {
        if (result._id === "pix") {
          dados.total_vendas_forma_pagamento.pix += result.totalVendas;
        } else if (result._id === "dinheiro") {
          dados.total_vendas_forma_pagamento.dinheiro += result.totalVendas;
        } else if (result._id === "cartão") {
          dados.total_vendas_forma_pagamento.cartao += result.totalVendas;
        }
      });

      const qtdTotalVendasFormaPagamento = await vendasModel
        .aggregate([
          {
            $match: {
              dataCompra: {
                $gte: new Date(`${ano}-${mes}-01T00:00:00.000Z`),
                $lt: new Date(`${ano}-${mes}-31T23:59:59.999Z`),
              },
            },
          },
          {
            $group: {
              _id: "$formaPagamento",
              total: { $sum: "$valorCompra" },
            },
          },
        ])
        .exec();

      let total = 0;
      qtdTotalVendasFormaPagamento.forEach((result) => {
        total += result.total;
      });
      dados.qtd_total_formas_pagamento.vendas = Number(total.toFixed(2));

      const totalVendasFormaPagamento = await vendasModel
        .aggregate([
          {
            $match: {
              dataCompra: {
                $gte: new Date(`${ano}-${mes}-01T00:00:00.000Z`),
                $lt: new Date(`${ano}-${mes}-31T23:59:59.999Z`),
              },
            },
          },
          {
            $group: {
              _id: null,
              total_vendas: { $sum: 1 },
            },
          },
        ])
        .exec();
      let totalVendas = 0;
      totalVendasFormaPagamento.forEach((result) => {
        totalVendas += result.total_vendas;
      });
      dados.total_vendas.vendas = totalVendas;

      const qtdTotalComissao = await vendasModel
        .aggregate([
          {
            $match: {
              dataCompra: {
                $gte: new Date(`${ano}-${mes}-01T00:00:00.000Z`),
                $lt: new Date(`${ano}-${mes}-31T23:59:59.999Z`),
              },
            },
          },
          {
            $group: {
              _id: null,
              total_comissao: { $sum: "$valorComissao" },
            },
          },
        ])
        .exec();
      let totalComissao = 0;
      qtdTotalComissao.forEach((result) => {
        totalComissao += result.total_comissao;
      });
      dados.qtd_total_comissao.quantidade = Number(totalComissao.toFixed(2));

      const qtdClientesNovos = await clienteModel
        .aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(`${ano}-${mes}-01T00:00:00.000Z`),
                $lt: new Date(`${ano}-${mes}-31T23:59:59.999Z`),
              },
            },
          },
          {
            $group: {
              _id: null,
              total_clientes: { $sum: 1 },
            },
          },
        ])
        .exec();

      let totalClientes = 0;
      qtdClientesNovos.forEach((result) => {
        totalClientes += result.total_clientes;
      });
      dados.clientes_novos.quantidade = totalClientes;

      return res.json(dados);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Não foi possível gerar o relatório. Tente novamente.",
      });
    }
  }
}

module.exports = AdminController;
