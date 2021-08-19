"use strict";
/**
 * @packageDocumentation
 * @module Parts.EXVital
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = __importDefault(require("../../../obniz/ObnizPartsBleInterface"));
/** EXVital management class EXVitalを管理するクラス */
class EXVital extends ObnizPartsBleInterface_1.default {
    constructor(peripheral) {
        var _a;
        super();
        this.advData = (_a = this._peripheral) === null || _a === void 0 ? void 0 : _a.adv_data;
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'EXVital',
        };
    }
    /**
     * (with instantiation) Get a data from the beacon
     *
     * (インスタンス化する場合) ビーコンからデータを取得
     *
     * @returns received data from the beacon ビーコンから受け取ったデータ
     */
    getData() {
        if (!this.advData)
            throw new Error('advData is null');
        return {
            major: unsigned16(this.advData.slice(11, 13)),
            minor: unsigned16(this.advData.slice(13, 15)),
            power: this.advData[14],
            diastolic_pressure: this.advData[15],
            systolic_pressure: this.advData[16],
            arm_temp: unsigned16(this.advData.slice(17, 19)) * 0.1,
            body_temp: unsigned16(this.advData.slice(19, 21)) * 0.1,
            heart_rate: this.advData[21],
            // blood_oxygen: this.advData[22],
            // fall: this.advData[23] > 0,
            battery: unsigned16(this.advData.slice(24, 26)) * 0.001,
            steps: unsigned16(this.advData.slice(26, 28)),
        };
    }
    /**
     * (without instantiation) Get a data from the beacon
     *
     * (インスタンス化しない場合) ビーコンからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the beacon ビーコンから受け取ったデータ
     */
    static getData(peripheral) {
        if (!EXVital.isDevice(peripheral)) {
            return null;
        }
        const dev = new EXVital(peripheral);
        return dev.getData();
    }
    /**
     * verify that the received peripheral is from the EXVital
     *
     * 受け取ったperipheralがEXVitalのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the EXVital
     *
     * EXVitalかどうか
     */
    static isDevice(peripheral) {
        return (this.DefaultAdvData.filter((d, i) => d !== -1 && d !== peripheral.adv_data[i]).length === 0 &&
            this.DefaultAdvData.length === peripheral.adv_data.length);
    }
}
exports.default = EXVital;
EXVital.partsName = 'EXVital';
EXVital.availableBleMode = 'Beacon';
EXVital.DefaultAdvData = [
    0x02,
    0x01,
    -1,
    0x18,
    0xff,
    0xf5,
    0x03,
    0x04,
    0x02,
    0x00,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
];
const unsigned16 = (value) => {
    return (value[0] << 8) | value[1];
};
