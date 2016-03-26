// through2 is a thin wrapper around node transform streams
var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var File = gutil.File;
var fs = require('fs');
var glob = require('glob');
var template = require('lodash.template');

module.exports = function() {
  var defaultTemplate = template(`
<dom-module id=\"<%= name %>\">
  <template>
    <style>
<%= css %>
    </style>

    <%= html %>
  </template>

  <script>
<%= js %>
  </script>
</dom-module>
`)

  return through.obj(function(file, encoding, callback) {
    var name = file.relative;
    var cache = path.join(file.path, '..', '.cache', name)

    function grab(pattern) {
      return glob.sync(path.join(file.path, pattern))
        .concat(glob.sync(path.join(cache, pattern)))
        .map((x) => { return fs.readFileSync(x, 'utf-8') })
        .join('')
    }

    var res = defaultTemplate({
      name: name,
      html: grab('*.html'),
      css: grab('*.css'),
      js: grab('*.js')
    })

    var fres = new File(file)
    fres.path = fres.path + ".html"
    fres.contents = new Buffer(res)
    this.push(fres);
    callback();
  })
};
