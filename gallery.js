
function setup() {
  var config = imagelist.mediagallery;
  var category = imagelist.mediagallery.category;
  var catsize = category.length; 
  var catNames = [ ];
  var i;
  for (i = 0; i < catsize; i++) {
    catNames.push(category[i].title);
  }
  document.getElementById("text").innerHTML = catNames.join('');
}