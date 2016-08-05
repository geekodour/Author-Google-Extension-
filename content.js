var host; // CONTAINS TYHE HOSTNAME, eg. FLIPKART, AMAZON
var author; 
var imageNeeded; //6 IMAGES FOR AMAZON AND 4 FOR FLIPKART

//INITIAL FUNCTION TO SET HOST
(function checkHost(){
  host = window.location.host.split('.')[1];
})();

/*

********************FUNCTION DECLARATIONS*******************************

*/

//GET AUTHOR FUNCTION (USED)
function getAuthor(){
  //THIS EXTENION WORKS FOR AMAZON AND FLIPKART ONLY
  if(host === 'amazon'){
    imageNeeded = 7; //7 because 1st element will be stripped
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
    imageNeeded = 5;
    return document.querySelector('#container .PWqzqY a').innerText;
  }
}

//GET PLACEMENT DIV AND APPEND IMAGE(USED, DIFFERENT FOR FLIPKART AND AMAZON)
function getTheDiv(){
  if(host === 'amazon'){
    return document.getElementById('formats');
  }
  else if(host === 'flipkart'){
    return document.getElementsByClassName('_1idxIy')[0];
  }

}


//LOAD SCRIPT FUNCTION (NOT USED)
function loadScript(googleScript) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = googleScript; 
            document.body.appendChild(script);
        }




//DECODE HTML TEXT FUNCTION (USED)
function escapeHTML(htmlText){
	var r = /\\u([\d\w]{4})/gi;
	htmlText = htmlText.replace(r, function (match, grp) {
    	return String.fromCharCode(parseInt(grp, 16)); } );
	htmlText = unescape(htmlText);
	return htmlText;
}


/*

********************END OF FUNCTION DECLARATIONS*******************************

*/
var promise1 = new Promise(
    function(resolve,reject){
      setTimeout(function(){
        resolve(getAuthor());
      },1000);
    }
  );
promise1
.then(function(val){
  author = val+" author"; // GETS THE AUTHOR NAME AND APPENDS "AUTHOR" TO IT
  return 'https://www.google.co.in/search?&tbm=isch&q='+author; // PREPARES THE URL TO BE FETCHED
})
.then(function(url){
  //NETWORK REQUEST
  //***************
  fetch(url,{
    //no additional fetch parameters added
    //mode: 'no-cors'
  })
    .then(function(response){
      return response.text();
    })
    .then(function returnImage(htmlText){
    var reDataImage = /data:image\/jpeg/g; //REGULAR EXPRESSIONS TO GET BASE64 FOR 1st IMAGE

    var b64ImgArray = htmlText.split(reDataImage,imageNeeded).slice(1).map(function(oneImage){
      oneImage = "data:image/jpeg"+ oneImage.split("\"")[0];
      oneImage = escapeHTML(oneImage);
      return oneImage;
    })

    return b64ImgArray;

    /* THE BELOW CODE IS FOR RETURNING ONE IMAGE TEXT 64 (NOT USED CURRENTLY)

    htmlText = "data:image/jpeg" + htmlText.split(reDataImage).slice(1)[0].split("\"")[0];
    htmlText = escapeHTML(htmlText);
    return htmlText;

    */
    // SEE GIST : (THIS CODE WAS COMMENTED HERE) SEE GIST FOR HTML IMPLEMENTATION
    //GIST URL : https://gist.github.com/geekodour/6e784fe8ab6b5cde3095e3937f860e86
                
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
      imageContainerDiv.appendChild(UlElement);
      imageDivFromAmazon_FK.appendChild(imageContainerDiv);
    })
    .catch(function(err){
      console.log("ERREOR:",err);
    });
  //***********************************************************
  //END OF NETWORK REQUEST


});

