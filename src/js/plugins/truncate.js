String.prototype.str_truncate = function(figure,suffix='...'){
    
  var textLength = this.length;
  var textTrim = this.substr(0, figure)

  if (figure < textLength) {
    return textTrim + suffix
  } else if (figure >= textLength) {
    return textTrim
  }
  
}