
function setup() {
  /**
   * References to divs
   */
  var divText = document.getElementById("text");
  var divScroll = document.getElementById("scroll");
  var divGallery = document.getElementById("gallery");
  var divDBG = document.getElementById("debug");
  var spanText = document.getElementById("textmeasure");
  
  var catScroll = 0;        // start with no scroll
  var txtPos;               // mouse xpos on category scroll
  var scrollSpeed = 0;      // no scrolling at start
  var onScroll = false;     // mouse not on scroll line
  var scrollTimer = null;   // so we can turn off scroll timer
  var scrollLength = 800;   // guesstimate of text length
  var scrollIndex = 0;      // starting on first category
 

  var config = imagelist.mediagallery;
  var category = imagelist.mediagallery.category;
  var catsize = category.length; 
  var catNames = [ ];
  var catWidths = [ ];    // pixel size of text each category
  var i;
  var txtCat = '';
  for (i = 0; i < catsize; i++) {
    spanText.innerHTML = category[i].title + "&nbsp;";
    catWidths.push(spanText.offsetWidth - 1);    // length of text in px
    catNames.push(category[i].title);
    txtCat += '<span class="cat" data-idx="' + i + '">'
            + category[i].title + ' </span>';
  }
  
  spanText.innerHTML = catNames.join(' ');
  scrollLength = spanText.offsetWidth;
  divText.style.width = scrollLength + "px";
  divText.innerHTML = txtCat;
  
 
  divText.onmousemove = function(e) {
    txtPos = e.offsetX + catScroll;
    divDBG.innerHTML = "" + txtPos;
    onScroll = false;
    if (    (txtPos < 50 && scrollIndex > 0) 
         || (txtPos > 409 && scrollIndex < catsize - 1) ) {
      onScroll = true;
    } 
  }
  
  function do_scroll() {
    if (txtPos < 50 && scrollIndex > 0 ) {
      scrollIndex -= 1;
      scrollSpeed = catWidths[scrollIndex];
    } else if (txtPos > 409 && scrollIndex < catsize - 1) {
      scrollSpeed = -catWidths[scrollIndex];
      scrollIndex += 1;
    } else if (scrollIndex === 0) {
      divText.style.left = "0px";
    } else {
      return;
    }
    catScroll += scrollSpeed;
    catScroll = Math.min(0, catScroll );
    catScroll = Math.max(-scrollLength - 100, catScroll);
    divText.style.left = catScroll + "px";
  }
  
  divText.onmouseenter = function(e) {
    onScroll = true;
    if (scrollTimer == null ) {
      scrollTimer = window.setInterval(scroll, 600);
    }
  }
  
  divText.onmouseleave = function(e) {
    onScroll = false;
    clearInterval(scrollTimer);
    scrollTimer = null;
  }
  
  
  
  function scroll() {
    if (! onScroll) return;
    do_scroll();
  }
  
  divText.addEventListener("click", showCategory);
  
  function showCategory(e) {
    var spanCat = e.target;
    var catIdx = spanCat.dataset.idx;    
    
  }
  

}