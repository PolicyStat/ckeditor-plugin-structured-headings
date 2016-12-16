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
            id: "style",
            label: "Styles",
            items: styleOptions,
            default: null
          }
        ]
      }
    ],
    onOk: function () {
      var style = this.getValueOf("tab-style", "style");
      CKEDITOR.config.autonumberCurrentStyle = style;
      editor.execCommand("reapplyStyle");
    }
  };
});
