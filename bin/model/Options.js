"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __importDefault(require("../util/Logger"));
var url_1 = require("url");
/**
 * Model class which extracts the application options from the arguments passed in
 */
var Options = /** @class */ (function () {
    function Options() {
        /** The external file to download */
        this._fileURL = new url_1.URL("http://f39bf6aa.bwtest-aws.pravala.com/384MB.jar");
        /** The file on the local disk to write to */
        this._outputFile = "output.txt";
        /** The size of each download chunk, in kilobytes */
        this._chunkSize = 0;
        /** The number of chunks to download, ignored if totalDownload is populated */
        this._chunkCount = 0;
        /** The total amount of the external file to download, in kilobytes */
        this._totalDownload = 0;
    }
    /**
     * Extract all options from the arguments passed in
     * @param argv The arguments passed into the application
     */
    Options.prototype.populateFromArgs = function (argv) {
        var isValidArgs = false;
        // The first 2 arguments are automatically passed in, so we must have at least 3
        if (argv.length > 2) {
            this._fileURL = new url_1.URL(argv[2]);
            isValidArgs = true;
            for (var i = 3; i < argv.length; i += 2) {
                if (argv[i] == "-chunkSize") {
                    this._chunkSize = Number(argv[i + 1]) * 1024;
                }
                else if (argv[i] == "-chunkCount") {
                    this._chunkCount = Number(argv[i + 1]);
                }
                else if (argv[i] == "-totalDownload") {
                    this._totalDownload = Number(argv[i + 1]) * 1024;
                }
                else if (argv[i] == "-outputFile") {
                    this._outputFile = String(argv[i + 1]);
                }
                else {
                    // Only move forward one argument if we didn't recognize this one, in case the value was accidentally omitted
                    i--;
                }
            }
            this.validateAndSetDefaultOptions();
        }
        else {
            Logger_1.default.logError("File URL missing");
        }
        return isValidArgs;
    };
    /**
     * Check for any warnings the user should be aware of and any default values that need to be set
     */
    Options.prototype.validateAndSetDefaultOptions = function () {
        // totalDownload overrides chunkCount, since we will derive chunkCount from totalDownload divided by chunkSize
        if (this._totalDownload != 0 && this._chunkCount != 0) {
            Logger_1.default.logWarning("chunkCount option will be ignored, because the totalDownload option was set");
        }
        if (this._totalDownload == 0 && this._chunkCount == 0) {
            this._chunkCount = Options.DEFAULT_CHUNK_COUNT;
            Logger_1.default.logWarning("Setting chunkCount to default value of " + (Options.DEFAULT_CHUNK_COUNT / 1024));
        }
        if (this._chunkSize == 0) {
            this._chunkSize = Options.DEFAULT_CHUNK_SIZE;
            Logger_1.default.logWarning("Setting chunkSize to default value of " + Options.DEFAULT_CHUNK_SIZE);
        }
    };
    Object.defineProperty(Options.prototype, "fileURL", {
        get: function () { return this._fileURL; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "outputFile", {
        get: function () { return this._outputFile; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "chunkSize", {
        get: function () { return this._chunkSize; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "chunkCount", {
        get: function () { return this._chunkCount; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Options.prototype, "totalDownload", {
        get: function () { return this._totalDownload; },
        enumerable: true,
        configurable: true
    });
    /** Default chunk size used, if not passed in */
    Options.DEFAULT_CHUNK_SIZE = 1024 * 1024;
    /** Default number of chunks to download, if not passed in */
    Options.DEFAULT_CHUNK_COUNT = 4;
    return Options;
}());
exports.default = Options;
//# sourceMappingURL=Options.js.map