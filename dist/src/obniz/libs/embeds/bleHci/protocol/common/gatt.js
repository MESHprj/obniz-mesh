"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-namespace
var ATT;
(function (ATT) {
    ATT.OP_ERROR = 0x01;
    ATT.OP_MTU_REQ = 0x02;
    ATT.OP_MTU_RESP = 0x03;
    ATT.OP_FIND_INFO_REQ = 0x04;
    ATT.OP_FIND_INFO_RESP = 0x05;
    ATT.OP_READ_BY_TYPE_REQ = 0x08;
    ATT.OP_READ_BY_TYPE_RESP = 0x09;
    ATT.OP_READ_REQ = 0x0a;
    ATT.OP_READ_RESP = 0x0b;
    ATT.OP_READ_BLOB_REQ = 0x0c;
    ATT.OP_READ_BLOB_RESP = 0x0d;
    ATT.OP_READ_BY_GROUP_REQ = 0x10;
    ATT.OP_READ_BY_GROUP_RESP = 0x11;
    ATT.OP_WRITE_REQ = 0x12;
    ATT.OP_WRITE_RESP = 0x13;
    ATT.OP_PREPARE_WRITE_REQ = 0x16;
    ATT.OP_PREPARE_WRITE_RESP = 0x17;
    ATT.OP_EXECUTE_WRITE_REQ = 0x18;
    ATT.OP_EXECUTE_WRITE_RESP = 0x19;
    ATT.OP_HANDLE_NOTIFY = 0x1b;
    ATT.OP_HANDLE_IND = 0x1d;
    ATT.OP_HANDLE_CNF = 0x1e;
    ATT.OP_WRITE_CMD = 0x52;
    ATT.ECODE_SUCCESS = 0x00;
    ATT.ECODE_INVALID_HANDLE = 0x01;
    ATT.ECODE_READ_NOT_PERM = 0x02;
    ATT.ECODE_WRITE_NOT_PERM = 0x03;
    ATT.ECODE_INVALID_PDU = 0x04;
    ATT.ECODE_AUTHENTICATION = 0x05;
    ATT.ECODE_REQ_NOT_SUPP = 0x06;
    ATT.ECODE_INVALID_OFFSET = 0x07;
    ATT.ECODE_AUTHORIZATION = 0x08;
    ATT.ECODE_PREP_QUEUE_FULL = 0x09;
    ATT.ECODE_ATTR_NOT_FOUND = 0x0a;
    ATT.ECODE_ATTR_NOT_LONG = 0x0b;
    ATT.ECODE_INSUFF_ENCR_KEY_SIZE = 0x0c;
    ATT.ECODE_INVAL_ATTR_VALUE_LEN = 0x0d;
    ATT.ECODE_UNLIKELY = 0x0e;
    ATT.ECODE_INSUFF_ENC = 0x0f;
    ATT.ECODE_UNSUPP_GRP_TYPE = 0x10;
    ATT.ECODE_INSUFF_RESOURCES = 0x11;
    ATT.CID = 0x0004;
})(ATT || (ATT = {}));
const ATT_OP_READABLES = {
    0x01: 'OP_ERROR',
    0x02: 'OP_MTU_REQ',
    0x03: 'OP_MTU_RESP',
    0x04: 'OP_FIND_INFO_REQ',
    0x05: 'OP_FIND_INFO_RESP',
    0x08: 'OP_READ_BY_TYPE_REQ',
    0x09: 'OP_READ_BY_TYPE_RESP',
    0x0a: 'OP_READ_REQ',
    0x0b: 'OP_READ_RESP',
    0x0c: 'OP_READ_BLOB_REQ',
    0x0d: 'OP_READ_BLOB_RESP',
    0x10: 'OP_READ_BY_GROUP_REQ',
    0x11: 'OP_READ_BY_GROUP_RESP',
    0x12: 'OP_WRITE_REQ',
    0x13: 'OP_WRITE_RESP',
    0x16: 'OP_PREPARE_WRITE_REQ',
    0x17: 'OP_PREPARE_WRITE_RESP',
    0x18: 'OP_EXECUTE_WRITE_REQ',
    0x19: 'OP_EXECUTE_WRITE_RESP',
    0x1b: 'OP_HANDLE_NOTIFY',
    0x1d: 'OP_HANDLE_IND',
    0x1e: 'OP_HANDLE_CNF',
    0x52: 'OP_WRITE_CMD',
};
const ATT_ECODE_READABLES = {
    0x00: 'ECODE_SUCCESS',
    0x01: 'ECODE_INVALID_HANDLE',
    0x02: 'ECODE_READ_NOT_PERM',
    0x03: 'ECODE_WRITE_NOT_PERM',
    0x04: 'ECODE_INVALID_PDU',
    0x05: 'ECODE_AUTHENTICATION',
    0x06: 'ECODE_REQ_NOT_SUPP',
    0x07: 'ECODE_INVALID_OFFSET',
    0x08: 'ECODE_AUTHORIZATION',
    0x09: 'ECODE_PREP_QUEUE_FULL',
    0x0a: 'ECODE_ATTR_NOT_FOUND',
    0x0b: 'ECODE_ATTR_NOT_LONG',
    0x0c: 'ECODE_INSUFF_ENCR_KEY_SIZE',
    0x0d: 'ECODE_INVAL_ATTR_VALUE_LEN',
    0x0e: 'ECODE_UNLIKELY',
    0x0f: 'ECODE_INSUFF_ENC',
    0x10: 'ECODE_UNSUPP_GRP_TYPE',
    0x11: 'ECODE_INSUFF_RESOURCES',
};
class GattCommon {
    write() {
        // nothing
    }
    errorResponse(opcode, handle, status) {
        const buf = Buffer.alloc(5);
        buf.writeUInt8(ATT.OP_ERROR, 0);
        buf.writeUInt8(opcode, 1);
        buf.writeUInt16LE(handle, 2);
        buf.writeUInt8(status, 4);
        return buf;
    }
    mtuRequest(mtu) {
        const buf = Buffer.alloc(3);
        buf.writeUInt8(ATT.OP_MTU_REQ, 0);
        buf.writeUInt16LE(mtu, 1);
        return buf;
    }
    mtuResponse(mtu) {
        const buf = Buffer.alloc(3);
        buf.writeUInt8(ATT.OP_MTU_RESP, 0);
        buf.writeUInt16LE(mtu, 1);
        return buf;
    }
    readByGroupRequest(startHandle, endHandle, groupUuid) {
        const buf = Buffer.alloc(7);
        buf.writeUInt8(ATT.OP_READ_BY_GROUP_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        buf.writeUInt16LE(groupUuid, 5);
        return buf;
    }
    readByTypeRequest(startHandle, endHandle, groupUuid) {
        const buf = Buffer.alloc(7);
        buf.writeUInt8(ATT.OP_READ_BY_TYPE_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        buf.writeUInt16LE(groupUuid, 5);
        return buf;
    }
    readRequest(handle) {
        const buf = Buffer.alloc(3);
        buf.writeUInt8(ATT.OP_READ_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        return buf;
    }
    readBlobRequest(handle, offset) {
        const buf = Buffer.alloc(5);
        buf.writeUInt8(ATT.OP_READ_BLOB_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        buf.writeUInt16LE(offset, 3);
        return buf;
    }
    findInfoRequest(startHandle, endHandle) {
        const buf = Buffer.alloc(5);
        buf.writeUInt8(ATT.OP_FIND_INFO_REQ, 0);
        buf.writeUInt16LE(startHandle, 1);
        buf.writeUInt16LE(endHandle, 3);
        return buf;
    }
    writeRequest(handle, data, withoutResponse) {
        const buf = Buffer.alloc(3 + data.length);
        buf.writeUInt8(withoutResponse ? ATT.OP_WRITE_CMD : ATT.OP_WRITE_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        for (let i = 0; i < data.length; i++) {
            buf.writeUInt8(data.readUInt8(i), i + 3);
        }
        return buf;
    }
    prepareWriteRequest(handle, offset, data) {
        const buf = Buffer.alloc(5 + data.length);
        buf.writeUInt8(ATT.OP_PREPARE_WRITE_REQ, 0);
        buf.writeUInt16LE(handle, 1);
        buf.writeUInt16LE(offset, 3);
        for (let i = 0; i < data.length; i++) {
            buf.writeUInt8(data.readUInt8(i), i + 5);
        }
        return buf;
    }
    executeWriteRequest(handle, cancelPreparedWrites) {
        const buf = Buffer.alloc(2);
        buf.writeUInt8(ATT.OP_EXECUTE_WRITE_REQ, 0);
        buf.writeUInt8(cancelPreparedWrites ? 0 : 1, 1);
        return buf;
    }
    handleConfirmation() {
        const buf = Buffer.alloc(1);
        buf.writeUInt8(ATT.OP_HANDLE_CNF, 0);
        return buf;
    }
}
exports.GattCommon = GattCommon;
