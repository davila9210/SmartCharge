pragma solidity ^0.4.0;

contract FCSsource {
    address public owner;
    address public supplier;
    mapping(uint => uint) public meterValues; // timestamp => value
    uint[] timestamps;

    struct saleDeal {
        uint chargeSpeed;
        uint chargestationId;
    }
    mapping(uint => saleDeal) public saleDeals; // uint = dealid
    uint[] public activeDeals;

    uint public impossibleDeliveries;

    event DropUser(
        uint val1,
        uint val2
    );

    function FCSsource(address _supplier) public {
        owner = msg.sender;
        supplier = _supplier;
        impossibleDeliveries = 0;
    }

    function newMeterValue(uint time, uint value) public {
        if(timestamps.length > 0 && activeDeals.length > 0) {
            validateAvailability(getLastMeterValue(), value);
        }
        meterValues[time] = value;
        timestamps.push(time);
    }

    function validateAvailability(uint oldValue, uint newValue) public constant returns (bool) {
        uint sumDeals = 0;
        uint oldestDeal = 999999999999;
        bool availableNow = true;
        for (uint i = 0; i < activeDeals.length; i++) {
            sumDeals += saleDeals[activeDeals[i]].chargeSpeed;
            if(activeDeals[i] < oldestDeal) {
                oldestDeal = activeDeals[i];
            }
        }
        if(newValue - oldValue < sumDeals) {
            impossibleDeliveries++;
            availableNow = false;
        }
        else {
            impossibleDeliveries = 0;
        }
        if(impossibleDeliveries > 3) {
            DropUser(sumDeals, oldestDeal);
        }
        return availableNow;
    }

    function getLastMeterValue() public constant returns (uint) {
        return meterValues[timestamps[timestamps.length-1]];
    }

    function newSaleDeal(uint chargeSpeed, uint dealId, uint chargestationId) public {
        saleDeals[dealId].chargeSpeed = chargeSpeed;
        saleDeals[dealId].chargestationId = chargestationId;
        activeDeals.push(dealId);
    }

    function stopSaleDeal(uint dealId) public {
        uint indexOfDeal = getDeal(dealId);
        activeDeals = removeFromArray(activeDeals, indexOfDeal);
    }

    function getDeal(uint dealId) constant returns (uint) {
        uint indexOfDeal = 999999999999;
        for (uint i = 0; i < activeDeals.length; i++) {
            if(activeDeals[i] == dealId) {
                indexOfDeal = i;
            }
        }
        return indexOfDeal;
    }

    function removeFromArray(uint[] array, uint index) internal returns(uint[] value) {
        if (index >= array.length) return;

        uint[] memory arrayNew = new uint[](array.length-1);
        for (uint i = 0; i<arrayNew.length; i++){
            if(i != index && i<index){
                arrayNew[i] = array[i];
            } else {
                arrayNew[i] = array[i+1];
            }
        }
        delete array;
        return arrayNew;
    }

    function activeDealsLength() constant returns (uint) { // TODO not used
        return activeDeals.length;
    }
    function activeDealInfo(uint aaa) constant returns (uint) { // TODO not used
        return activeDeals[aaa];
    }

    function getDealInfo(uint dealId) constant returns (uint) { // TODO not used
        return saleDeals[dealId].chargestationId;
    }
}