// Keep track of some UI elements
var overlayControls = document.getElementById('overlayControls');
var scaleTxt = document.getElementById('scaleTxt');
var offsetTxt = document.getElementById('offsetTxt');

// Track our overlays for re-use laterç
var overlays = [];

// Scale limits---tiny hats look silly, but tiny monocles are fun.
var minScale = [];
var maxScale = [];
var baseURL= "https://cocacolahangout.appspot.com"

var keepAnimating = false;

/** Responds to buttons
 * @param {string} name Item to show.
 */
function showOverlay(name) {
  hideAllOverlays();
  currentItem = name;
 // setControlVisibility(true);
  overlays[currentItem].setVisible(true);
  updateControls();
}

function showNothing() {
  currentItem = null;
  hideAllOverlays();
  setControlVisibility(false);
}

/** Responds to scale slider
 * @param {string} value The new scale.
 */
function onSetScale(value) {
  scaleTxt.innerHTML = parseFloat(value).toFixed(2);

  if (currentItem == 'fancy') {
    overlays[currentItem].setScale(parseFloat(value),
        gapi.hangout.av.effects.ScaleReference.WIDTH);
  } else {
    overlays[currentItem].setScale(parseFloat(value));
  }
}

/** Responds to offset slider
 * @param {string} value The new offset.
 */
function onSetOffset(value) {
  console.log('Setting ' + value);

  offsetTxt.innerHTML = parseFloat(value).toFixed(2);

  if (currentItem == 'fancy') {
    overlays[currentItem].setPosition(0, parseFloat(value));
  } else {
    overlays[currentItem].setOffset(0, parseFloat(value));
  }
}

function setControlVisibility(val) {
  if (val) {
    overlayControls.style.visibility = 'visible';
  } else {
    overlayControls.style.visibility = 'hidden';
  }
}


function updateOverlayControls() {
  var overlay = overlays[currentItem];
  var min = minScale[currentItem];
  var max = maxScale[currentItem];

  // Overlays magnitude and which dimension of the screen to return
  var scale = overlay.getScale().magnitude;

  document.getElementById('scaleSlider').value = scale;
  document.getElementById('scaleSlider').min = min;
  document.getElementById('scaleSlider').max = max;
  document.getElementById('scaleTxt').innerHTML =
      scale.toFixed(2);

  document.getElementById('offsetSlider').value = overlay.getPosition().y;
  document.getElementById('offsetTxt').innerHTML =
      overlay.getPosition().y.toFixed(2);
}

function updateFaceTrackingOverlayControls() {
  var overlay = overlays[currentItem];
  var min = minScale[currentItem];
  var max = maxScale[currentItem];

  // FaceTrackingOverlays return only magnitude
  var scale = overlay.getScale();

  document.getElementById('scaleSlider').value = scale;
  document.getElementById('scaleSlider').min = min;
  document.getElementById('scaleSlider').max = max;
  document.getElementById('scaleTxt').innerHTML =
      scale.toFixed(2);

  document.getElementById('offsetSlider').value = overlay.getOffset().y;
  document.getElementById('offsetTxt').innerHTML =
      overlay.getOffset().y.toFixed(2);
}


/** Resets the controls for each type of wearable item */
function updateControls() {
  // Don't show these controls for
  if (currentItem == 'fancy') {
    updateOverlayControls();
  } else {
    updateFaceTrackingOverlayControls();
  }
}

/** For removing every overlay */
function hideAllOverlays() {
  for (var index in overlays) {
    overlays[index].setVisible(false);
  }
  disposeArbitraryOverlay();
  keepAnimating = false;
}

