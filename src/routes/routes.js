const { Router } = require("express");
const routes = Router();
const vendedorRoutes = require("../vendedores/routes/vendedorRoutes");
const vendasRoutes = require("../vendas/routes/vendasRoutes");
const clientesRoutes = require("../clientes/routes/clientesRoutes");

//rota teste
routes.get("/", (req, res) => {
  return res.json({ message: "API funcionando." });
});

routes.use("/vendedores", vendedorRoutes);
routes.use("/vendas", vendasRoutes);
routes.use("/clientes", clientesRoutes);

module.exports = routes;
