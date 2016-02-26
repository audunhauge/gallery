/* global imagelist */

function setup() {
  /**
   * References to divs
   */
  var divText = document.getElementById("text");
  var divTitle = document.getElementById("title");
  var divTitleText = document.getElementById("titletext");
  var divThumbs = document.getElementById("thumbs");
  var divLeft = document.getElementById("left");
  var divRight = document.getElementById("right");
  var divNext = document.getElementById("nextpage");
  var divPrev = document.getElementById("prevpage");
  var spanText = document.getElementById("textmeasure");
  
  /* The category scroll line */
  var scrolling = false;    // tru if animating a scroll
  var scrollTimer = null;   // so we can turn off scroll timer
  var scrollLength = 800;   // guesstimate of text length
  var scrollIndex = 0;      // starting on first category
  
  var config = imagelist.mediagallery;
  var category = imagelist.mediagallery.category;
  var catsize = category.length; 
  
  var catScroll = 0;      // stores scroll offset for category names
  var catPreload = [ ];   // set to 1 when category images preloaded 
  var catNames = [ ];     // category names
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
  
  /**
   * Start preloading image sets
   * Called once for each category while thumbs are being shown
   * @param {int} catid - index for category to load
   */
  function preload(catid) {
    if (catPreload[catid] === 1) return;
    catPreload[catid] = 1;
    var catlist = category[catid].entry;
    var j, picInfo, divPic;
    var divPreload = document.getElementById("preload");
    for (j=0; j<catlist.length; j++) {
      picInfo = catlist[j];
      divPic = document.createElement('img');
      divPic.src = picInfo.entrylink;
      divPreload.appendChild(divPic);
    }
  }
  
  /* Start of function-closure for thumbs/image interaction */
  /**********************************************************/
  /**
   *  Fills thumbs with images from selected category
   *  Sub-functions for user interactions with thumbs/enlarged pix
   *  This function-closure handles all interactions with thumbs
   *  and enlarged images. The vars in the closure keep state
   *  so we can access current image, thumbIndex (for paged view) etc
   *  @param {int} catid  category index
   */
  function fillThumbs(catid) {
    var catlist = category[catid].entry;
    var picCount = catlist.length;
    var divThumb;
    var picInfo;
    var id;                 // current image id
    var url;
    var thumIndex = 0;      // start on first page
    var enlarged = false;   // true if viewing large image
 
    preload(catid);         // load large images in preload div   
    setThumbPix();
    
    /**
     * Set url to thumb for current page of selected category
     * Will be called later when changing to new page (16 thumbs/page)
     */
    function setThumbPix() {
      var j;
      var toShow = Math.min(16, picCount - thumIndex);
      removeClass(".thumb", "active");
      for (j=0; j<toShow; j++) {
        picInfo = catlist[thumIndex + j];
        url = picInfo.entrythumblink;
        addClass("#thum" + j, "active");
        divThumb = document.getElementById('thum' + j);
        divThumb.style.backgroundImage = 'url("' + url + '")';
      }
      divPrev.classList.remove("hide");
      divNext.classList.remove("hide");
      if (thumIndex === 0) {
        divPrev.classList.add("hide");
      }
      if (thumIndex >= picCount - 16) {
        divNext.classList.add("hide");
      }
    }
    
    /**
     *  Update picture info    
     */
    divThumbs.onmousemove = function(e) {
      if (enlarged) return;
      divTitleText.innerHTML = "";
      if (e.target.id === 'thumbs') return;
      id = +e.target.id.substr(4);
      if (id > picCount - 1) return;
      picInfo = catlist[thumIndex + id];
      var txt = htmlDecode(picInfo.$t);
      divTitleText.innerHTML = txt;
    }
      
    /**
     * Click on thumb/picture
     * Toggles between thumb/enlarged view
     * If view is enlarged and click close to right/left edge
     * then show next/prev picture
     */
    divThumbs.onclick = function(e) {
      if (enlarged) {
        if (e.offsetX < 60) {
          prevPix();
        } else if (e.offsetX > 455) {
          nextPix();
        } else {
          removeClass(".thumb", "enlarged");
          enlarged = false;
        }
      } else {
        enlarged = true;
        divTitleText.innerHTML = "";
        removeClass(".thumb", "enlarged");
        if (e.target.id === 'thumbs') return;
        id = +e.target.id.substr(4);
        if (id > picCount - 1) return;
        showPix();
      }
    }
      
    /**
      *  Navigate to next/prev page of current category
      */
    divNext.onclick = function (e) {
      if (thumIndex < picCount - 16) {
        thumIndex += 16;
      	id = 0;
      	setThumbPix();
      }
    }
    
    divPrev.onclick = function (e) {
      if (thumIndex > 15) {
  	    thumIndex -= 16;
      	id = 0;
      	setThumbPix();
      } 
    }
    
    /**
     * Show next pix in category, changing page if neccessary
     * current page is thumbIndex, changed in increments of 16
     */
    function nextPix() {
      if (id > picCount - 2) return;
      id ++;
      if (id > 15) {
      	thumIndex += 16;
      	id = 0;
      	setThumbPix();
      }
      showPix();
    }
    
    /**
     * Show prev pix in category, changing page if neccessary
     * current page is thumbIndex, changed in increments of 16
     */
    function prevPix() {
      if (id < 1 && thumIndex === 0) return;
      id --;
      if (id < 0) {
      	thumIndex -= 16;
      	id = 15;
      	setThumbPix();
      }
      showPix();
    }
    
    /**
     * Shows current selected picture enlarged
     * First removes class enlarged from all thumbs
     * Updates info text for current picture
     * Sets background to url of large version
     * Scales up the picture frame (class enlarged)
     */
    function showPix() {
      divTitleText.innerHTML = "";
      removeClass(".thumb", "enlarged");
      picInfo = catlist[thumIndex + id];
      var txt = htmlDecode(picInfo.$t);
      divTitleText.innerHTML = txt;
      url = picInfo.entrylink;
      divThumb = document.getElementById('thum' + id);
      divThumb.style.backgroundImage = 'url("' + url + '")';
      addClass("#thum" + id, "enlarged");
    }
  }
  /* End of function-closure for thumbs/image interaction */
  /********************************************************/
  
  fillThumbs(0);   // auto-fill thumbs from first category
  
  divLeft.onclick = divLeft.onmouseover = goLeft;
  
  /**
   * Scroll categories so a new one comes in from the left side
   */
  function goLeft(e) {
    var distance;
    if (scrolling) return;
    if (scrollIndex > 0 ) {
      scrollIndex -= 1;
      distance = catWidths[scrollIndex];
      do_scroll(distance);
    } else {
      divText.style.left = "0px";
    }
  }
  
  divRight.onclick = divRight.onmouseover = goRight;
  
  /**
   * Scroll categories so a new one comes in from the right side
   */  
  function goRight(e) {
    var distance;
    if (scrolling) return;
    if (scrollIndex < catsize - 1 ) {
      distance = -catWidths[scrollIndex];
      scrollIndex += 1;
      do_scroll(distance);
    } 
  }
  
   /**
   * Scroll categories right/left
   * catScroll accumulates total scroll length
   * A timer blocks scrolling for 0.5s, the scroll takes 0.3s
   * @param {int} speed  - displacement equal to text size of category name
   */
  function do_scroll(distance) {
    catScroll += distance;
    catScroll = Math.min(0, catScroll );
    catScroll = Math.max(-scrollLength - 100, catScroll);
    divText.style.left = catScroll + "px";
    scrolling = true;
    if (scrollTimer == null ) {
      scrollTimer = window.setInterval(scrollEnd, 500);
    }
  }
  
  /**
   * Enable scrolling again, called by timer
   */
  function scrollEnd(e) {
    scrolling = false;
  }
  
  divText.addEventListener("click", showCategory);
  
  /**
   * A category is selected, mark with green font
   * and call fillThumbs with category index
   */
  function showCategory(e) {
    removeClass("span.cat", "selected");
    var spanCat = e.target;
    var catIdx = spanCat.dataset.idx;    
    fillThumbs(catIdx);
    spanCat.classList.add("selected");
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

/**
 * Converts html-enteties to markup
 * @param {string} input - text containing html-enteties
 * @returns {string}  input with all enteties replaced, (&lt; becomes <)
 */
function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}