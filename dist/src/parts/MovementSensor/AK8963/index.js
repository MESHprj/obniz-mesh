"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class AK8963 {
    constructor() {
        this._adc_cycle = 0;
        this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "address", "adb_cycle"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "AK8963",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
        this._address = this.params.address || 0x0c;
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.setConfig(this.params.adc_cycle || 8);
    }
    setConfig(ADC_cycle) {
        switch (ADC_cycle) {
            case 8:
                this.i2c.write(this._address, [0x0a, 0x12]);
                break;
            case 100:
                this.i2c.write(this._address, [0x0a, 0x16]);
                break;
            default:
                throw new Error("ADC_cycle variable 8,100 setting");
        }
        this._adc_cycle = ADC_cycle;
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this._address, [0x03]); // request AK8963 data
            const raw_data_AK8963 = yield this.i2c.readWait(this._address, 7); // read 7byte(read mag_data[6] to refresh)
            return {
                x: this.char2short(raw_data_AK8963[0], raw_data_AK8963[1]),
                y: this.char2short(raw_data_AK8963[2], raw_data_AK8963[3]),
                z: this.char2short(raw_data_AK8963[4], raw_data_AK8963[5]),
            };
        });
    }
    char2short(valueH, valueL) {
        const buffer = new ArrayBuffer(2);
        const dv = new DataView(buffer);
        dv.setUint8(0, valueH);
        dv.setUint8(1, valueL);
        return dv.getInt16(0, false);
    }
}
exports.default = AK8963;

//# sourceMappingURL=index.js.map
