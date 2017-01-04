/* exported initSample */
CKEDITOR.config.extraPlugins = "structuredheadings";

var initSample = function () {
  CKEDITOR.replace("editor", {
      removeButtons: "Format"
  });
};
