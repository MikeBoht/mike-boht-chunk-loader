import Logger from "../util/Logger";
import { URL } from "url";

/**
 * Model class which extracts the application options from the arguments passed in
 */
export default class Options {

	/** Default chunk size used, if not passed in */
	private static DEFAULT_CHUNK_SIZE:number = 1024 * 1024;
	/** Default number of chunks to download, if not passed in */
	private static DEFAULT_CHUNK_COUNT:number = 4;

	/** The external file to download */
	private _fileURL:URL = new URL("http://f39bf6aa.bwtest-aws.pravala.com/384MB.jar");
	/** The file on the local disk to write to */
	private _outputFile:string = "output.txt";
	/** The size of each download chunk, in kilobytes */
	private _chunkSize:number = 0;
	/** The number of chunks to download, ignored if totalDownload is populated */
	private _chunkCount:number = 0;
	/** The total amount of the external file to download, in kilobytes */
	private _totalDownload:number = 0;

	/**
	 * Extract all options from the arguments passed in
	 * @param argv The arguments passed into the application
	 */
	public populateFromArgs(argv:Array<any>):boolean {
		let isValidArgs:boolean = false;
		// The first 2 arguments are automatically passed in, so we must have at least 3
		if (argv.length > 2) {
			this._fileURL = new URL(argv[2]);
			isValidArgs = true;
			for (var i:number = 3; i < argv.length; i+=2) {
				if (argv[i] == "-chunkSize") {
					this._chunkSize = Number(argv[i + 1]) * 1024;
				} else if (argv[i] == "-chunkCount") {
					this._chunkCount = Number(argv[i + 1]);
				} else if (argv[i] == "-totalDownload") {
					this._totalDownload = Number(argv[i + 1]) * 1024;
				} else if (argv[i] == "-outputFile") {
					this._outputFile = String(argv[i + 1]);
				} else {
					// Only move forward one argument if we didn't recognize this one, in case the value was accidentally omitted
					i--;
				}
			}
			this.validateAndSetDefaultOptions();
		} else {
			Logger.logError("File URL missing");
		}
		return isValidArgs;
	}

	/**
	 * Check for any warnings the user should be aware of and any default values that need to be set
	 */
	private validateAndSetDefaultOptions():void {
		// totalDownload overrides chunkCount, since we will derive chunkCount from totalDownload divided by chunkSize
		if (this._totalDownload != 0 && this._chunkCount != 0) {
			Logger.logWarning("chunkCount option will be ignored, because the totalDownload option was set");
		}
		if (this._totalDownload == 0 && this._chunkCount == 0) {
			this._chunkCount = Options.DEFAULT_CHUNK_COUNT;
			Logger.logWarning("Setting chunkCount to default value of " + (Options.DEFAULT_CHUNK_COUNT / 1024));
		}
		if (this._chunkSize == 0) {
			this._chunkSize = Options.DEFAULT_CHUNK_SIZE;
			Logger.logWarning("Setting chunkSize to default value of " + Options.DEFAULT_CHUNK_SIZE);
		}
	}

	public get fileURL():URL { return this._fileURL; }
	public get outputFile():string { return this._outputFile; }
	public get chunkSize():number { return this._chunkSize; }
	public get chunkCount():number { return this._chunkCount; }
	public get totalDownload():number { return this._totalDownload; }
}