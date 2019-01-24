/** Logger is a central class for all output to channel through, for ease of customization in the future */
export default class Logger {

	public static log(output:string):void {
		console.log(output);
	}

	public static logError(output:string):void {
		console.log("Error: " + output);
	}

	public static logWarning(output:string):void {
		console.log("Warning: " + output);
	}
}