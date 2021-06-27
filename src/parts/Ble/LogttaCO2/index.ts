/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBleCompare,
  ObnizPartsBleConnectable,
  ObnizPartsBleMode,
  uintBE,
} from '../../../obniz/ObnizPartsBleAbstract';
import BleBatteryService from '../utils/services/batteryService';
import BleGenericAccess from '../utils/services/genericAccess';

export interface Logtta_CO2Options {}

export interface Logtta_CO2_Data {
  co2: number;
  battery: number;
  interval: number;
  address: string; // TODO: delete
}

export type Logtta_CO2_Connected_Data = number;

type PinCodeType = 'Authentication' | 'Rewrite';

const PinCodeFlag: { [type in PinCodeType]: number } = {
  Authentication: 0x00,
  Rewrite: 0x01,
};

export default class Logtta_CO2 extends ObnizPartsBleConnectable<
  Logtta_CO2_Data,
  Logtta_CO2_Connected_Data
> {
  public static readonly PartsName = 'Logtta_CO2';

  public static readonly AvailableBleMode: ObnizPartsBleMode[] = [
    'Connectable',
    'Beacon',
  ];

  public static readonly LocalName = {
    Connectable: /CO2 Sensor/,
    Beacon: /null/,
  };

  public static readonly BeaconDataLength = {
    Connectable: undefined,
    Beacon: 0x1b,
  };

  public static readonly CompanyID = {
    Connectable: undefined,
    Beacon: [0x10, 0x05],
  };

  public static readonly BeaconDataStruct: ObnizPartsBleCompare<
    ObnizBleBeaconStruct<Logtta_CO2_Data>
  > = {
    Connectable: undefined,
    Beacon: {
      appearance: {
        index: 0,
        type: 'check',
        data: 0x02,
      },
      co2: {
        index: 1,
        length: 2,
        type: 'unsignedNumBE',
      },
      battery: {
        index: 5,
        type: 'unsignedNumBE',
      },
      interval: {
        index: 6,
        length: 2,
        type: 'unsignedNumBE',
      },
      /* alert: {
        index: 8,
        type: 'uint8',
      },
      name: {
        index: 9,
        length: 15,
        type: 'string',
      } */
      // TODO: delete
      address: {
        index: 0,
        type: 'custom',
        func: (data, peripheral) => peripheral.address,
      },
    },
  };

  protected readonly staticClass = Logtta_CO2;

  protected authenticated = false;
  public onNotify?: (co2: number) => void;
  public genericAccess?: BleGenericAccess;
  public batteryService?: BleBatteryService;

  public async connectWait(keys?: string): Promise<void> {
    await super.connectWait(keys);

    const service1800 = this.peripheral.getService('1800');
    if (service1800) {
      this.genericAccess = new BleGenericAccess(service1800);
    }
    const service180F = this.peripheral.getService('180F');
    if (service180F) {
      this.batteryService = new BleBatteryService(service180F);
    }
  }

  protected async beforeOnDisconnectWait(): Promise<void> {
    this.authenticated = false;
    this.genericAccess = undefined;
    this.batteryService = undefined;
  }

  public async getDataWait(): Promise<number> {
    this.checkConnected();

    const data = await this.readCharWait(
      this.getUuid('AB20'),
      this.getUuid('AB21')
    );
    return uintBE(data);
  }

  /** @deprecated */
  public async getWait(): Promise<number | null> {
    try {
      return await this.getDataWait();
    } catch {
      return null;
    }
  }

  public async startNotifyWait(callback: (co2: number) => void): Promise<void> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
    } catch (e) {
      console.error(e);
      return;
    }

    // TODO: delete if
    if (callback) this.onNotify = callback;
    return await this.subscribeWait(
      this.getUuid('AB20'),
      this.getUuid('AB21'),
      (data: number[]) => {
        if (this.onNotify) {
          this.onNotify(uintBE(data));
        }
      }
    );
  }

  public async authPinCodeWait(code: string | number): Promise<boolean> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
    } catch (e) {
      console.error(e);
      return false;
    }
    if (this.authenticated) return true;

    if (typeof code === 'string') code = parseInt(code); // TODO: delete string type
    this.authenticated = await this.sendPinCodeWait('Authentication', code);
    return this.authenticated;
  }

  public async changeAuthPinCodeWait(code: number): Promise<boolean> {
    this.checkConnected();
    this.checkAuthenticated();

    return await this.sendPinCodeWait('Rewrite', code);
  }

  protected async sendPinCodeWait(
    type: PinCodeType,
    code: number
  ): Promise<boolean> {
    if (code < 0 || code > 9999)
      throw new Error(
        `Authorization code can only be entered from 0000~9999. input: ${code}`
      );

    return await this.writeCharWait(
      this.getUuid('AB20'),
      this.getUuid('AB30'),
      [
        PinCodeFlag[type],
        Math.floor(code / 1000) % 10 | Math.floor(code / 100) % 10,
        Math.floor(code / 10) % 10 | Math.floor(code / 1) % 10,
      ]
    );
  }

  protected checkAuthenticated(): void {
    if (!this.authenticated)
      throw new Error(
        'Certification is required, execute authPinCodeWait() in advance.'
      );
  }

  /**
   * @deprecated
   * @param enable
   */
  public setBeaconMode(enable: boolean): Promise<boolean> {
    return this.setBeaconModeWait(enable);
  }

  public async setBeaconModeWait(enable: boolean): Promise<boolean> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
      this.checkAuthenticated();
    } catch (e) {
      console.error(e);
      return false;
    }

    return this.writeCharWait(this.getUuid('AB20'), this.getUuid('AB2D'), [
      enable ? 1 : 0,
    ]);
  }

  protected getName(): string {
    const array = this.peripheral.adv_data.slice(16);
    return array
      .slice(0, array.indexOf(0) + 1)
      .map((d) => String.fromCharCode(d))
      .join('');
  }

  protected getUuid(uuid: string): string {
    return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
  }
}
