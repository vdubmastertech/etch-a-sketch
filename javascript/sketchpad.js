// global variables
var defaultSketchpadWidth = 24;
var sketchpadWidth = defaultSketchpadWidth;  // initial sketchpad width
var drawModeID = 100;
var totalColumns;
var totalRows;
var numSquares;
var keyIsDown = false;

// cache selectors for performance and speed reasons
var $sketchpad = $("#sketchpad");
var $square;
var $instructions = $(".instructions-text");
var $modeMenuText =  $(".mode-menu-text");
var $hiddenInitially = $(".hidden-initially");

// will scroll down to the top of the menu div (i.e. anytime drawSketchpad() is called)
var scrollToBoard = function(){
    $('html, body').animate({
        scrollTop: $("#sketchpad-menu").offset().top
    }, 400);
}

var clearBoard = function() {
    $sketchpad.empty();
    drawSketchpad(sketchpadWidth);
}

// builds the sketchpad
var drawSketchpad = function(width) {
    var squareSize = intRound($sketchpad.width() / width, 6);
    var totalColumns = $sketchpad.width() / squareSize;
    var totalRows = $sketchpad.height() / squareSize;
    var sketchpadArray = [];
    numSquares = 0;
    var columnId = 0;
    var rowID = 0;

    for (var x = 0; x < sketchpadWidth; x++) {
        sketchpadArray += '<span class="columns">';
        columnId++;
        for (var i = 0; i < sketchpadWidth; i++) {
            numSquares += 1;
            rowID++
            sketchpadArray += '<span data-column="' + columnId + '"data-row="' + rowID +
                              '"class="square" style="width:' + squareSize + 'px; height:' + squareSize + 'px;"></span>';
        };
        rowID = 0;
    };
    $sketchpad.empty();
    $sketchpad.append(sketchpadArray);
    $square = $(".square");     // cache the .square selector only after all squares have been added to the page
    $instructions.show();
}

// when first loading the page, first sketchpad created upon selection of draw mode
var firstDrawMode = function() {
    $(".initial-selection-dropdown li").on("click", function(){
        $(".initial-selection").hide();
        $(".hidden-initially").show();
        drawSketchpad(sketchpadWidth);  // create the initial board
        scrollToBoard();
    }); 
}

// changes the draw mode based on currently selected draw mode option
var drawMode = function(mode, selector){
    $sketchpad.off(".draw");
    $(".dropdown-menu > li").show();
    selector.hide();
    switch(mode)
    {        
        case 1: $modeMenuText.text("Default");
                paintbrush(mode);
                break;
        case 2: $modeMenuText.text("Random Colors");
                paintbrush(mode);
                break;
        case 3: $modeMenuText.text("Darken");
                paintbrush(mode);
                break;
        case 4: $modeMenuText.text("Snake");
                paintbrush(mode);
                break;
        default: break;
    }
}

var paintbrush = function(mode){
    $sketchpad.on("mouseover.draw", ".square", function(){
        var rgb = getRGB($(this).css("background-color"));
        // these events DO NOT require the mouse button to be down
        if (mode === 4) {                                       // snake mode
            squareColor = $(this).css("background-color");
            $(this).css("background-color", rgb);
            $(this).stop(true, true).fadeTo(1000, 0.0, function() {
                $(this).css({"background-color": rgb, "opacity": "1"});
            });
            $instructions.hide();
        }
        // these events DO require the mouse button to be down
        else {
            if (keyIsDown) {
                $instructions.hide();                           // default mode
                if (mode === 1) {
                    $(this).css("background-color", "black");
                }
                else if (mode === 2) {                          // random color mode
                    var color = randomColor();
                    $(this).css("background-color", color);
                }
                else if (mode === 3) {                          // darken mode
                    for(var i = 0; i < rgb.length; i++){
                        rgb[i] = Math.max(0, rgb[i] - 10);
                    }
                    var newColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                    $(this).css("background-color", newColor);
                }
            }
            else {
                $instructions.show();
            }
        }
    });
}

// get the new size, input by the user by clicking the "Change Board Size" button
var changeSize = function() {
    $(".size-button").on("click", function(){
        // prompt the user for a new size
        var newSize = prompt("Please enter desired squares per row for the sketch board.\nMin: 1 | Max: 64\nLeave blank for default size.");
        // if the prompt is left blank then resize to default size
        if (newSize === null) {
            return;
        }
        // if prompt is left blank the use default size
        else if (newSize === ""){
            sketchpadWidth = defaultSketchpadWidth;
            $sketchpad.empty();
            drawSketchpad(sketchpadWidth);
        }
        // make sure the user entered a valid number
        else if (isNaN(newSize) || newSize < 1 || newSize > 64) {
            alert('"' + newSize + '" is not a valid NUMBER, try again.');
        }
        // otherwise, change the size of the sketchpad
        else {
            sketchpadWidth = newSize;
            $sketchpad.empty();
            drawSketchpad(sketchpadWidth);
        };
    });
}

var colorPicker = function(){
    $("#colorpicker").spectrum({
        color: "#000",
        showInput: true,
        className: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        maxPaletteSize: 10,
        preferredFormat: "hex",
        move: function (color) {
            
        },
        show: function () {
        
        },
        beforeShow: function () {
        
        },
        hide: function () {
        
        },
        change: function() {
            
        },
        palette: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
            "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
            "rgb(0, 255, 255)"]
        ]
    });
}

var buttonListeners = function(){
    $(".default").on("click", function() {
        drawModeID = 1; 
        drawMode(drawModeID, $(this));
    });
    $(".random").on("click", function() {
        drawModeID = 2;
        drawMode(drawModeID, $(this));
    });
    $(".increment").on("click", function() {
        drawModeID = 3;
        drawMode(drawModeID, $(this));
    });
    $(".trail").on("click", function() {
        drawModeID = 4;
        drawMode(drawModeID, $(this));
    });
    $(".clear-button").on("click", function(){
        clearBoard();
    });
}

var globalListeners = function(){
    // necessary to make the bootstrap buttons remove the active state class immediately after clicking them
    $(".btn").on("mouseup", function(){
        $(this).blur();
    });

    // makes sure these divs and buttons are initially hidden
    $(".hidden-initially").hide();

    // tells us whether the left mouse is being held down
    $sketchpad.on("click", function(){
        $(this).on("mousedown", function(event){
            if (event.which == 1) {
                keyIsDown = true;
                $(this).css('cursor','url(./img/paintbrush.png),auto');
            }
        }).on("mouseup", function(){
            keyIsDown = false;
            $(this).css('cursor','pointer');
        });    

    });
}

var listeners = function() {
    globalListeners();
    buttonListeners();
    changeSize();
    firstDrawMode();
    colorPicker();
}

$(document).ready(function(){    
    listeners();
})