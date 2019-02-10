# generate-react-library

Creates boilerplate for a node package containing a react component

## Installation
```
npm i -g generate-react-library
```

## Use
```
$ generate-react-library

? Please enter the project title: myComponent
? Select which libraries to install 
❯◉ babel
 ◯ webpack
 ◉ react
 ◉ react-dom
 ◯ eslint
 ```

Component can then be imported as such
```
import { MyComponent } from 'myComponent';
```
Note the auto-capitalized first letter of the component name


*improved docs coming soon*