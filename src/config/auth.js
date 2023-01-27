authjwt = {
  jwt: {
    secret: process.env.APP_SECRET,
    expiresIn: "1h",
  },
};

module.exports = authjwt;
