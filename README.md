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
];
```
### autonumberBaseClass
Base CSS class to apply to any autonumbered heading. Also appended with the index number of the
current level. H1 = autonumber-0, H2 = autonumber-1, etc.
string, default: `"autonumber"`
### autonumberRestartClass
CSS class to add to any heading to restart numbering at that point.
string, default: `"autonumber-restart"`
### autonumberStyles
Listing of style definitions by name, each style definition is an array specifying what additional
CSS class to apply to each index level of the element as specified in numberedElements.
object, default:
```
{ 
  "Numeric": [
    "autonumber-0",
    "autonumber-1",
    "autonumber-2",
    "autonumber-3",
    "autonumber-4",
    "autonumbe4-5"
  ],
  "Number Lowercase Roman": [
    "autonumber-N",
    "autonumber-a",
    "autonumber-r",
    "autonumber-a",
    "autonumber-r",
    "autonumber-a"
  ],
  "Letter Lowercase Roman": [
    "autonumber-A",
    "autonumber-a",
    "autonumber-r",
    "autonumber-a",
    "autonumber-r",
    "autonumber-a"
  ],
  "Roman Uppercase Number": [
    "autonumber-R",
    "autonumber-A",
    "autonumber-N",
    "autonumber-a",
    "autonumber-N",
    "autonumber-a"
  ]
}
```
### autonumberStyleImages
A Listing of style definitions by name, with each value pointing to an image file name
to be used as a thumbnail display on the style chooser dialog. (Should be 72px by 72px)
object, default:
```
{
  Default: "Default.png",
  Narara: "Narara.png",
  Aarara: "Aarara.png",
  RANaNa: "RANaNa.png"
}
```
### autonumberCurrentStyle
The name of the currently active style to be applied.
string, default: `"Numeric"`