import * as process from "process";
import Options from "./model/Options";
import Logger from "./util/Logger";
import ChunkController from "./controller/ChunkController";

/**
 * ChunkLoader is the main runner class to download an external file using range requests
 * Running the app without any input will display the usage details, also available in readme.txt
 */
class ChunkLoader {

	/**
	 * ChunkLoader constructor
	 * @param argv CLI arguments passed into the application
	 */
	constructor(private argv:Array<any>) {}

	/**
	 * Extract the options passed in and start the downloading process
	 */
	public processDownload():void {
		let options:Options = new Options();
		if (options.populateFromArgs(this.argv)) {
			let chunkController:ChunkController = new ChunkController(options);
			chunkController.processDownload();
		} else {
			this.outputUsage();
		}
	}

	/**
	 * Output application usage details, shown if a url is not passed in
	 */
	private outputUsage():void {
		Logger.log("Usage: " + this.fileName + " URL [OPTIONS]");
		Logger.log("------------------");
		Logger.log("Available options:");
		Logger.log("\t-outputFile string");
		Logger.log("\t\tThe name of the file the download will be written to, with the extension");
		Logger.log("\t-chunkSize number");
		Logger.log("\t\tThe size of each individual chunk in kilobytes, defaults to 1024");
		Logger.log("\t-chunkCount number");
		Logger.log("\t\tThe number of chunks to download, defaults to 4");
		Logger.log("\t-totalDownload number");
		Logger.log("\t\tThe total amount of data to download in kilobytes, defaults to zero (if included, -chunkCount is ignored)");
	}

	/**
	 * Extract the name of the file this application is contained within
	 * @returns string The file name
	 */
	private get fileName():string {
		if (this.argv && this.argv[0]) {
			let fullPath:string = this.argv[0];
			return fullPath.substr(fullPath.lastIndexOf("\\") + 1);
		}
		return "app.exe";
	}
}

// Instantiate and start the application
let chunkLoader = new ChunkLoader(process.argv);
chunkLoader.processDownload();