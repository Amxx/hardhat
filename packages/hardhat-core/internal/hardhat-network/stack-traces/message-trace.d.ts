import type { EvmError } from "@nomicfoundation/ethereumjs-evm";
import type { Bytecode } from "./model";
export type MessageTrace = CreateMessageTrace | CallMessageTrace | PrecompileMessageTrace;
export type EvmMessageTrace = CreateMessageTrace | CallMessageTrace;
export type DecodedEvmMessageTrace = DecodedCreateMessageTrace | DecodedCallMessageTrace;
export interface BaseMessageTrace {
    value: bigint;
    returnData: Uint8Array;
    error?: EvmError;
    gasUsed: bigint;
    depth: number;
}
export interface PrecompileMessageTrace extends BaseMessageTrace {
    precompile: number;
    calldata: Uint8Array;
}
export interface BaseEvmMessageTrace extends BaseMessageTrace {
    code: Uint8Array;
    value: bigint;
    returnData: Uint8Array;
    error?: EvmError;
    steps: MessageTraceStep[];
    bytecode?: Bytecode;
    numberOfSubtraces: number;
}
export interface CreateMessageTrace extends BaseEvmMessageTrace {
    deployedContract: Uint8Array | undefined;
}
export interface CallMessageTrace extends BaseEvmMessageTrace {
    calldata: Uint8Array;
    address: Uint8Array;
    codeAddress: Uint8Array;
}
export interface DecodedCreateMessageTrace extends CreateMessageTrace {
    bytecode: Bytecode;
}
export interface DecodedCallMessageTrace extends CallMessageTrace {
    bytecode: Bytecode;
}
export declare function isPrecompileTrace(trace: MessageTrace): trace is PrecompileMessageTrace;
export declare function isCreateTrace(trace: MessageTrace): trace is CreateMessageTrace;
export declare function isDecodedCreateTrace(trace: MessageTrace): trace is DecodedCreateMessageTrace;
export declare function isCallTrace(trace: MessageTrace): trace is CallMessageTrace;
export declare function isDecodedCallTrace(trace: MessageTrace): trace is DecodedCallMessageTrace;
export declare function isEvmStep(step: MessageTraceStep): step is EvmStep;
export type MessageTraceStep = MessageTrace | EvmStep;
export interface EvmStep {
    pc: number;
}
//# sourceMappingURL=message-trace.d.ts.map