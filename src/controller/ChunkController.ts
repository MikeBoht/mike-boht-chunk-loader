import Options from "../model/Options";
import SingleChunkLoader from "../util/SingleChunkLoader";
import Logger from "../util/Logger";
import * as fs from "fs";

/** ChunkController manages all the individual chunks */
export default class ChunkController {

	/** An array of all individual chunks being managed */
	private chunkTracker:Array<SingleChunkLoader> = [];
	/** Number of chunks that finished downloading their data */
	private chunksComplete:number = 0;

	/**
	 * ChunkController constructor
	 * @param options The application options extracted from the arguments passed into the app
	 */
	constructor(private options:Options) {}

	/** Create all the chunks and complete the download process */
	public processDownload():void {
		this.deleteOutputFileIfExists();
		this.createAndStartChunks();
	}

	/** If the file we are going to write to already exists, then delete it */
	private deleteOutputFileIfExists():void {
		if (fs.existsSync(this.options.outputFile)) {
			fs.unlinkSync(this.options.outputFile);
		}
	}

	/** Create all the chunks and trigger them to start downloading */
	private createAndStartChunks():void {
		// Use the desired total download amount divided by chunkSize to determine chunkCount
		if (this.options.totalDownload != 0) {
			let chunkCount:number = Math.ceil(this.options.totalDownload / this.options.chunkSize);
			let marker:number = 0;
			for (var i:number = 0; i < chunkCount; i++) {
				// Subtract one from rangeEnd because the ranges are zero based
				let rangeEnd:number = ((i * this.options.chunkSize) + this.options.chunkSize) - 1;
				// If this is the last chunk then stop at the total desired download size (minus one since ranges are zero based)
				if (i == chunkCount - 1) {
					rangeEnd = this.options.totalDownload - 1;
				}
				this.createAndStartChunk(i + 1, marker, rangeEnd);
				marker = rangeEnd + 1;
			}
		// Create the number of chunks specified using the chunkSize passed in
		} else if (this.options.chunkCount != 0) {
			for (var i:number = 0; i < this.options.chunkCount; i++) {
				this.createAndStartChunk(i + 1, i * this.options.chunkSize, ((i + 1) * this.options.chunkSize) - 1);
			}
		}
	}

	/**
	 * Create a chunk and tell it to start downloading
	 * @param chunkID A unique ID for the chunk, just for logging and debugging purposes
	 * @param rangeStart Range header start value
	 * @param rangeEnd Range header end value
	 */
	private createAndStartChunk(chunkID:number, rangeStart:number, rangeEnd:number):void {
		let singleChunkLoader:SingleChunkLoader = new SingleChunkLoader(chunkID, this.onChunkComplete.bind(this), this.options.fileURL, this.options.outputFile, rangeStart, rangeEnd);
		this.chunkTracker.push(singleChunkLoader);
		singleChunkLoader.loadChunk();
	}

	/** Callback for when a chunk finishes downloading its data */
	private onChunkComplete():void {
		this.chunksComplete++;
		// If all chunks are done, write to disk and consider the job done
		if (this.isAllChunksComplete()) {
			this.writeChunksToDisk();
			Logger.log("Success!");
		}
	}

	/**
	 * Check if all chunks have finished downloading
	 * @returns boolean True if all chunks are done downloading, else false
	 */
	private isAllChunksComplete():boolean {
		return (this.chunksComplete == this.chunkTracker.length);
	}

	/** Tell all chunks to write their data to disk */
	private writeChunksToDisk():void {
		for (var i:number = 0; i < this.chunkTracker.length; i++) {
			this.chunkTracker[i].writeChunkToDisk();
		}
	}
}