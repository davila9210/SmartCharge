var FCSdeal = artifacts.require("./FCSdeal.sol");
var FCSsource = artifacts.require("./FCSsource.sol");

contract('FCSdeal', function (accounts) {
    it("...should register chargestation, save meter value and give chargesstationinfo", function () {
        return FCSdeal.deployed().then(function (instance) {
            FCSdealInstance = instance;
            return FCSdealInstance.registerChargestation(1, 'http://dom.ext');
        }).then(function () {
            return FCSdealInstance.getChargestationInfo(1);
        }).then(function (chargeStationInfo) {
            assert.equal(chargeStationInfo[0], 0, "Zero metervalue check");
            assert.equal(chargeStationInfo[1], 'http://dom.ext', "DSO check");
            return FCSdealInstance.newMeterValue(1, 19500, 110);
        }).then(function () {
            return FCSdealInstance.getChargestationInfo(1);
        }).then(function (chargeStationInfo) {
            assert.equal(chargeStationInfo[0], 110, "Increased metervalue check");
        });
    });
    // it("...should save a deal, register deal at source and stop deal", function () {
    //     return FCSsource.deployed().then(function (instance) {
    //         FCSsourceInstance = instance;
    //         return FCSdeal.deployed();
    //     }).then(function (instance) {
    //         FCSdealInstance = instance;
    //         let watch = FCSdealInstance.StartCharge(function(error, result){
    //             watch.stopWatching();
    //             assert.equal(result.args === null, false, "Start charge event fired");
    //             FCSsourceInstance.validateAvailability(100, 101).then(function(wasAvailable){
    //                 assert.equal(wasAvailable, false, "Check if deal was registered at source");
    //             });
    //         });
    //         return FCSdealInstance.newDeal(FCSsourceInstance.address, 1, "X", "R", 3, 2, 100, 50);
    //     });
    // });
    it("...should be able to have more deals", function () {
        return FCSsource.deployed().then(function (instance) {
            FCSsourceInstance = instance;
            return FCSdeal.deployed();
        }).then(function (instance) {
            FCSdealInstance = instance;
            let registeredDevices = [];
            let watch = FCSdealInstance.StartCharge(function(error, result){
                if(result.args) {
                    registeredDevices.push(result.args.dealId.c[0]);
                    if (registeredDevices.length === 4) {
                        watch.stopWatching();
                        console.log(registeredDevices);
                    }
                }
            });
            return FCSdealInstance.newDeal(FCSsourceInstance.address, 1, "X", "R", 3, 2, 100, 50);
        }).then(function () {
            setTimeout(function(){
                return FCSdealInstance.newDeal(FCSsourceInstance.address, 1, "X", "R", 3, 2, 100, 50);
            }, 2000);
        }).then(function () {
            setTimeout(function(){
                return FCSdealInstance.newDeal(FCSsourceInstance.address, 1, "X", "R", 3, 2, 100, 50);
            }, 5000);
        });
    });
});