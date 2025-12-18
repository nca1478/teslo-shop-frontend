module.exports = {
    datasource: {
        url:
            process.env.DATABASE_URL ||
            "postgresql://postgres:postgres@localhost:5433/teslo-shop?schema=public",
    },
};
