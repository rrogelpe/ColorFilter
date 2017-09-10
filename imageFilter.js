
var step = 0.11;
var sliderVal1 = 0.5;
var sliderVal2 = 0.5;
var sliderVal3 = 0.5;
var i = 0;
var lowerB,upperB;

var cloneC;

var destCtx;
var Hsv_array = [];

// Need to individually get each of the canvas elements to draw the circles on 
var circleCanv1 =document.getElementById("myCanvas1");
var c1 =circleCanv1.getContext("2d");
var w1 = circleCanv1.width;
var h1 = circleCanv1.height;

var circleCanv2 =document.getElementById("myCanvas2");
var c2 =circleCanv2.getContext("2d");
var w2 = circleCanv2.width;
var h2 = circleCanv2.height;

var circleCanv3 =document.getElementById("myCanvas3");
var c3 =circleCanv3.getContext("2d");
var w3 = circleCanv3.width;
var h3 = circleCanv3.height;

var imageDictionary = []
var titleDictionary = []

// ############### Functions Professor Izmirli gave us for color translating ############### // 
function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}

function pixelColor(imgd, x, y, r, g, b, a) {
    idx = (x + y*imgd.width)*4;
    imgd.data[idx  ] = r;
    imgd.data[idx+1] = g;
    imgd.data[idx+2] = b;
    imgd.data[idx+3] = a;
}

// Function used to populate drop down menu 
function populateImageList() {
  var xmlhttp=new XMLHttpRequest();
  var initialImageFileName; 
  xmlhttp.onreadystatechange=function( ){
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      var xmlDoc = xmlhttp.responseXML;
      var title;
      var options = "";

      for (var i =0; i<9; i++) {
        
        title = xmlDoc.getElementsByTagName("title")[i].childNodes[0].nodeValue;
        fileName = xmlDoc.getElementsByTagName("fileName")[i].childNodes[0].nodeValue;
        imageDictionary.push({key: title, value: fileName});
        
        options = options + "<option value=\""+title+"\">"+title+"</option> ";
        
      }

      document.getElementById("imageChooser").innerHTML = options;
      drawImage(true);
    }

  }
  xmlhttp.open("GET","images.xml",true);
  xmlhttp.send();
}

function makeCircle(c,w,h,sliderVal){
    var imgd = c.createImageData(w, h);
    var pix = imgd.data;
    var x, y;
    
    for(var r = 55; r > 30; r--){
        var inc = 0
        for(var t = 0.0; t < 2*Math.PI; t+=0.01, inc +=0.00159154943){
            x = Math.round(r*Math.cos(t) + w/2);
            y = Math.round(r*Math.sin(t) + h/2);
            rgbCol = hsvToRgb(inc, 1, 1);
            pixelColor(imgd, x, y, rgbCol[0], rgbCol[1], rgbCol[2], 255);
        }
    }
    c.putImageData(imgd, 0, 0);
    filterAngle(c,w,h,sliderVal);
}

function setStepVal(new_value) {
    step = new_value;
    makeCircle(c1,w1,h1,sliderVal1);
    makeCircle(c2,w2,h2,sliderVal2);
    makeCircle(c3,w3,h3,sliderVal3);
}

function setSliderVal1 (new_value) {
    sliderVal1 = new_value;
    makeCircle(c1,w1,h1,sliderVal1);
}

function setSliderVal2 (new_value) {
    sliderVal2 = new_value;
    makeCircle(c2,w2,h2,sliderVal2);
}

function setSliderVal3 (new_value) {
    sliderVal3 = new_value;
    makeCircle(c3,w3,h3,sliderVal3);
}
    
function filterAngle(c,w,h,sliderVal,string) {
    var radius = 55;
    var x,y;

    var vector2 = (sliderVal* (2*Math.PI)) - (step* (2*Math.PI)) ;
        x = Math.floor(radius*Math.cos(vector2) + w/2);
        y = Math.floor(radius*Math.sin(vector2) + h/2);
        c.beginPath();
        c.lineWidth=2;
        c.strokeStyle="Black";
        c.moveTo(w/2,h/2);
        c.lineTo(x,y);
        c.fillStyle="Black";
        c.closePath(); 
        c.stroke();
        lowerB = ((sliderVal*1)-(step*1));

    var vector1 = (sliderVal* (2*Math.PI)) + (step* (2*Math.PI)) ;
        x = Math.floor(radius*Math.cos(vector1) + w/2);
        y = Math.floor(radius*Math.sin(vector1) + h/2);
        c.beginPath();
        c.lineWidth=2;
        c.strokeStyle="White";
        c.moveTo(w/2,h/2);
        c.lineTo(x,y);
        c.fillStyle="White";
        c.closePath(); 
        c.stroke();

        upperB = ((sliderVal*1)+(step*1));
}

