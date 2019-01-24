"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Logger is a central class for all output to channel through, for ease of customization in the future */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.log = function (output) {
        console.log(output);
    };
    Logger.logError = function (output) {
        console.log("Error: " + output);
    };
    Logger.logWarning = function (output) {
        console.log("Warning: " + output);
    };
    return Logger;
}());
exports.default = Logger;
//# sourceMappingURL=Logger.js.map