/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';

class WSCommandTcp extends WSCommand {
  public module: number;
  public _MaxPort: number;
  public _CommandConnect: number;
  public _CommandClose: number;
  public _CommandConnection: number;
  public _CommandWrite: number;
  public _CommandRead: number;

  constructor() {
    super();
    this.module = 13;
    this._MaxPort = 8;

    this._CommandConnect = 0;
    this._CommandClose = 1;
    // Notification
    this._CommandConnection = 2;
    this._CommandWrite = 3;
    // Notification
    this._CommandRead = 4;
  }

  public connect(params: any, index: any) {
    const domain = new Uint8Array(Buffer.from(params.connect.domain, 'utf8'));
    const buf = new Uint8Array(domain.length + 3);
    buf[0] = index;
    buf[1] = 0xff && params.connect.port >> 8;
    buf[2] = 0xff && params.connect.port;
    for (let i = 0; i < domain.length; i++) {
      buf[3 + i] = domain[i];
    }
    this.sendCommand(this._CommandConnect, buf);
  }

  public disconnect(params: any, index: any) {
    const buf = new Uint8Array([index]);
    this.sendCommand(this._CommandClose, buf);
  }

  public write(params: any, index: any) {
    const buf = new Uint8Array(params.write.data.length + 1);
    buf[0] = index;
    for (let i = 0; i < params.write.data.length; i++) {
      buf[1 + i] = params.write.data[i];
    }
    this.sendCommand(this._CommandWrite, buf);
  }

  public parseFromJson(json: any) {
    for (let i = 0; i < this._MaxPort; i++) {
      const module = json['tcp' + i];
      if (module === undefined) {
        continue;
      }

      const schemaData = [
        { uri: '/request/tcp/connect', onValid: this.connect },
        { uri: '/request/tcp/disconnect', onValid: this.disconnect },
        { uri: '/request/tcp/write', onValid: this.write },
      ];
      const res = this.validateCommandSchema(schemaData, module, 'tcp' + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[tcp${i}]unknown command`);
        }
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: number, payload: Uint8Array) {
    switch (func) {
      case this._CommandConnect: {
        let state = 'Error';
        switch (payload[1]) {
          case 0:
            state = 'ok';
            break;
          case 1:
            state = 'Port Used';
            break;
          case 2:
            state = 'Port Area Error';
            break;
          case 3:
            state = 'Lookup Error';
            break;
          case 4:
            state = 'Error';
            break;
        }
        const module_index = payload[0];
        objToSend['tcp' + module_index] = {
          connect: {
            message: state,
            code: payload[1],
          },
        };
        break;
      }
      case this._CommandConnection:
        if (payload.length === 2 && payload[1] === 0) {
          const module_index = payload[0];
          objToSend['tcp' + module_index] = {
            connection: {
              connected: true,
            },
          };
        } else {
          const module_index = payload[0];
          objToSend['tcp' + module_index] = {
            connection: {
              connected: false,
            },
          };
        }
        break;
      case this._CommandRead:
        if (payload.length >= 1) {
          const module_index = payload[0];
          const arr = new Array(payload.byteLength - 1);
          for (let i = 0; i < arr.length; i++) {
            arr[i] = payload[i + 1];
          }
          objToSend['tcp' + module_index] = {
            read: {
              data: arr,
            },
          };
        }
        break;
    }
  }
}

export default WSCommandTcp;
