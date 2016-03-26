# gulp-polyfy

Create polymer elements from base components:

```
elements/hello
├── hello.css
├── hello.html
└── hello.js
```

```
h1 {
  color: #444;
}
```

```
<h1>Hello {{name}}</h1>
<input value="{{name::input}}"></input>
```

```
Polymer({
  is: 'hello',
  properties: {
    name: {
      type: String,
      value: 'World'
    }
  }
});
```

Gulpfile:

```js
polyfy = require('gulp-polyfy');

gulp.src('elements/*/')
    .pipe(polyfy())
    .pipe(gulp.dest('app/elements'))
```

Creates:

```html
<dom-module id="compliance-report">
  <template>
    <style>
h1 {
  color: #444;
}
    </style>

<h1>Hello {{name}}</h1>
<input value="{{name::input}}"></input>

  </template>
  <script>
Polymer({
  is: 'hello',
  properties: {
    name: {
      type: String,
      value: 'World'
    }
  }
});
  </script>
</dom-module>
```


**Why?** To use e.g. PolymerTS and SASS when creating elements:


```js
gulp.task('elements-ts', function() {
    return gulp.src(['elements/*/*.ts', 'app/bower_components/polymer-ts/polymer-ts.ts'], {base: 'elements'})
        .pipe(typescript(elementsTsProject)).js
        .pipe(gulp.dest('elements/.cache/'))
})

gulp.task('elements-sass', function() {
    return gulp.src(['elements/*/*.scss'], {base: 'elements'})
        .pipe(sass().on('error', $.sass.logError))
        .pipe(gulp.dest('elements/.cache/'))
})

gulp.task('elements-combine', function() {
    return gulp.src('elements/{,.cache/}*/')
        .pipe(polyfy())
        .pipe(gulp.dest('app/elements'))
})
```
