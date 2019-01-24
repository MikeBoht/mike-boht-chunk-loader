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
var http = __importStar(require("http"));
var fs = __importStar(require("fs"));
var Logger_1 = __importDefault(require("./Logger"));
/** SingleChunkLoader downloads a single chunk of an external file and write it to disk */
var SingleChunkLoader = /** @class */ (function () {
    /**
     * SingleChunkLoader constructor
     * @param chunkID Unique ID of this instance, for logging
     * @param chunkLoadedCallback Callback to invoke once downloading is complete
     * @param url URL of the external file to download
     * @param outputFile Local disk file to write the data to
     * @param rangeStart Range header start value
     * @param rangeEnd Range header end value
     */
    function SingleChunkLoader(chunkID, chunkLoadedCallback, url, outputFile, rangeStart, rangeEnd) {
        this.chunkID = chunkID;
        this.chunkLoadedCallback = chunkLoadedCallback;
        this.url = url;
        this.outputFile = outputFile;
        this.rangeStart = rangeStart;
        this.rangeEnd = rangeEnd;
        /** Array of each of the parts of external data downloaded */
        this.dataPieces = [];
        /** Local disk file to write to */
        this.writeStream = fs.createWriteStream("output.txt");
    }
    /** Start downloading the chunk */
    SingleChunkLoader.prototype.loadChunk = function () {
        Logger_1.default.log("Chunk #" + this.chunkID + " starting to load range " + this.rangeStart + " to " + this.rangeEnd);
        var httpOptions = {
            headers: {
                "Range": "bytes=" + this.rangeStart + "-" + this.rangeEnd,
            },
            protocol: this.url.protocol,
            host: this.url.host,
            path: this.url.pathname,
        };
        http.get(httpOptions, this.onChunkDownloadInit.bind(this));
    };
    /** Callback for when the chunk downloading process has initialized */
    SingleChunkLoader.prototype.onChunkDownloadInit = function (res) {
        var _this = this;
        // Part of the chunk has been received
        res.addListener("data", function (res) {
            _this.dataPieces.push(res);
        });
        // The entire chunk has been downloaded
        res.addListener("end", function () {
            Logger_1.default.log("Chunk #" + _this.chunkID + " finished loading external data");
            _this.chunkLoadedCallback();
        });
    };
    /** Write our chunk parts to the local file */
    SingleChunkLoader.prototype.writeChunkToDisk = function () {
        for (var i = 0; i < this.dataPieces.length; i++) {
            fs.appendFileSync(this.outputFile, this.dataPieces[i]);
        }
        Logger_1.default.log("Chunk #" + this.chunkID + " finished writing external data to disk");
        this.writeStream.end();
    };
    return SingleChunkLoader;
}());
exports.default = SingleChunkLoader;
//# sourceMappingURL=SingleChunkLoader.js.map