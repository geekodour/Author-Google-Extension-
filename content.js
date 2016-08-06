var host; 
var author; 
var imageNeeded;

// get host, strip domain
(function checkHost(){
  host = window.location.host.split('.')[1];
})();


//GET AUTHOR FUNCTION (USED)
function getAuthor(){
  if(host === 'amazon'){
    // Keep it in the long form as of now, I do some tests on it later
    imageNeeded = 7; // 7 because 1st element will be stripped
    var authorRAW = document.querySelector('.author.notFaded a').innerText;
    var authorSplit = authorRAW.split(' ');
    if(authorSplit[0] === "Visit"){
      return authorRAW.split("Amazon's")[1].split("Page")[0];
    }
  else {
      return authorRAW;
    }  
  }
  else if(host === 'flipkart'){
    imageNeeded = 7;
    try{
      return document.querySelector('#container .PWqzqY a').innerText;
    }
    catch(e){
      //don't show any error
    }
  }
}

//GET PLACEMENT DIV AND APPEND IMAGE(USED, DIFFERENT FOR FLIPKART AND AMAZON)
function getTheDiv(){
  if(host === 'amazon'){
    return document.getElementById('formats')? document.getElementById('formats') : document.querySelector('.a-box.a-box-tab.a-tab-content');
  }
  else if(host === 'flipkart'){
    var sib = document.querySelector('._3LEeBH');
    var parent = document.querySelector('._1MVZfW').parentElement.lastChild;
    return [parent,sib];
  }

}

//DECODE HTML TEXT FUNCTION (USED)
function escapeHTML(htmlText){
	var r = /\\u([\d\w]{4})/gi;
	htmlText = htmlText.replace(r, function (match, grp) {
    	return String.fromCharCode(parseInt(grp, 16)); } );
	htmlText = unescape(htmlText);
	return htmlText;
}

// Make a promise for getting the author name, because the author name is not instantly available
var authorWait = new Promise(
    function(resolve,reject){
      setTimeout(function(){
        resolve(getAuthor());
      },1000);
    });

authorWait
.then(function(authorName){
  author = authorName; //assign to global author (to be used later)
  return 'https://www.google.co.in/search?&tbm=isch&q='+authorName+" author"; // PREPARES THE URL TO BE FETCHED
})
.then(function(url){
  fetch(url,{})
    .then(function(response){
      return response.text();
    })
    .then(function returnImage(htmlText){
      var reDataImage = /data:image\/jpeg/g; //regex for : data:image/jpeg
      var b64ImgArray = htmlText.split(reDataImage,imageNeeded).slice(1).map(function(oneImage){
        oneImage = "data:image/jpeg"+ oneImage.split("\"")[0];
        oneImage = escapeHTML(oneImage);
        return oneImage;
        })
      return b64ImgArray;
    })
    .then(function appendToSite(base64Array){
      
      //GENERATING IMAGE TAG
      base64Array = base64Array.map(function(b64ImgText){
        var imageTag = document.createElement('img');
        imageTag.src = b64ImgText;
        return imageTag;
      });
      //IMAGE TAG COMPLETE

      //GET THE DIV FROM AMAZON OR FLIPKART
      var imageDivFromAmazon_FK = getTheDiv();

      //NOW MAKE SLIDER DIV (COULD NOT COMPLETE MAKING THE SLIDER, SO MADE IT COLLAGE)
      var imageContainerDiv = document.createElement('div');
      imageContainerDiv.className = "image-gallery-div";
      //END OF MAKING OF SLIDER DIV

      //UNORDERED LIST ELEMENT FOR IMAGES
      var UlElement = document.createElement('ul');
      UlElement.className = "image-ul-list";
      //END OF UNORDERED IMAGES
      base64Array.forEach(function(imgEl){
        //MAKE EACH IMAGE TAG A LIST TAG HERE, THEN INSERT TO THE UL ELEMENT
        var LiElement = document.createElement('li');
        LiElement.appendChild(imgEl);
        UlElement.appendChild(LiElement);
      });
      //MAKE A NICE HEADER
      var headerEl = document.createElement('h2');
      headerEl.innerText = "Photos of "+ author;
      //END OF MAKING HEADER ELEMENT
      imageContainerDiv.appendChild(headerEl);
      imageContainerDiv.appendChild(UlElement);
      if(host === 'flipkart'){
      imageDivFromAmazon_FK[0].insertBefore(imageContainerDiv,imageDivFromAmazon_FK[1]);
      }
      else{
      imageDivFromAmazon_FK.appendChild(imageContainerDiv);
      }
    })
    .catch(function(err){
      //JUST LET IT PAS FOR NOW
      //console.log("ERREOR:",err);
    });
  //***********************************************************
  //END OF NETWORK REQUEST


});

