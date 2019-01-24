"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var process = __importStar(require("process"));
var Options_1 = __importDefault(require("./model/Options"));
var Logger_1 = __importDefault(require("./util/Logger"));
var ChunkController_1 = __importDefault(require("./controller/ChunkController"));
/**
 * ChunkLoader is the main runner class to download an external file using range requests
 * Running the app without any input will display the usage details, also available in readme.txt
 */
var ChunkLoader = /** @class */ (function () {
    /**
     * ChunkLoader constructor
     * @param argv CLI arguments passed into the application
     */
    function ChunkLoader(argv) {
        this.argv = argv;
    }
    /**
     * Extract the options passed in and start the downloading process
     */
    ChunkLoader.prototype.processDownload = function () {
        var options = new Options_1.default();
        if (options.populateFromArgs(this.argv)) {
            var chunkController = new ChunkController_1.default(options);
            chunkController.processDownload();
        }
        else {
            this.outputUsage();
        }
    };
    /**
     * Output application usage details, shown if a url is not passed in
     */
    ChunkLoader.prototype.outputUsage = function () {
        Logger_1.default.log("Usage: " + this.fileName + " URL [OPTIONS]");
        Logger_1.default.log("------------------");
        Logger_1.default.log("Available options:");
        Logger_1.default.log("\t-outputFile string");
        Logger_1.default.log("\t\tThe name of the file the download will be written to, with the extension");
        Logger_1.default.log("\t-chunkSize number");
        Logger_1.default.log("\t\tThe size of each individual chunk in kilobytes, defaults to 1024");
        Logger_1.default.log("\t-chunkCount number");
        Logger_1.default.log("\t\tThe number of chunks to download, defaults to 4");
        Logger_1.default.log("\t-totalDownload number");
        Logger_1.default.log("\t\tThe total amount of data to download in kilobytes, defaults to zero (if included, -chunkCount is ignored)");
    };
    Object.defineProperty(ChunkLoader.prototype, "fileName", {
        /**
         * Extract the name of the file this application is contained within
         * @returns string The file name
         */
        get: function () {
            if (this.argv && this.argv[0]) {
                var fullPath = this.argv[0];
                return fullPath.substr(fullPath.lastIndexOf("\\") + 1);
            }
            return "app.exe";
        },
        enumerable: true,
        configurable: true
    });
    return ChunkLoader;
}());
// Instantiate and start the application
var chunkLoader = new ChunkLoader(process.argv);
chunkLoader.processDownload();
//# sourceMappingURL=index.js.map