function createTextOverlay(string) {
  // Create a canvas to draw on
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', 166);
  canvas.setAttribute('height', 100);
  
  var context = canvas.getContext('2d');

  // Draw background
  context.fillStyle = '#BBB';
  context.fillRect(0,0,166,50);

  // Draw text
  context.font = '32pt Impact';
  context.lineWidth = 6;
  context.lineStyle = '#000';
  context.fillStyle = '#FFF';
  context.fillColor = '#ffff00';
  context.fillColor = '#ffff00';
  context.textAlign = 'center';
  context.textBaseline = 'bottom';
  context.strokeText(string, canvas.width / 2, canvas.height / 2);
  context.fillText(string, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL();
}

/** Initialize our constants, build the overlays */
function createOverlays() {
  var topHat = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/topHat.png');
  overlays['topHat'] = topHat.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
       'scaleWithFace': true,
       'rotateWithFace': true,
       'scale': 1.0});
  minScale['topHat'] = 0.25;
  maxScale['topHat'] = 1.5;

  var mono = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/monocle.png');
  overlays['mono'] = mono.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.RIGHT_EYE,
       'scaleWithFace': true,
       'scale': 1.0});
  minScale['mono'] = 0.5;
  maxScale['mono'] = 1.5;

  // Cargando nuevas imagenes /////
    // Imagenes para TrackingOverlay
  var lengua = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/images/icn_expresiones_lengua.png');
  overlays['lengua'] = lengua.createFaceTrackingOverlay(
      {'trackingFeature':
        gapi.hangout.av.effects.FaceTrackingFeature.MOUTH_CENTER,
        'scaleWithFace': true,
        'scale': 0.75});
  minScale['lengua'] = 0.13;
  maxScale['lengua'] = 0.13;

  var sonrisa = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/images/icn_expresiones_sonrisa.png');
  overlays['sonrisa'] = sonrisa.createFaceTrackingOverlay(
      {'trackingFeature': 
        gapi.hangout.av.effects.FaceTrackingFeature.MOUTH_CENTER,
      'scaleWithFace': true,
      'scale': 0.75});
  minScale['sonrisa'] = 0.01;
  maxScale['sonrisa'] = 0.01;

  var ave = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/images/icn_corbata.png');
  overlays['ave'] = ave.createFaceTrackingOverlay(
      {'trackingFeature': 
        gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
      'scaleWithFace':true,
      'offset': {x:0, y:1.2},
      'scale': 1.3});
  minScale['ave'] = 0.5;
  maxScale['ave'] = 1.0;

  var foco = gapi.hangout.av.effects.createImageResource(
    baseURL+'/static/images/icn_marco.png');
  overlays['foco'] = foco.createFaceTrackingOverlay(
    {'trackingFeature': 
      gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
      'scaleWithFace':true,
      'scale': 0.5});
  minScale['foco'] = 3.0;
  maxScale['foco'] = 3.0;

    // Imagenes para StatickOverlay

    var star = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/images/icn_estrella.png');
      overlays['star'] = star.createOverlay(
        {'scale':
        {'magnitude': 0.2,
        'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
      overlays['star'].setPosition(-0.2 , -0.3);
      minScale['star'] = 1.5;
      maxScale['star'] = 2.5;

    var sol = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/images/icn_sol.png');
      overlays['sol'] = sol.createOverlay(
        {'scale':
        {'magnitude': 0.2,
        'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
      overlays['sol'].setPosition(-0.2, -0.3);
      minScale['sol'] = 1.5;
      maxScale['sol'] = 2.5;

      var hola = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/images/icn_frases.png');
      overlays['hola'] = hola.createOverlay(
        {'scale':
        {'magnitude': 0.3,
        'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
      overlays['hola'].setPosition(0.2, -0.3);
      minScale['hola'] = 1.5;
      maxScale['hola'] = 2.5;

      var heart = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/images/icn_corazon_foco.png');
      overlays['heart'] = heart.createOverlay(
        {'scale':
        {'magnitude': 0.5,
        'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
      overlays['heart'].setPosition(-0.3, 0.3);
      minScale['heart'] = 1.5;
      maxScale['heart'] = 2.5;

  /////////////////////////////////

  var stache = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/mustache.png');
  overlays['stache'] = stache.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.NOSE_TIP,
       'scaleWithFace': true,
       'rotateWithFace': true});
  minScale['stache'] = 0.65;
  maxScale['stache'] = 2.5;

  var nuevo = gapi.hangout.av.effects.createImageResource(
      baseURL+'/static/monocle.png');
  overlays['nuevo'] = nuevo.createFaceTrackingOverlay(
      {'trackingFeature':
        gapi.hangout.av.effects.FaceTrackingFeature.NOSE_TIP,
        'scaleWithFace': true,
        'rotateWithFace': true});
  minScale['nuevo'] = 0.65;
  maxScale['nuevo'] = 2.5;

  var fancy = gapi.hangout.av.effects.createImageResource(
      createTextOverlay('Hello!'));
  // Create this non-moving overlay that will be 100% of the width
  // of the video feed.
  overlays['fancy'] = fancy.createOverlay(
      {'scale':
       {'magnitude': 0.5,
        'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
  // Put the text x-centered and near the bottom of the frame
  overlays['fancy'].setPosition(-0.5, 0.5);
  minScale['fancy'] = 1.0;
  maxScale['fancy'] = 2.5;
}

// Arbitray overlay
var arbitraryResource = null;
var arbitraryOverlay = null;

function disposeArbitraryOverlay() {
    if (arbitraryResource) {
        arbitraryResource.dispose();
        arbitraryResource = null;
    }
}

function loadOverlay(uri) {
    overlayControls = document.getElementById('overlayControls');
    scaleTxt = document.getElementById('scaleTxt');
    offsetTxt = document.getElementById('offsetTxt');
    showNothing();
    
    arbitraryResource = gapi.hangout.av.effects.createImageResource(
        uri);

    // Use an onLoad handler 
    arbitraryResource.onLoad.add( function(event) {
        if ( !event.isLoaded ) {
            alert("We could not load your overlay.");
        } else {
            alert("We loaded your overlay.");
        }
    });

    // Create this non-moving overlay that will be 50% of the width
    // of the video feed.
    arbitraryOverlay = arbitraryResource.createOverlay(
        {'scale':
         {'magnitude': 0.5,
          'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
    // Put the text x-centered and halfway down the frame
    arbitraryOverlay.setPosition(0, 0.25);
    arbitraryOverlay.setVisible(true);
}


// Animated
var frameCount = 0;

var animatedResource = null;
var animatedOverlay = null;

function updateAnimatedOverlay(time) {  
    var oldResource = animatedResource;
    var oldOverlay = animatedOverlay;

    animatedResource = gapi.hangout.av.effects.createImageResource(
        createTextOverlay('Tick: ' + frameCount));
    // Create this non-moving overlay that will be 50% of the width
    // of the video feed.
    animatedOverlay = animatedResource.createOverlay(
        {'scale':
         {'magnitude': 0.5,
          'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
    // Put the text x-centered and near the bottom of the frame
    animatedOverlay.setPosition(0, 0.45);
    animatedOverlay.setVisible(true);

    if (oldResource) {
        // This will also dispose of the related overlay.
        oldResource.dispose();
        oldResource = null;
    }
}

function animLoop() {
    if (keepAnimating) {
        window.setTimeout(animLoop, 1000);
        frameCount++;
        updateAnimatedOverlay(frameCount);
    }
}

function showAnimatedOverlay() {
    showNothing();
    keepAnimating = true;
    animLoop();
}

createOverlays();

var id = gapi.hangout.getLocalParticipantId();
var canvas = gapi.hangout.layout.getVideoCanvas();

canvas.setWidth(600);
canvas.setPosition(300, 50);
canvas.setVisible(true);

// SOUND

var gooddaySoundURL =
    baseURL+'/static/goodday.wav';

var gooddaySound = gapi.hangout.av.effects.createAudioResource(
    gooddaySoundURL).createSound({loop: false, localOnly: false});

// Note that we are playing a global audio event,
// so other hangouts will hear it.
function sayGoodDay() {
    gooddaySound.play();
}

// Set mirroring and unmirroring
function updateMirroring() {
  var val =  document.querySelector('#mirror-checkbox').checked;

  gapi.hangout.av.setLocalParticipantVideoMirrored(val);
}

function init() {
  // When API is ready...                                                         
  gapi.hangout.onApiReady.add(
    function(eventObj) {
      if (eventObj.isApiReady) {
        overlayControls = document.getElementById('overlayControls');
        scaleTxt = document.getElementById('scaleTxt');
        offsetTxt = document.getElementById('offsetTxt');


        console.log("everything ready");
        //document.querySelector('#showParticipants').style.visibility = 'visible';
        document.querySelector('#fullUI').style.visibility = 'visible';
      }
    });
}
gadgets.util.registerOnLoadHandler(init);