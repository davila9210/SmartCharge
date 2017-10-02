# SmartCharge

For the Blockchain for Social Impact Hackathon

## Installation

1. Install truffle and an ethereum client. For local development, try EthereumJS TestRPC.
    ```javascript
    npm install -g truffle // Version 3.0.5+ required.
    npm install -g ethereumjs-testrpc
    ```

2. Compile and migrate the contracts.
    ```javascript
    truffle compile
    truffle migrate
    ```

3. Run the webpack server for front-end hot reloading. For now, smart contract changes must be manually recompiled and migrated.
    ```javascript
    npm run start
    ```


## FAQ

* __Test

    Hi