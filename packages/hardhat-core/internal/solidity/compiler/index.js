"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeCompiler = exports.Compiler = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const semver = __importStar(require("semver"));
const errors_1 = require("../../core/errors");
const errors_list_1 = require("../../core/errors-list");
class Compiler {
    constructor(_pathToSolcJs) {
        this._pathToSolcJs = _pathToSolcJs;
    }
    async compile(input) {
        const solc = await this.getSolc();
        const jsonOutput = solc.compile(JSON.stringify(input));
        return JSON.parse(jsonOutput);
    }
    async getSolc() {
        if (this._loadedSolc !== undefined) {
            return this._loadedSolc;
        }
        const solcWrapper = require("solc/wrapper");
        this._loadedSolc = solcWrapper(this._loadCompilerSources(this._pathToSolcJs));
        return this._loadedSolc;
    }
    /**
     * This function loads the compiler sources bypassing any require hook.
     *
     * The compiler is a huge asm.js file, and using a simple require may trigger
     * babel/register and hang the process.
     */
    _loadCompilerSources(compilerPath) {
        const Module = module.constructor;
        // if Hardhat is bundled (for example, in the vscode extension), then
        // Module._extenions might be undefined. In that case, we just use a plain
        // require.
        if (Module._extensions === undefined) {
            return require(compilerPath);
        }
        const previousHook = Module._extensions[".js"];
        Module._extensions[".js"] = function (module, filename) {
            const content = fs.readFileSync(filename, "utf8");
            Object.getPrototypeOf(module)._compile.call(module, content, filename);
        };
        const loadedSolc = require(compilerPath);
        Module._extensions[".js"] = previousHook;
        return loadedSolc;
    }
}
exports.Compiler = Compiler;
class NativeCompiler {
    constructor(_pathToSolc, _solcVersion) {
        this._pathToSolc = _pathToSolc;
        this._solcVersion = _solcVersion;
    }
    async compile(input) {
        const args = ["--standard-json"];
        // Logic to make sure that solc default import callback is not being used.
        // If solcVersion is not defined or <= 0.6.8, do not add extra args.
        if (this._solcVersion !== undefined) {
            if (semver.gte(this._solcVersion, "0.8.22")) {
                // version >= 0.8.22
                args.push("--no-import-callback");
            }
            else if (semver.gte(this._solcVersion, "0.6.9")) {
                // version >= 0.6.9
                const tmpFolder = node_path_1.default.join(node_os_1.default.tmpdir(), "hardhat-solc");
                fs.mkdirSync(tmpFolder, { recursive: true });
                args.push(`--base-path`);
                args.push(tmpFolder);
            }
        }
        const output = await new Promise((resolve, reject) => {
            try {
                const process = (0, child_process_1.execFile)(this._pathToSolc, args, {
                    maxBuffer: 1024 * 1024 * 500,
                }, (err, stdout) => {
                    if (err !== null) {
                        return reject(err);
                    }
                    resolve(stdout);
                });
                process.stdin.write(JSON.stringify(input));
                process.stdin.end();
            }
            catch (e) {
                throw new errors_1.HardhatError(errors_list_1.ERRORS.SOLC.CANT_RUN_NATIVE_COMPILER, {}, e);
            }
        });
        return JSON.parse(output);
    }
}
exports.NativeCompiler = NativeCompiler;
//# sourceMappingURL=index.js.map