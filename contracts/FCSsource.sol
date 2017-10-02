pragma solidity ^0.4.0;

contract FCSsource {
    address public owner;
    address public supplier;
    mapping(uint => uint) public meterValues; // timestamp => value
    uint[] timestamps;

    function FCSsupplier(address _supplier) public {
        owner = msg.sender;
        supplier = _supplier;
    }

    function newMeterValue(uint time, uint value) public {
        meterValues[time] = value;
        timestamps.push(time);
    }

    function getLastMeterValue() public constant returns (uint) {
        return meterValues[timestamps[timestamps.length-1]];
    }
}
