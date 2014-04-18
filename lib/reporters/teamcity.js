// Load modules


// Declare internals

var internals = {};


exports = module.exports = internals.Reporter = function (options) {

    this.settings = options;

    this.passes = 0;
    this.failures = 0;
    this.skipped = 0;
    this.todo = 0;
};


var suiteStart = null ;


function escape(str) {
  if (!str) return '';
  return str
    .replace(/\|/g, "||")
    .replace(/\n/g, "|n")
    .replace(/\r/g, "|r")
    .replace(/\[/g, "|[")
    .replace(/\]/g, "|]")
    .replace(/\u0085/g, "|x")
    .replace(/\u2028/g, "|l")
    .replace(/\u2029/g, "|p")
    .replace(/'/g, "|'");
}


internals.Reporter.prototype.start = function (notebook) {
    suiteStart = new Date() ;
    this.print("##teamcity[testSuiteStarted name='" + escape("test suite") + "']\n");

};

internals.Reporter.prototype.test = function (test) {


    var title = test.title.replace(/#/g, '');
    if (test.err) {
        var message = "" ;
        if( test.err.stack ) {
            message = test.err.stack.replace(/^/gm, '  ') ;
        }
        this.print("##teamcity[testFailed name='" + escape(title) + "' message='" + escape(message) + "' captureStandardOutput='true']\n");
        this.failures++;

    }

    else if (test.skipped) {
        this.skipped++;
        this.print("##teamcity[testIgnored name='" + escape(title) + "' message='pending']\n");
    }
    else if (test.todo) {
        this.todo++;
    }
    else {
        this.print("##teamcity[testFinished name='" + escape(title) + "' duration='" + test.duration + "']\n");
        this.passes++;
    }
};


internals.Reporter.prototype.end = function (notebook) {
    this.print("##teamcity[testSuiteFinished name='" + escape("test suite") + "' duration='" + (new Date() - suiteStart ) + "']\n");
};
