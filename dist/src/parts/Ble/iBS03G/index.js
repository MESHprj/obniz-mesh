"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class iBS03G extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS03G;
    }
}
exports.default = iBS03G;
iBS03G.PartsName = 'iBS03G';
iBS03G.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, button: iBS_1.BaseiBS.Config.button, moving: iBS_1.BaseiBS.Config.moving, fall: iBS_1.BaseiBS.Config.fall }, iBS_1.BaseiBS.getUniqueData(3, 0x16));
