
function setup() {
  /**
   * References to divs
   */
  var divText = document.getElementById("text");
  var divRight = document.getElementById("right");
  var divTitle = document.getElementById("title");
  var divThumbs = document.getElementById("thumbs");
  var divLeft = document.getElementById("left");
  var divScroll = document.getElementById("scroll");
  var divGallery = document.getElementById("gallery");
  var divDBG = document.getElementById("debug");
  var spanText = document.getElementById("textmeasure");
  
  /* The category scroll line */
  var catScroll = 0;        // start with no scroll
  var txtPos;               // mouse xpos on category scroll
  var scrolling = false;    // tru if animating a scroll
  var scrollTimer = null;   // so we can turn off scroll timer
  var scrollLength = 800;   // guesstimate of text length
  var scrollIndex = 0;      // starting on first category
  
  /* Thumb paging */
  var thumIndex = 0;        // will be 0, 16, ...
 

  var config = imagelist.mediagallery;
  var category = imagelist.mediagallery.category;
  var catsize = category.length; 
  
  /**
   *  Build the category scroll list at top
   */
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
  
  /**
   * Create thumb divs as specified by config
   */
  (function() {
    var i,j,n;
    var divThumb;
    n = 0;
    for (i=0; i<config.thumbrows; i++) {
      for (j=0; j<config.thumbcolumns; j++) {
        divThumb = document.createElement('div');
        divThumb.className = 'thumb row' + i + ' col' + j;
        divThumb.id = "thum" + n;
        divThumbs.appendChild(divThumb);
        n++;
      }
    }
  })();
  
  function fillThumbs(catid) {
    var catlist = category[catid].entry;
    var picCount = catlist.length;
    var j;
    var toShow;
    var divThumb;
    var picInfo;
    var url;
    thumIndex = Math.min(picCount, thumIndex);
    toShow = Math.min(16, picCount - thumIndex);
    removeClass(".thumb", "active");
    for (j=0; j<toShow; j++) {
        picInfo = catlist[thumIndex + j];
        url = picInfo.entrythumblink;
        addClass("#thum" + j, "active");
        divThumb = document.getElementById('thum' + j);
        divThumb.style.backgroundImage = 'url("' + url + '")';
    }
    
    /**
     *  Need access to picCount 
     */
    divThumbs.onmousemove = function(e) {
      divTitle.innerHTML = "";
      if (e.target.id === 'thumbs') return;
      var id = thumIndex + +e.target.id.substr(4);
      if (id > picCount - 1) return;
      picInfo = catlist[thumIndex + id];
      var txt = htmlDecode(picInfo.$t);
      divTitle.innerHTML = txt;
    }
    
     divThumbs.onmouseout = function(e) {
       removeClass(".thumb", "enlarged");
     }
    
     divThumbs.onclick = function(e) {
      divTitle.innerHTML = "";
      removeClass(".thumb", "enlarged");
      if (e.target.id === 'thumbs') return;
      var id = thumIndex + +e.target.id.substr(4);
      if (id > picCount - 1) return;
      picInfo = catlist[thumIndex + id];
      var txt = htmlDecode(picInfo.$t);
      divTitle.innerHTML = txt;
      url = picInfo.entrylink;
      divThumb = document.getElementById('thum' + id);
      divThumb.style.backgroundImage = 'url("' + url + '")';
      addClass("#thum" + id, "enlarged");
    }
    
  }
  
  fillThumbs(0);
  
  
  spanText.innerHTML = catNames.join(' ');
  scrollLength = spanText.offsetWidth;
  divText.style.width = scrollLength + "px";
  divText.innerHTML = txtCat;
  
  divLeft.onclick = divLeft.onmouseover = function(e) {
    var speed;
    if (scrolling) return;
    if (scrollIndex > 0 ) {
      scrollIndex -= 1;
      speed = catWidths[scrollIndex];
      do_scroll(speed);
    } else {
      divText.style.left = "0px";
    }
  }
  
  divRight.onclick = divRight.onmouseover = function(e) {
    var speed;
    if (scrolling) return;
    if (scrollIndex < catsize - 1 ) {
      speed = -catWidths[scrollIndex];
      scrollIndex += 1;
      do_scroll(speed);
    } 
  }
  
  function do_scroll(speed) {
    catScroll += speed;
    catScroll = Math.min(0, catScroll );
    catScroll = Math.max(-scrollLength - 100, catScroll);
    divText.style.left = catScroll + "px";
    if (scrollTimer == null ) {
      scrollTimer = window.setInterval(scrollEnd, 600);
    }
  }
  
  function scrollEnd(e) {
    scrolling = false;
  }
  
  divText.addEventListener("click", showCategory);
  
  function showCategory(e) {
    var spanCat = e.target;
    var catIdx = spanCat.dataset.idx;    
    fillThumbs(catIdx);
  }
  

}

/**
 * removes class given by klass from all dom-objects matched by selector
 * @param {cssselect} selector
 * @param {string} klass
 */
function removeClass(selector, klass) {
	  var items = document.querySelectorAll(selector);
	  var i;
	  if (items.length) {
		  for (i = 0; i < items.length; i++) {
			  items[i].classList.remove(klass);
		  }
	  }
}


/**
   * adds class given by klass to all dom-objects matched by selector
   * @param {cssselect} selector
   * @param {string} klass
   */
function addClass(selector, klass) {
	  var items = document.querySelectorAll(selector);
	  var i;
	  if (items.length) {
		  for (i = 0; i < items.length; i++) {
			  items[i].classList.add(klass);
		  }
	  }
}

function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}