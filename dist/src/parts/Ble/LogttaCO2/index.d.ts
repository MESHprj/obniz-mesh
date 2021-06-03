/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import BleBatteryService from '../utils/services/batteryService';
import BleGenericAccess from '../utils/services/genericAccess';
export interface Logtta_CO2Options {
}
export interface Logtta_CO2_Adv_Data {
    co2: number;
    battery: number;
    interval: number;
    address: string;
}
export default class Logtta_CO2 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static isAdvDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): Logtta_CO2_Adv_Data | null;
    private static getName;
    private static get_uuid;
    onNotify?: (co2: number) => void;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
    constructor(peripheral: BleRemotePeripheral | null);
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    getWait(): Promise<number | null>;
    startNotifyWait(): Promise<void>;
    authPinCodeWait(code: string): Promise<void>;
    /**
     * @deprecated
     * @param enable
     */
    setBeaconMode(enable: boolean): Promise<void>;
    setBeaconModeWait(enable: boolean): Promise<void>;
    private checkNumber;
}
