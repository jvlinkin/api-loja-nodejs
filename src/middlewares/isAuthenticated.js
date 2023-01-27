const jwt = require("jsonwebtoken");
const auth = require("../config/auth");
const adminModel = require("../admin/models/adminModel");

function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(400).json({ message: "Usuário não autenticado." });
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    return res.status(400).json({ message: "Token não informado." });
  }
  const secret = auth.jwt.secret;

  try {
    const { usuario_id } = req.params;

    jwt.verify(token, secret, async function (err) {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "Token expirou/inválido." });
      }

      const admin = await adminModel
        .findById(usuario_id)
        .select("+accessToken acessTokenExpires");

      if (!admin) {
        return res
          .status(400)
          .json({ message: "Admin não encontrado no sistema." });
      }

      //Validando se token ainda é válido;
      const now = new Date();
      if (token != admin.accessToken || now > admin.accessTokenExpires) {
        return res
          .status(400)
          .json({ message: "Token incorreto, ou inválido. Tente novamente" });
      }

      return next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Não foi possível acessar a rota no momento. Tente novamente.",
    });
  }
}
module.exports = isAuthenticated;
