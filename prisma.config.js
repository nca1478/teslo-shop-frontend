module.exports = {
    datasource: {
        url:
            process.env.DATABASE_URL ||
            "postgresql://postgres:postgres@localhost:5434/teslo-shop?schema=public",
    },
};
