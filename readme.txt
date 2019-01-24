 
ChunkLoader is a TypeScript Node.js application to download an external file in chunks using range requests

All chunks are downloaded in parallel, and written to disk in order and synchronously

The transpiled JavaScript is located in the "bin" folder

The compiled exe is located in the "compiled" folder inside the "bin" folder

This application has been packaged using the pkg npm package and tested on a Windows 64-bit machine

Usage: mike-boht-chunk-loader.exe URL [OPTIONS]

Available options:
    -outputFile string
		The name of the file the download will be written to, with the extension
	-chunkSize number
		The size of each individual chunk in kilobytes, defaults to 1024
	-chunkCount number
		The number of chunks to download, defaults to 4
	-totalDownload number
		The total amount of data to download in kilobytes, defaults to zero (if included, -chunkCount is ignored)