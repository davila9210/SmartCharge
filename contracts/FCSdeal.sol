pragma solidity ^0.4.0;

import "./FCSsource.sol";

// https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity

contract FCSdeal {
    address public owner;

    struct deal {
        address source; //bron
        uint sourcePrice;
        string supplier;
        string dso;
        uint dsoPrice;
        uint chargeStation;
        uint startValueStation;
        uint etherPaid;
        uint chargeAmount;
        address user;
    }
    mapping(uint => deal) public deals; //address = userAccount
    uint[] dealIndex;

    struct chargeStation {
        bool isEntity;
        address walletAddress;
        mapping(uint => uint) meterValues; // timestamp => value
        uint[] timestamps;
        string dso;
    }
    mapping(uint => chargeStation) chargeStations; // uint = id chargestation

    event StartCharge(
        uint chargeStation,
        uint chargeAmount,
        uint dealId
    );

    event StopCharge(
        uint chargeStation,
        uint endValueStation
    );

    function FCSdeal() public {
        owner = msg.sender;
    }

    function registerChargestation(uint id, string dso) public {
        chargeStations[id].walletAddress = msg.sender;
        chargeStations[id].isEntity = true;
        chargeStations[id].dso = dso;
    }

    function newMeterValue(uint id, uint timestamp, uint initialMeterValue) public {
        chargeStations[id].meterValues[timestamp] = initialMeterValue;
        chargeStations[id].timestamps.push(timestamp);
    }

    function getChargestationInfo(uint id) public constant returns (uint, string) {
        chargeStation storage station = chargeStations[id];
        return (station.meterValues[station.timestamps[station.timestamps.length-1]], station.dso);
    }

    //Payable
    //Validate price
    function newDeal(address source, uint sourcePrice, string supplier, string dso, uint dsoPrice, uint chargeStation, uint startValueStation, uint chargeAmount) public payable {
        deals[dealIndex.length].source = source;
        deals[dealIndex.length].sourcePrice = sourcePrice;
        deals[dealIndex.length].supplier = supplier;
        deals[dealIndex.length].dso = dso;
        deals[dealIndex.length].dsoPrice = dsoPrice;
        deals[dealIndex.length].chargeStation = chargeStation;
        deals[dealIndex.length].startValueStation = startValueStation;
        deals[dealIndex.length].etherPaid = msg.value;
        deals[dealIndex.length].chargeAmount = chargeAmount;
        StartCharge(chargeStation, chargeAmount, dealIndex.length);
        dealIndex.push(dealIndex.length);
    }

    function finishDeal(uint dealId, uint endValueStation) {
        deal currentDeal = deals[dealId];
        FCSsource(currentDeal.source).supplier().send(currentDeal.etherPaid);
        StopCharge(deals[dealId].chargeStation, endValueStation);
    }
}
