CKEDITOR.dialog.add("selectStyle", function (editor) {

  var styleOptions = [["Default", null]];

  //Build out the style options
  (function () {
    for (var style in CKEDITOR.config.autonumberStyles) {
      styleOptions.push([style, style]);
    }
  })();

  return {
    title: "Style Selection",
    minWidth: 400,
    minHeight: 200,
    contents: [
      {
        id: "tab-style",
        label: "Style Options",
        elements: [
          {
            type: "radio",
            id: "styleChooser",
            items: styleOptions
          }
        ]
      }
    ],
    onOk: function () {
      var style = this.getValueOf("tab-style", "styleChooser");
      if (editor.execCommand("setCurrentStyle", style)) {
        editor.execCommand("reapplyStyle");
      }
    }
  };
});
