import * as http from "http";
import * as fs from "fs";
import Logger from "./Logger";
import { URL } from "url";

/** SingleChunkLoader downloads a single chunk of an external file and write it to disk */
export default class SingleChunkLoader {

	/** Array of each of the parts of external data downloaded */
	private dataPieces:Array<any> = [];
	/** Local disk file to write to */
	private writeStream:fs.WriteStream = fs.createWriteStream("output.txt");

	/**
	 * SingleChunkLoader constructor
	 * @param chunkID Unique ID of this instance, for logging
	 * @param chunkLoadedCallback Callback to invoke once downloading is complete
	 * @param url URL of the external file to download
	 * @param outputFile Local disk file to write the data to
	 * @param rangeStart Range header start value
	 * @param rangeEnd Range header end value
	 */
	constructor(private chunkID:number, private chunkLoadedCallback:()=>void, private url:URL, private outputFile:string, private rangeStart:number, private rangeEnd:number) {}

	/** Start downloading the chunk */
	public loadChunk():void {
		Logger.log("Chunk #" + this.chunkID + " starting to load range " + this.rangeStart + " to " + this.rangeEnd);
		
		let httpOptions:http.RequestOptions = {
			headers: {
				"Range": "bytes=" + this.rangeStart + "-" + this.rangeEnd,
			},
			protocol: this.url.protocol,
			host: this.url.host,
			path: this.url.pathname,
		}
		http.get(httpOptions, this.onChunkDownloadInit.bind(this));
	}

	/** Callback for when the chunk downloading process has initialized */
	private onChunkDownloadInit(res:http.IncomingMessage):void {
		// Part of the chunk has been received
		res.addListener("data", (res:any) => {
			this.dataPieces.push(res);
		});
		// The entire chunk has been downloaded
		res.addListener("end", () => {
			Logger.log("Chunk #" + this.chunkID + " finished loading external data");
			this.chunkLoadedCallback();
		});
	}

	/** Write our chunk parts to the local file */
	public writeChunkToDisk():void {
		for (var i = 0; i < this.dataPieces.length; i++) {
			fs.appendFileSync(this.outputFile, this.dataPieces[i]);
		}
		Logger.log("Chunk #" + this.chunkID + " finished writing external data to disk");
		this.writeStream.end();
	}
}