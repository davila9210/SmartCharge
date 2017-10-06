# SmartCharge

For the Blockchain for Social Impact Hackathon

## Installation

0. Clone repository and download dependencies
    ```javascript
    git clone https://github.com/davila9210/SmartCharge.git
    npm install
    ```

1. Install truffle and an ethereum client. For now, use TestRPC
    ```javascript
    npm install -g truffle // Version 3.0.5+ required.
    npm install -g ethereumjs-testrpc
    ```

2. Run TestRPC
    ```javascript
    testrpc
    ```

3. Compile and migrate the contracts.
    ```javascript
    truffle compile
    truffle migrate
    ```

4. Run the webpack server
    ```javascript
    npm run start
    ```
You're now running your own demo of smart charge!

## FAQ

Ask David Lamers - david@a80.nl