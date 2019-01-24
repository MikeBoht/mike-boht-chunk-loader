"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var SingleChunkLoader_1 = __importDefault(require("../util/SingleChunkLoader"));
var Logger_1 = __importDefault(require("../util/Logger"));
var fs = __importStar(require("fs"));
/** ChunkController manages all the individual chunks */
var ChunkController = /** @class */ (function () {
    /**
     * ChunkController constructor
     * @param options The application options extracted from the arguments passed into the app
     */
    function ChunkController(options) {
        this.options = options;
        /** An array of all individual chunks being managed */
        this.chunkTracker = [];
        /** Number of chunks that finished downloading their data */
        this.chunksComplete = 0;
    }
    /** Create all the chunks and complete the download process */
    ChunkController.prototype.processDownload = function () {
        this.deleteOutputFileIfExists();
        this.createAndStartChunks();
    };
    /** If the file we are going to write to already exists, then delete it */
    ChunkController.prototype.deleteOutputFileIfExists = function () {
        if (fs.existsSync(this.options.outputFile)) {
            fs.unlinkSync(this.options.outputFile);
        }
    };
    /** Create all the chunks and trigger them to start downloading */
    ChunkController.prototype.createAndStartChunks = function () {
        // Use the desired total download amount divided by chunkSize to determine chunkCount
        if (this.options.totalDownload != 0) {
            var chunkCount = Math.ceil(this.options.totalDownload / this.options.chunkSize);
            var marker = 0;
            for (var i = 0; i < chunkCount; i++) {
                // Subtract one from rangeEnd because the ranges are zero based
                var rangeEnd = ((i * this.options.chunkSize) + this.options.chunkSize) - 1;
                // If this is the last chunk then stop at the total desired download size (minus one since ranges are zero based)
                if (i == chunkCount - 1) {
                    rangeEnd = this.options.totalDownload - 1;
                }
                this.createAndStartChunk(i + 1, marker, rangeEnd);
                marker = rangeEnd + 1;
            }
            // Create the number of chunks specified using the chunkSize passed in
        }
        else if (this.options.chunkCount != 0) {
            for (var i = 0; i < this.options.chunkCount; i++) {
                this.createAndStartChunk(i + 1, i * this.options.chunkSize, ((i + 1) * this.options.chunkSize) - 1);
            }
        }
    };
    /**
     * Create a chunk and tell it to start downloading
     * @param chunkID A unique ID for the chunk, just for logging and debugging purposes
     * @param rangeStart Range header start value
     * @param rangeEnd Range header end value
     */
    ChunkController.prototype.createAndStartChunk = function (chunkID, rangeStart, rangeEnd) {
        var singleChunkLoader = new SingleChunkLoader_1.default(chunkID, this.onChunkComplete.bind(this), this.options.fileURL, this.options.outputFile, rangeStart, rangeEnd);
        this.chunkTracker.push(singleChunkLoader);
        singleChunkLoader.loadChunk();
    };
    /** Callback for when a chunk finishes downloading its data */
    ChunkController.prototype.onChunkComplete = function () {
        this.chunksComplete++;
        // If all chunks are done, write to disk and consider the job done
        if (this.isAllChunksComplete()) {
            this.writeChunksToDisk();
            Logger_1.default.log("Success!");
        }
    };
    /**
     * Check if all chunks have finished downloading
     * @returns boolean True if all chunks are done downloading, else false
     */
    ChunkController.prototype.isAllChunksComplete = function () {
        return (this.chunksComplete == this.chunkTracker.length);
    };
    /** Tell all chunks to write their data to disk */
    ChunkController.prototype.writeChunksToDisk = function () {
        for (var i = 0; i < this.chunkTracker.length; i++) {
            this.chunkTracker[i].writeChunkToDisk();
        }
    };
    return ChunkController;
}());
exports.default = ChunkController;
//# sourceMappingURL=ChunkController.js.map