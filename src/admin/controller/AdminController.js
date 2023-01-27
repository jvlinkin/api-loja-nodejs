const moment = require("moment");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const adminModel = require("../models/adminModel");
const auth = require("../../config/auth");

class AdminController {
  async Cadastro(req, res) {
    const { nome, email, senha } = req.body;

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
}

module.exports = AdminController;
