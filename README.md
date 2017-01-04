# Automatically Structured Headings [![Build Status](https://travis-ci.org/PolicyStat/ckeditor-plugin-structured-headings.svg?branch=master)](https://travis-ci.org/PolicyStat/ckeditor-plugin-structured-headings)
## Configuration Options
### autonumberBaseClass
Base CSS class to apply to any autonumbered heading.
string, default: `"autonumber"`
### autonumberRestartClass
CSS class to add to any heading to restart numbering at that point.
string, default: `"autonumber-restart"`
### autonumberStyles
Listing of style definitions by name, each specifying what additional CSS
class to apply to each header element. A value of `null` signifies using the
BaseClass only.
object, default:
```
{ 
  Default: null,
  Narara: {
    h1: "autonumber-N",
    h2: "autonumber-a",
    h3: "autonumber-r",
    h4: "autonumber-a",
    h5: "autonumber-r",
    h6: "autonumber-a"
  },
  Aarara: {
    h1: "autonumber-A",
    h2: "autonumber-a",
    h3: "autonumber-r",
    h4: "autonumber-a",
    h5: "autonumber-r",
    h6: "autonumber-a"
  },
  RANaNa: {
    h1: "autonumber-R",
    h2: "autonumber-A",
    h3: "autonumber-N",
    h4: "autonumber-a",
    h5: "autonumber-N",
    h6: "autonumber-a"
  }
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
string, default: `"Default"`