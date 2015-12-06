/*
       ////  ////////  ///
       ////  ///////   ///
       ////  ///       ///   /////
       ////  ///////   ///  /////
       ////  ///////   /// /////
       ////  ///       ////////
       ////  ///       ////////
       ////  ///       ///  /////
///    ////  ///       ///   /////
//////////   ///       ///     /////
*/
module.exports = function() {
    var logo = '\n\n' +
        '        ////'.bold.red + '  ////////'.bold.blue + '  ///          \n'.bold.green +
        '        ////'.bold.red + '  /////// '.bold.blue + '  ///          \n'.bold.green +
        '        ////'.bold.red + '  ///     '.bold.blue + '  ///   /////  \n'.bold.green +
        '        ////'.bold.red + '  /////// '.bold.blue + '  ///  /////   \n'.bold.green +
        '        ////'.bold.red + '  /////// '.bold.blue + '  /// /////    \n'.bold.green +
        '        ////'.bold.red + '  ///     '.bold.blue + '  ////////     \n'.bold.green +
        '        ////'.bold.red + '  ///     '.bold.blue + '  ////////     \n'.bold.green +
        '        ////'.bold.red + '  ///     '.bold.blue + '  ///  /////   \n'.bold.green +
        ' ///    ////'.bold.red + '  ///     '.bold.blue + '  ///   /////  \n'.bold.green +
        ' ////////// '.bold.red + '  ///     '.bold.blue + '  ///     /////\n'.bold.green;
    console.log(logo + '\n  jfk v' + jfk.cli.info.version);
};