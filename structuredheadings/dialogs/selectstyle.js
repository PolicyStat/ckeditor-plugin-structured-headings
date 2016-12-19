CKEDITOR.dialog.add("selectStyle", function (editor) {

  var styleOptions = [["Default", null]];

  //Build out the style options
  (function () {
    for (var style in editor.config.autonumberStyles) {
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
    },
    onShow: function () {
      var document = this.getElement().getDocument();
      var elementList = document.find("input[value='" +
              editor.config.autonumberCurrentStyle + "']");
      if (elementList.count() > 0) {
        var element = elementList.getItem(0);
        element.$.checked = true;
        element.focus();
      }
    }
  };
});
