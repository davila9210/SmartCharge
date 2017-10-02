module.exports = {
    migrations_directory: "./migrations",
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        live: {
            network_id: 3,
            host: "localhost",
            port: 8545   // Different than the default below
        }
    },
    rpc: {
        host: "localhost",
        port: 8545
    }
};
