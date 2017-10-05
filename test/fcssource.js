var FCSsource = artifacts.require("./FCSsource.sol");

contract('FCSsource', function (accounts) {
    it("...should save supplier.", function () {
        return FCSsource.deployed().then(function (instance) {
            FCSsourceInstance = instance;
            return FCSsourceInstance.supplier.call();
        }).then(function (storedData) {
            assert.equal(storedData, "0x05a7720136ef54d015c7d113aa3eba0d081d7aaf", "Supplier check");
            return FCSsourceInstance.impossibleDeliveries.call();
        }).then(function (imp) {
            assert.equal(imp, 0, "The value 89 was not stored.");
        });
    });
    it("...should save impossible deliveries", function () {
        return FCSsource.deployed().then(function (instance) {
            FCSsourceInstance = instance;
            return FCSsourceInstance.impossibleDeliveries.call();
        }).then(function (imp) {
            assert.equal(imp.c[0], 0, "save impossible error");
        });
    });
    it("...save meter values", function () {
        return FCSsource.deployed().then(function (instance) {
            FCSsourceInstance = instance;
            return FCSsourceInstance.newMeterValue(19400, 100);
        }).then(function () {
            return FCSsourceInstance.getLastMeterValue();
        }).then(function (lastMeterValue) {
            assert.equal(lastMeterValue.c[0], 100, "save metervalue error");
            return FCSsourceInstance.newMeterValue(19500, 120);
        }).then(function () {
            return FCSsourceInstance.getLastMeterValue();
        }).then(function (lastMeterValue2) {
            assert.equal(lastMeterValue2.c[0], 120, "save metervalue error 2");
        });
    });
    it("...should limit it sales", function () {
        return FCSsource.deployed().then(function (instance) {
            FCSsourceInstance = instance;
            return FCSsourceInstance.newSaleDeal(30, 1, 2);
        }).then(function () {
            return FCSsourceInstance.validateAvailability(100, 150);
        }).then(function (wasAvailable) {
            assert.equal(wasAvailable, true, "sale error");
            return FCSsourceInstance.newSaleDeal(30, 3, 4);
        }).then(function () {
            return FCSsourceInstance.validateAvailability(100, 150);
        }).then(function (wasAvailable2) {
            assert.equal(wasAvailable2, false, "sale error 2");
        });
    });
});