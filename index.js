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

  var files = {}

  function collect(file, encoding, callback) {
    var name = path.basename(file.relative);
    if(files[name] == null) files[name] = [];
    files[name].push(file)
    callback();
  }

  function grab(base_path, pattern) {
    return glob.sync(path.join(base_path, pattern))
      .map(function(x) { return fs.readFileSync(x, 'utf-8') })
      .join('')
  }

  function grab_all(files, pattern) {
    return files.map(function(f) { return grab(f.path, pattern) })
  }

  function combine(name, files) {
    var res = defaultTemplate({
      name: name,
      html: grab_all(files, '*.html').join('\n'),
      css: grab_all(files, '*.css').join('\n'),
      js: grab_all(files, '*.js').join('\n'),
    })

    var fres = new File(files[0])
    fres.path = fres.path + ".html"
    fres.contents = new Buffer(res)
    return fres
  }

  function finish(callback) {
    for(var key in files) {
      this.push(combine(key, files[key]))
    }
    callback();
  }

  return through.obj(collect, finish)
};