function getFileName(){

    var source;
    var e = document.getElementById("imageChooser")
    
    var strUser = e.options[e.selectedIndex].value;
    for (var key in imageDictionary){
        if (imageDictionary[key].key == strUser){
            source = imageDictionary[key].value
        }
    }
    return source;
}

function getTitle(){

    var source;
    var e = document.getElementById("imageChooser")
    var strUser = e.options[e.selectedIndex].value;
    return strUser;
}


function drawImage(bool) {
	var canv = document.getElementById("sourceCanvas");
	var c = canv.getContext("2d");

    var canv2=document.getElementById("outputCanvas"); // destination canvas
    var c2 = canv2.getContext("2d");

    var copycanv = document.getElementById("bootleg");
    cloneC = copycanv.getContext("2d");


    canv2.width = 400;
    canv2.height = 370;

	var w, h;
	var img = new Image();
    var img2 = new Image();
	var factor;

	img.onload = function(){

        factor = Math.min(400/this.width, 370/this.height);
		w = this.width * factor;
		h = this.height * factor;

		canv.width = w;					// resize the canvas to the new image size
		canv.height = h;

        copycanv.width = w;
        copycanv.height = h;

		c.drawImage(img, 0, 0, w, h );   //scales the image to fit into wxh pixels with the image's height and width ratio

        destCtx = canv.getContext("2d");

        cloneC.drawImage(img, 0, 0, w, h );

        c2.drawImage(img2, 0,0, 400, 370)
    
        // cloneC = cloneCanvas(c);

        if (bool == true){
            console.log("True")
            c.fillStyle = "#FFFF66";
            c.font = "bold 16px Arial";
            c.fillText("Rodrigo and Jigar", 20, 20);
        }
	}
    var fileName = getFileName()
    img.src = fileName
}

function drawFilteredImg() {
    if( document.getElementById("cb1").checked ) {
        filterAngle(c1,w1,h1,sliderVal1);
        Hsv_array[i++] = lowerB;
        Hsv_array[i++] = upperB;
    }

    if( document.getElementById("cb2").checked ) {
        filterAngle(c2,w2,h2,sliderVal2);
        Hsv_array[i++] = lowerB;
        Hsv_array[i++] = upperB;
    }

    if( document.getElementById("cb3").checked ) {
        filterAngle(c3,w3,h3,sliderVal3);
        Hsv_array[i++] = lowerB;
        Hsv_array[i++] = upperB;
    }
    i = 0;


    filterImage(Hsv_array[0],Hsv_array[1], Hsv_array[2], Hsv_array[3], Hsv_array[4], Hsv_array[5]);
    Hsv_array = []
}

function atStart(){
    makeCircle(c1, w1, h1, sliderVal1);
    makeCircle(c2, w2, h2, sliderVal2);
    makeCircle(c3, w3, h3, sliderVal3);
    populateImageList();
    filterImage();
}


function filterImage(initHSV1, endHSV1, initHSV2, endHSV2, initHSV3, endHSV3){
    
    drawImage(false)

    var canv=document.getElementById("sourceCanvas");  // source canvas
    var c=canv.getContext("2d");
    
    var w = canv.width;
    var h = canv.height;

    var canv2=document.getElementById("outputCanvas"); // destination canvas
    var c2=canv2.getContext("2d");
    canv2.width = w;                                                                
    canv2.height = h;

    // get source data image 
    var sourceImg = cloneC.getImageData(0, 0, w, h);
    var pix = sourceImg.data;

    drawImage(true)

    //create variables for destination image data
    var img = new Image(); 
    var destImg = c2.createImageData(w, h);
    var pix2 = destImg.data;

    var temphsv;
    //go through every pixel 
    for(var y = 0; y < h; y++)         
        for (var x = 0; x < w; x++){
            
            //find pixel id
            var idx = (w*y+x)*4;
            
            //change color to HSV number format 
            var hsvValue = rgbToHsv(pix[idx], pix[idx+1], pix[idx+2])[0];
            
            //check if color falls between user specified range 
            if ((initHSV1<=hsvValue && hsvValue<=endHSV1) || (initHSV2<=hsvValue && hsvValue<=endHSV2) || (initHSV3<=hsvValue && hsvValue<=endHSV3) ) {
                //pixel fell in user specified range so we don't want to copy this pixel over
                //from the source image 
                pix2[idx] = pix[idx];       
                pix2[idx+1] = pix[idx+1];
                pix2[idx+2] = pix[idx+2];
                pix2[idx+3] = pix[idx+3];
                // currently i have it set up so that if we don't end up copying the pixel over 
                //then we set the pixel color to white 
            }
            
            else{
                //else: copy the pixel over 
                pix2[idx] = 255;      
                pix2[idx+1] = 255;
                pix2[idx+2] = 255;
                pix2[idx+3] = 255
            }
        }

    c2.putImageData(destImg, 0,0);
    
    c2.fillStyle = "#80FF00";
    c2.font = "bold 16px Arial";
    c2.fillText(getTitle(), 20,20);

}
