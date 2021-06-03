/**
 * @packageDocumentation
 * @module Parts.UA651BLE
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import BleBatteryService from '../utils/services/batteryService';
import BleGenericAccess from '../utils/services/genericAccess';
export interface UA651BLEOptions {
}
export interface UA651BLEResult {
    SystolicPressure_mmHg?: number;
    DiastolicPressure_mmHg?: number;
    MeanArterialPressure_mmHg?: number;
    SystolicPressure_kPa?: number;
    DiastolicPressure_kPa?: number;
    MeanArterialPressure_kPa?: number;
    bodyMoved?: boolean;
    cuffFitLoose?: boolean;
    irregularPulseDetected?: boolean;
    improperMeasurement?: boolean;
    PulseRate?: number;
    date?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
}
export default class UA651BLE implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    onNotify?: (co2: number) => void;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
    private _timezoneOffsetMinute;
    constructor(peripheral: BleRemotePeripheral | null, timezoneOffsetMinute: number);
    getDataWait(): Promise<UA651BLEResult[]>;
    private _readSFLOAT_LE;
    private _analyzeData;
    private _getChars;
    private _writeTimeCharWait;
}
