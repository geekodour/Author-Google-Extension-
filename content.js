var host;
var author;
var imageNeeded; // 7

// get host, strip domain
(function checkHost(){
  host = window.location.host.split('.')[1];
})();


// get author names
function getAuthor(){
  if(host === 'amazon'){
    imageNeeded = 7;
    try{
      var authorRAW = document.querySelector('.author.notFaded a').innerText;
      var authorSplit = authorRAW.split(' ');
      if(authorSplit[0] === "Visit"){
        return authorRAW.split("Amazon's")[1].split("Page")[0];
      }
      else {
        return authorRAW;
      }
    }
    catch(e){
      // don't show any errors
    }

    /* Here goes the alternative short,easy and clear code to do the above

    try{
      return document.querySelector('.contributorNameID').innerText
        ? document.querySelector('.contributorNameID').innerText
        : document.querySelector('.author.notFaded a').innerText;
    }
    catch(e){
      //do nothing
    } */
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

// get the main div
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

// decode html string
function escapeHTML(htmlText){
	var r = /\\u([\d\w]{4})/gi;
	htmlText = htmlText.replace(r, function (match, grp) {
    	return String.fromCharCode(parseInt(grp, 16)); } );
	htmlText = unescape(htmlText);
	return htmlText;
}



// Main implementation starts from here

// Make a promise for getting the author name, because the author name is not instantly available sometimes
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
    .then(function returnb64(htmlText){
      var reDataImage = /data:image\/jpeg/g; //regex for : data:image/jpeg
      var b64ImgArray = htmlText.split(reDataImage,imageNeeded).slice(1).map(function(oneImage){
        oneImage = "data:image/jpeg"+ oneImage.split("\"")[0];
        oneImage = escapeHTML(oneImage);
        return oneImage;
        });
      return b64ImgArray;
    })
    .then(function appendToSite(imgElArray){

      // generate image element array from base64 encoded string array
      imgElArray = imgElArray.map(function(b64ImgText){
        var imageTag = document.createElement('img');
        imageTag.src = b64ImgText;
        return imageTag;
      });

      // getting the container div from amazon or flipkart
      var mainDiv = getTheDiv();

      // creating image container div
      var imgContainerDiv = document.createElement('div');
      imgContainerDiv.className = "image-gallery";

      // unordered list
      var ulEl = document.createElement('ul');
      ulEl.className = "image-ul-list";

      // putting each img element in its own li element then inside a ul element
      imgElArray.forEach(function(imgEl){
        var liEl = document.createElement('li');
        liEl.appendChild(imgEl);
        ulEl.appendChild(liEl);
      });

      // header the gallery
      var headerEl = document.createElement('h2');
      headerEl.innerText = "Photos of "+ author;

      // putting everything together
      imgContainerDiv.appendChild(headerEl);
      imgContainerDiv.appendChild(ulEl);

      // appending into main webpage by checking the host
      if(host === 'flipkart'){
        mainDiv[0].insertBefore(imgContainerDiv,mainDiv[1]);
      }
      else{
        mainDiv.appendChild(imgContainerDiv);
      }
    })
    .catch(function(err){
      /*let it pass
      console.log("ERREOR:",err);*/
    });


});

