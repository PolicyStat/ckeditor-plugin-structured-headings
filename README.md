# Automatically Structured Headings [![Build Status](https://travis-ci.org/PolicyStat/ckeditor-plugin-structured-headings.svg?branch=master)](https://travis-ci.org/PolicyStat/ckeditor-plugin-structured-headings)
## Configuration Options
### numberedElements
Array of elements (in order) that will be a part of numbering.
array, default:
```
[
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6"
]
```
### autonumberBaseClass
Base CSS class to apply to any autonumbered heading.
string, default: `"autonumber"`
### autonumberRestartClass
CSS class to add to any heading to restart numbering at that point.
string, default: `"autonumber-restart"`
### autonumberStyles
Listing of style definitions by name, each style definition is a CSS class to apply to all
elements of the current index level specified in numberedElements. (will apply to all h2s, all h3s)
a value of null will omit an additional style and only use base+level classes.
object, default:
```
{
    "Default": null,
    "Number": "autonumber-N",
    "Uppercase Roman": "autonumber-R",
    "Lowercase Roman": "autonumber-r",
    "Uppercase Letter": "autonumber-A",
    "Lowercase Letter": "autonumber-a"
  }
```
### autonumberLevelClasses
Array of CSS classes to be applied to elements at each level of numbering in addition to the base
class and style class.
array, default:
```
[
  "autonumber-0",
  "autonumber-1",
  "autonumber-2",
  "autonumber-3",
  "autonumber-4",
  "autonumber-5"
]
```