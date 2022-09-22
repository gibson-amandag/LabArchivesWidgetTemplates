my_widget_script =
{
    // Variables
    _numEntries: 0,
    _numExits: 0,
    _duration: NaN,
    _fileName: "",
    _startState: "",
    _vid: document.getElementById("videoPlayer"),
    _timeOffNest: 0,
    _timeOnNest: 0,
    _stampTimes: [],
    _stampStates: [],
    _allDurations: [],
    _entryStamps: [],
    _exitStamps: [],
    _entryDurs: [],
    _exitDurs: [],
    _percOffNest: 0,
    _percOnNest: 0,

    init: function (mode, json_data) {
        // Google charts
        this.include(
            "https://www.gstatic.com/charts/loader.js",
            "",
            "",
            () =>{
                $(document).ready(
                    ()=>{
                        // jQuery for bootstrap
                        this.include(
                            "https://code.jquery.com/jquery-3.5.1.min.js",
                            "sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=",
                            "anonymous",
                            ()=>{
                                $(document).ready(
                                    ()=>{
                                        // console.log("After load", $.fn.jquery);
                                        
                                        // Load bootstrap
                                        this.include(
                                            "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js",
                                            "sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl",
                                            "anonymous",
                                            ()=>{
                                                $(document).ready(
                                                    ()=>{
                                                        // Load Luxon
                                                        this.include(
                                                            "https://cdn.jsdelivr.net/npm/luxon@1.26.0/build/global/luxon.min.js",
                                                            "sha256-4sbTzmCCW9LGrIh5OsN8V5Pfdad1F1MwhLAOyXKnsE0=",
                                                            "anonymous",
                                                            ()=>{
                                                                $(document).ready(
                                                                    ()=>{
                                                                        // Load bootbox - need the bootstrap JS to be here first, with appropriate jQuery
                                                                        this.include(
                                                                            "https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.5.2/bootbox.min.js",
                                                                            "sha512-RdSPYh1WA6BF0RhpisYJVYkOyTzK4HwofJ3Q7ivt/jkpW6Vc8AurL1R+4AUcvn9IwEKAPm/fk7qFZW3OuiUDeg==",
                                                                            "anonymous",
                                                                            // referrerpolicy="no-referrer"
                                                                            ()=>{
                                                                                $(document).ready(
                                                                                    ()=>{
                                                                                        $jq351 = jQuery.noConflict(true);
                                                                                        // console.log("After no conflict", $.fn.jquery);
                                                                                        // console.log("bootstrap jquery", $jq351.fn.jquery);
                                                                                        this.myInit(mode, json_data);
                                                                                    }
                                                                                )
                                                                            }
                                                                        );
                                                                    }
                                                                )
                                                            }
                                                        );
                                                    }
                                                )
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    },

    //https://stackoverflow.com/questions/8139794/load-jquery-in-another-js-file
    include: function(src, integrity, crossorigin, onload) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        if(integrity){
            script.setAttribute("integrity", integrity);
        }
        if(crossorigin){
            script.setAttribute("crossorigin", crossorigin);
        }
        script.src = src;
        script.type = 'text/javascript';
        script.onload = script.onreadystatechange = function() {
            if (script.readyState) {
                if (script.readyState === 'complete' || script.readyState === 'loaded') {
                    script.onreadystatechange = null;                                                  
                    onload();
                }
            } 
            else {
                onload();          
            }
        };
        head.appendChild(script);
    },

    myInit: function (mode, json_data) {
        //uncomment to inspect and view code while developing
        //debugger;

        //Get the parsed JSON data
        var parsedJson = this.parseInitJson(json_data);

        //Uncomment to print parsedJson to consol
        //console.log("init", parsedJson);

        //check parsedJson for info not contained in form inputs and reinitialize
        this.initDynamicContent(parsedJson);

        //resize the content box when the window size changes
        window.onresize = this.resize;
        window.onresize = this.GoogleChartTimeLine;

        //Define behavior when buttons are clicked or checkboxes/selctions change
        this.addEventListeners();

        // Initialize the form with the stored widgetData using the parent_class.init() function
        this.parent_class.init(mode, () => JSON.stringify(parsedJson.widgetData));

        // Add * and # to mark required field indicators
        this.addRequiredFieldIndicators();

        // Set up the form based on previously entered form input
        this.setUpInitialState();

        //adjust form design and buttons based on mode
        this.adjustForMode(mode);

        this.GoogleChartTimeLine();
    },
    
    to_json: function () {
        //Acquire input data from the form using the parent_class.to_json() function
        var widgetJsonString = this.parent_class.to_json();

        //Get information about any dynamic content that may have been created
        var dynamicContent = this.getDynamicContent();

        // Add widgetData and any additional dynamic content to an output object
        // Will be accessed within the init and from_json methods
        var output = { 
            widgetData: JSON.parse(widgetJsonString),
            fileName: dynamicContent.fileName,
            startState: dynamicContent.startState,
            duration: dynamicContent.duration,
            numExits: dynamicContent.numExits,
            numEntries: dynamicContent.numEntries,
            stampTimes: dynamicContent.stampTimes,
            stampStates: dynamicContent.stampStates,
            allDurations: dynamicContent.allDurations
        };

        //uncomment to check stringified output
        //console.log("to JSON", JSON.stringify(output));

        // return stringified output
        return JSON.stringify(output);
    },

    from_json: function (json_data) {
        //populates the form with json_data

        // all data in string format within json_data is parsed into an object parsedJson
        var parsedJson = JSON.parse(json_data);

        //use parsedJson to get widgetData and turn into a string
        //parent class uses the widget data to fill in inputs
        this.parent_class.from_json(JSON.stringify(parsedJson.widgetData));
    },

    test_data: function () {
        // ORIGINAL LABARCHIVES RETURN FOR TEST DATA
        //return this.parent_class.test_data();

        // CUSTOM TEST DATA

        //store the outcome of the the test data within the testData variable
        var testData = JSON.parse(this.parent_class.test_data());

        var stampStates = ["entry", "exit", "entry", "exit", "entry", "exit", "entry"];
        var stampTimes = [0, 1, 3, 6, 10, 15, 21];
        var allDurations = [1, 2, 3, 4, 5, 6, 979];

        //If no additional dynamic content 
        var output = {
            fileName: "test", 
            widgetData: testData,
            startState: "on",
            duration: 1000,
            numEntries: 3,
            numExits: 3,
            stampStates: stampStates,
            stampTimes: stampTimes,
            allDurations: allDurations
        };

        //Add additional content to match the objects in to_json
        //var output = { widgetData: testData, addedRows: 2 }; //When in development, initialize with 2 addedRows

        //return the stringified output for use by the init function
        return JSON.stringify(output);
    },

    //source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
    is_valid: function (b_suppress_message) {
        //ORIGINAL LABARCHIVES IS_VALID FUNCTION
        //return this.parent_class.is_valid(b_suppress_message);

        //CUSTOM FUNCTION TO CHECK REQUIRED ITEMS
        var fail = false; //begin with a fail variable that is false
        var fail_log = ''; //begin with an empty fail log
        var name; //create a name variable

        //search the_form for all elements that are of type select, textarea, or input
        $('#the_form').find('select, textarea, input').each(function () {
            if (!$(this).prop('required')) { //if this element does not have a required attribute
                //don't change anything (fail remains false)
            } else { //if there is a required attribute
                if (!$(this).val()) { //if there is not a value for this input
                    fail = true; //change fail to true
                    name = $(this).attr('id'); //replace the name variable with the name attribute of this element
                    fail_log += name + " is required \n"; //add to the fail log that this name is required
                }

            }
        });

        $("input[type='date']").each(function () {
            var date = $(this).val();
            if(date){
                var validDate = my_widget_script.isValidDate(date);
                if(!validDate){
                    fail = true;
                    fail_log += "Please enter valid date in form 'YYYY-MM-DD'";
                }
            }
        });

        $("input[type='time']").each(function () {
            var time = $(this).val();
            if(time){
                var validtime = my_widget_script.isValidTime(time);
                if(!validtime){
                    fail = true;
                    fail_log += "Please enter valid time in form 'hh:mm' - 24 hr time";
                }
            }
        });

        if (fail) { //if fail is true (meaning a required element didn't have a value)
            return alert(fail_log); //return the fail log as an alert
        } else {
            var noErrors = [];
            return noErrors;
        } //otherwise, return empty array
    },

    is_edited: function () {
        //should return true if the form has been edited since it was loaded or since reset_edited was called
        return this.parent_class.is_edited();
    },

    reset_edited: function () {
        //typically called have a save
        //TO DO write code specific to your form
        return this.parent_class.reset_edited();
    },

    // ********************** CUSTOM METHODS USED BY INIT METHOD **********************
    parseInitJson: function (json_data) {
        var jsonString;
        //check if string or function because preview test is function and page is string
        if (typeof json_data === "string") {
            jsonString = json_data;
        } else {
            jsonString = json_data();
        }
        //Take input string into js object to be able to use elsewhere
        var parsedJson = JSON.parse(jsonString);
        return (parsedJson);
    },

    initDynamicContent: function (parsedJson) {
        // Fill filePath in widget
        $(".filePath").text(parsedJson.fileName);
        // Update fileName variable
        my_widget_script._fileName = parsedJson.fileName;
        $(".clearOnLoad").text("");

        my_widget_script._numExits = parsedJson.numExits;
        my_widget_script._numEntries = parsedJson.numEntries;

        // Update duration
        my_widget_script._duration = parsedJson.duration;
        $("#videoDur").val(my_widget_script._duration);

        var startState = parsedJson.startState;
        // Update global startState variable
        my_widget_script._startState = parsedJson.startState;
        my_widget_script.changeToState(my_widget_script._startState);
        // my_widget_script.resetStamps(startState);

        // Update global arrays
        if(parsedJson.stampStates) {
            my_widget_script._stampStates = parsedJson.stampStates;
        }
        if(parsedJson.stampTimes){
            my_widget_script._stampTimes = parsedJson.stampTimes;
        }
        if(parsedJson.allDurations){
            my_widget_script._allDurations = parsedJson.allDurations;
        }

        for(i = 0; i < my_widget_script._stampStates.length; i++ ){
            var movement = "", time = NaN, duration = NaN;
            movement = my_widget_script._stampStates[i];
            time = my_widget_script._stampTimes[i];
            duration = my_widget_script._allDurations[i];
            var $stampsDiv = $(".stampsDiv");

            if(movement == "exit") {
                var newState = "OFF";
                var stateForButton = "off";
            }else if(movement == "entry"){
                var newState = "ON";
                var stateForButton = "on";
            } else {
                var newState = "";
                var stateForButton = "";
            }

            my_widget_script.makeStampRow($stampsDiv, movement, newState, time, duration);

            if(i == my_widget_script._stampStates.length - 1){
                my_widget_script.changeToState(stateForButton);
            }
        }

        my_widget_script.calcValues();
    },

    adjustForMode: function (mode) {
        if (mode !== "edit" && mode !== "edit_dev") {
            //disable when not editing
            $(".disableOnView").prop("disabled", true);
            $(".hideView").hide();
            $(".bookmarkLink").parent().addClass("noPlay");
        } else {
            $(".hideEdit").hide();
        }
    },

    updateDurations: function () {
        my_widget_script.getDuration();
        var lastDuration = my_widget_script._duration - my_widget_script._stampTimes[my_widget_script._stampTimes.length - 1];
        my_widget_script._allDurations[my_widget_script._allDurations.length - 1] = lastDuration;
        $(".stampRow").last().find(".duration").text(lastDuration.toFixed(2));
        my_widget_script.GoogleChartTimeLine();
        my_widget_script.resize();
    },

    uploadVideoFile: function(){
        // Get selected file
        var file = document.getElementById('myfile').files[0];
        //console.log(file);

        var proceed = false;
        if( ! my_widget_script._fileName ){ // if no current file name
            proceed = true;
        } else if( file.name == my_widget_script._fileName) { // if matches current file name
            proceed = true;
        } else { // confirm if doesn't match
            proceed = confirm("This is a different file than was previously analyzed in this widget. Do you want to proceed?");
        }

        if( proceed ){
            $(".filePath").text(file.name);
            my_widget_script._fileName = file.name;
            
            var fileURL = URL.createObjectURL(file);
            // Add file URL to source for video player
            my_widget_script._vid.src = fileURL;

            // var vid = document.getElementById("videoPlayer");
            my_widget_script._vid.playbackRate = $("#changeSpeed").val();

            $("#addStampButton").removeAttr("disabled");
            $("#removeStampButton").removeAttr("disabled");
        }

        my_widget_script.resize();
    },

    addEventListeners: function () {
        $("#myfile").on("input", function () {
            this.uploadVideoFile();
        });

        $("#videoPlayer").on("durationchange", function () {
            my_widget_script.updateDurations();
        });

        $("#getDur").on("input", function () {
            my_widget_script.updateDurations();
        });

        $("#videoDur").on("input", function () {
            my_widget_script.updateDurations();
        });

        $("#changeSpeed").on("input", function () {
            my_widget_script._vid.playbackRate = $(this).val();
        });

        $("#startState").on("input", function () {
            if(! my_widget_script._numEntries > 0 &&  ! my_widget_script._numExits > 0){
                var proceed = true;
            } else {
                var proceed = confirm("Changing this will remove all stamps. Do you wish to proceed?");
            }
            if(proceed){
                var startState = $(this).val();
                my_widget_script._startState = $(this).val();
                my_widget_script.resetStamps(startState);                
            }
        });

        $("#addStampButton").on("click", function () {
            var currentState = $(this).data("state");
            if(currentState){
                my_widget_script.addStampFuncs(currentState);
            } else {
                alert("Enter the starting state of the dam");
            }
        }).on("keydown", (e)=>{
            var key = e.key;
            var vidSpeed = 5;
            var changeSpeed = false;
            switch (key) {
                case "q":
                    vidSpeed = 3;
                    changeSpeed = true;
                    break;
                case "w":
                    vidSpeed = 5;
                    changeSpeed = true;
                    break;
                case "a":
                    vidSpeed = 10;
                    changeSpeed = true;
                    break;
                case "s":
                    vidSpeed = 16; // max
                    changeSpeed = true;
                    break;
                case "z":
                    var timeInSec = parseFloat(my_widget_script.getTimeStamp());
                    timeInSec = timeInSec - 30;
                    this._vid.currentTime = timeInSec;
                    $("#addStampButton").select();
                    break;
                case "c":
                    var timeInSec = parseFloat(my_widget_script.getTimeStamp());
                    timeInSec = timeInSec + 30;
                    this._vid.currentTime = timeInSec;
                    break;
                case "x":
                    if(this._vid.paused){
                        this._vid.play();
                    } else {
                        this._vid.pause();
                    }
                    $("#addStampButton").select();
                    break;
                default:
                    break;
            }
            if(changeSpeed){
                $("#changeSpeed").val(vidSpeed);
                this._vid.playbackRate = vidSpeed;
                $("#addStampButton").select();
            }
        });

        $("#removeStampButton").on("click", function () {
            var currentState = $("#addStampButton").data("state");
            my_widget_script.removeStampFuncs(currentState);
        });

        $("#clearStamps").on("click", function () {
            var proceed = confirm("Are you sure that you want to remove all time stamps?");
            if (proceed) {
                my_widget_script.resetStamps(my_widget_script._startState);
            }
        });

        $('#copyDursButton').on("click", function () {
            var $errorMsg = $("#errorMsg");
            var $divForCopy = $("#forCopy");
            my_widget_script.copyDurationsFuncs($errorMsg, $divForCopy);
        });

        $('#copyTimesButton').on("click", function () {
            var $errorMsg = $("#errorMsg");
            var $divForCopy = $("#forCopy");
            my_widget_script.copyTimeStampsFuncs($errorMsg, $divForCopy);
        });

        //when the toCSV button is clicked, run the exportInfoToCSV function if data is valid
        $('#toCSV').on("click", (e)=> {
            // var fileName = "damVideoMonitor";
            var fileName = $("#damID").val() + "_P" + $("#pnd").val() + "_ZT" + $("#zt").val();
            // var tableID = "outTable";
            var $errorMsg = $("#errorMsg"); 
            
            this.toCSVFuncs(fileName, $errorMsg);
        });

        //When the copy button is clicked, run the copyTable function
        $("#copyDataButton").on("click", function () {
            var $copyHead = $("#copyHead");
            var $tableToCopy = $("#outTable");
            var $tableDiv = $(".outTableDiv");
            var $errorMsg = $("#errorMsg");
            var $divForCopy = $("#forCopy");
            
            my_widget_script.copyDataFuncs($copyHead, $tableToCopy, $tableDiv, $errorMsg, $divForCopy)
        });

        // Output table calculations
        $(".simpleCalc").on("input", function () {
            var elementID = this.id;
            var calcID = "." + elementID + "_calc";
            my_widget_script.watchValue($(this), $(calcID));
        });

        //Jump to place in video and select add stamp button if there's a video file
        $(document).on('click', ".stampMin:not(.noPlay) a", function() {
            var vid = document.getElementById("videoPlayer");
            if(vid.src){
                vid.currentTime = $(this).attr('rel');
                vid.play();
                $("#videoPlayer").focus();
                $("#addStampButton").select();
            } else {
                alert("Select a Video File");
            }
        });
    },

    changeToState: function (state) {
        if(state == "off"){
            $("#addStampButton").val("Dam Enters Nest").data("state", "off");
        } else if(state == "on") {
            $("#addStampButton").val("Dam Exists Nest").data("state", "on");
        } else {
            $("#addStampButton").val("[Enter Start State]").data("state", "");
        }
    },

    toggleState: function (currentState) {
        if (currentState == "off") {
            my_widget_script.changeToState("on");
        } else if (currentState == "on") {
            my_widget_script.changeToState("off");
        }
    },

    addStampFuncs: function (currentState){
        if(my_widget_script._vid.src){
            my_widget_script.getDuration();
            var $stampsDiv = $(".stampsDiv");
            var timeInSec = parseFloat(my_widget_script.getTimeStamp());

            if(timeInSec < my_widget_script._duration){         
                var $previousRow = $stampsDiv.find(".stampRow").last();

                // Get previous stamp
                var previousTime = my_widget_script._stampTimes[my_widget_script._stampTimes.length - 1];

                if(timeInSec > previousTime){ // if after previous stamp
                    // Get the time between this stamp and previous stamp
                    var lastDuration = timeInSec - previousTime;
                    // Replace duration in previous row
                    $previousRow.find(".duration").text(lastDuration.toFixed(2));
                    // Replace duration in durations array
                    my_widget_script._allDurations[my_widget_script._allDurations.length - 1] = lastDuration;

                    // Add time to all stamps array
                    my_widget_script._stampTimes[my_widget_script._stampTimes.length] = timeInSec;

                    // Get the duration from this time to the end of the recording
                    var thisDuration = my_widget_script._duration - timeInSec;
                    // Add this duration to the all durations array
                    my_widget_script._allDurations[my_widget_script._allDurations.length] = thisDuration

                    if (currentState == "on"){
                        var movementType = "exit";
                        var newState = "OFF";
                    } else if(currentState == "off"){
                        var movementType = "entry";
                        var newState = "ON";
                    }

                    my_widget_script._stampStates[my_widget_script._stampStates.length] = movementType;

                    my_widget_script.makeStampRow($stampsDiv, movementType, newState, timeInSec, thisDuration);

                    my_widget_script.addOneToVar(movementType);
                    my_widget_script.calcValues();
                    my_widget_script.toggleState(currentState);

                    // console.log(my_widget_script._stampTimes, my_widget_script._stampStates, my_widget_script._allDurations);
                } else {
                    my_widget_script._vid.pause();
                    alert("Must be after previous stamp");
                }
            }
            
            my_widget_script.resize();
        }
    },

    makeStampRow: function ($div, className, newState, timeInSec, thisDuration){
        var timeStamp = my_widget_script.getTimeFromSec(timeInSec);

        $div.append(
            $("<div/>", {
                "class": "row stampRow " + className
            }).append(
                $("<div/>", {
                    "class": "col state " + className
                }).append(newState)
            ).append(
                $("<div/>", {
                    "class": "col stamp " + className,
                    "data-movement": className
                }).append(timeInSec.toFixed(2))
            ).append(
                $("<div/>", {
                    "class": "col stampMin " + className
                }).append(
                    "<a href='javascript:;' rel='" + timeInSec + "' class='bookmarkLink'>" + timeStamp + "</a>"
                )
            ).append(
                $("<div/>", {
                    "class": "col duration " + className
                }).append(thisDuration.toFixed(2))
            )
        );
    },

    removeStampFuncs: function (currentState) {
        if(my_widget_script._vid.src){
            if (currentState == "off"){
                var className = "exit";
                var currentNum = my_widget_script._numExits;
            } else if(currentState == "on"){
                var className = "entry";
                var currentNum = my_widget_script._numEntries;
            }

            if(currentNum > 0){
                my_widget_script.getDuration();
                $(".stampRow").last().remove();

                // Remove the last values from the arrays
                my_widget_script._stampTimes.pop();
                my_widget_script._stampStates.pop();
                my_widget_script._allDurations.pop();

                // Replace the last duration with time to end from last event
                var lastDuration = my_widget_script._duration - my_widget_script._stampTimes[my_widget_script._stampTimes.length - 1];
                my_widget_script._allDurations[my_widget_script._allDurations.length - 1] = lastDuration
                $(".stampRow").last().find(".duration").text(lastDuration.toFixed(2));

                // console.log(
                //     my_widget_script._stampTimes,
                //     my_widget_script._stampStates,
                //     my_widget_script._allDurations
                // );

                my_widget_script.toggleState(currentState);
                my_widget_script.removeOneFromVar(className);
                my_widget_script.calcValues();
                my_widget_script._vid.pause();
            } else {
                alert("No stamps to remove");
            }

            my_widget_script.resize();
        }
    },

    resetStamps: function (startState) {
        my_widget_script.changeToState(startState);

        // Reset parameters
        my_widget_script._numEntries = 0;
        my_widget_script._numExits = 0;
        my_widget_script._stampTimes = [];
        my_widget_script._stampStates = [];
        my_widget_script._allDurations = [];

        $(".stampRow").remove();

        if(startState == "off") {
            var startState = "exit";
            var newState = "OFF";
        } else if(startState == "on"){
            var startState = "entry";
            var newState = "ON";
        }

        my_widget_script.getDuration();
        my_widget_script.makeStampRow($(".stampsDiv"), startState, newState, 0, my_widget_script._duration);

        my_widget_script._stampTimes = [0];
        my_widget_script._stampStates = [startState];
        my_widget_script._allDurations = [my_widget_script._duration];

        my_widget_script.calcValues();
        my_widget_script.resize();
    },

    getDuration: function () {
        if($("#getDur").is(":checked") && my_widget_script._vid.src) {
                var duration = my_widget_script._vid.duration;
        } else {
            var duration = $("#videoDur").val();
            if (duration) {
                duration = parseFloat(duration);
            } else {
                duration = 3600;
            }
        }

        $("#videoDur").val(duration);
        my_widget_script._duration = duration;
        $(".videoDur_calc").text(duration);
    },

    getTimeStamp: function () {
        var timeStamp = "";
        if(my_widget_script._vid.src){
            var timeStamp = my_widget_script._vid.currentTime;
        }
        return (timeStamp)
    },

    getExistingText: function (txtarea) {
        var existingText = txtarea.value;
        if (existingText){
            existingText = existingText + "\n";
        }
        return (existingText)
    },

    addOneToVar: function (exitOrEntry) {
        if(exitOrEntry == "entry"){
            my_widget_script._numEntries++;
            // console.log(my_widget_script._numEntries);
        } else if(exitOrEntry == "exit"){
            my_widget_script._numExits++;
        }
    },

    removeOneFromVar: function (exitOrEntry) {
        if(exitOrEntry == "entry"){
            my_widget_script._numEntries--;
        } else if(exitOrEntry == "exit"){
            my_widget_script._numExits--;
        }
    },

    addOneToCounter: function ($counter) {
        var val = $counter.val();
        if (val){
            var count = parseInt(val);
        } else {
            var count = 0;
        }

        count = count + 1;
        $counter.val(count);
    },

    removeOneFromCounter: function ($counter) {
        var val = $counter.val();
        if(val > 0) {
            var count = parseInt(val);
            count = count - 1;
        } else {
            var count = 0;
        }
        $counter.val(count);
    },

    // return time as hh:mm:ss from a certain number of seconds
    getTimeFromSec: function (timeInSec) {
        var asDate = new Date();
        asDate.setHours(0, 0, timeInSec, 0);
        //console.log(asDate);
        var hours = ("0" + asDate.getHours()).slice(-2);
        var mins = ("0" + asDate.getMinutes()).slice(-2);
        var secs = ("0" + asDate.getSeconds()).slice(-2);
        var time = hours + ":" + mins + ":" + secs
        return(time)
    },

    getHoursMin: function (timeString) {
        timeString = timeString.split(":");
        var hours = parseInt(timeString[0], 10), mins = parseInt(timeString[1], 10);
        return( 
            split = {
                hours: hours,
                mins: mins
            }
        )
    },

    addRequiredFieldIndicators: function () {
        $('.needForTableLab').each(function () { //find element with class "needForFormLab"
            //alert($(this).val());
            $(this).html("<span style='color:blue'>#</span>" + $(this).html()); //add # before
        });

        $('.requiredLab').each(function () { //find element with class "requiredLab"
            //alert($(this).val());
            $(this).html("<span style='color:red'>*</span>" + $(this).html()); //add # before
        });
    },

    adjustTextareaHeight: function (txtarea) {
        txtarea.style.height = "auto";
        txtarea.style.height = (txtarea.scrollHeight) + 'px';
        my_widget_script.resize();
    },
    
    isValidTime: function (timeString) {
        var regEx = "^(((([0-1][0-9])|(2[0-3])):[0-5][0-9]))$";
        if(!timeString.match(regEx)){
            return false;
        } else {
            return true;
        }
    },

    isTimeSupported: function () {
        // Check if browser has support for input type=time
        var input = document.createElement('input');
        input.setAttribute('type', 'time');
        var supported = true;
        if(input.type !== "time"){
            supported = false;
        }
        my_widget_script.timeSupported = supported;
        return (supported);
    },

    timeSupported: true,

    checkTimeFormat: function ($timeInput) {
        if(!my_widget_script.timeSupported){ // if not supported
            $timeInput.next(".timeWarning").remove();
            var time = $timeInput.val();
            var isValid = my_widget_script.isValidTime(time);
            if(!isValid){
                $timeInput.after('<div class="text-danger timeWarning">Enter time as "hh:mm" in 24-hr format</div>');
            }
            my_widget_script.resize();
        }
    },

    isValidDate: function (dateString) {
        // https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery/18759013
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        var d = new Date(dateString);
        var dNum = d.getTime();
        if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(0,10) === dateString;
    },

    isDateSupported: function () {
        // https://gomakethings.com/how-to-check-if-a-browser-supports-native-input-date-pickers/
        // Check if browser has support for input type=date
        var input = document.createElement('input');
        // var value = 'a';
        input.setAttribute('type', 'date');
        var supported = true;
        if(input.type !== "date"){
            supported = false;
        }
        my_widget_script.dateSupported = supported;
        return (supported);
    },

    dateSupported: true,

    checkDateFormat: function ($dateInput) {
        if(!my_widget_script.dateSupported){ // if not supported
            $dateInput.next(".dateWarning").remove();
            var date = $dateInput.val();
            var isValid = my_widget_script.isValidDate(date);
            if(!isValid){
                $dateInput.after('<div class="text-danger dateWarning">Enter date as "YYYY-MM-DD"</div>');
            }
            $dateInput.datepicker({dateFormat: "yy-mm-dd"})
            my_widget_script.resize();
        }
    },

    setUpInitialState: function () {
        my_widget_script.isDateSupported();
        my_widget_script.isTimeSupported();
        
        $("input[type='date']").prop("placeholder", "YYYY-MM-DD").on("change", function () {
            my_widget_script.checkDateFormat($(this));
        }).each(function () {
            my_widget_script.checkDateFormat($(this));
        });
        
        $("input[type='time']").prop("placeholder", "hh:mm").on("change", function () {
            my_widget_script.checkTimeFormat($(this));
        }).each(function () {
            my_widget_script.checkTimeFormat($(this));
        });

        //Add classes to add bootstrap styles for left column in form
        $('.myLeftCol').addClass("col-12 col-sm-6 col-md-4 col-lg-4 text-left text-sm-right");

        $('textarea.autoAdjust').each(function () {
            this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
        }).on('input', function () {
            my_widget_script.adjustTextareaHeight(this);
        });
        
        $(".simpleCalc").each(function () {
            var elementID = this.id;
            var calcID = "." + elementID + "_calc";
            my_widget_script.watchValue($(this), $(calcID));
        });

        my_widget_script.calcValues();

        my_widget_script.resize();

        $("#saveChart").on("click", ()=>{
            this.downloadTimeline();
        })
    },

    resize: function () {
        //resize the container
        my_widget_script.parent_class.resize_container();
    },
    // ********************** END CUSTOM INIT METHODS **********************


    // ********************** START CUSTOM TO_JSON METHODS **********************
    getDynamicContent: function () {
        var dynamicContent = {
            fileName: my_widget_script._fileName,
            startState: my_widget_script._startState,
            duration: my_widget_script._duration,
            numExits: my_widget_script._numExits,
            numEntries: my_widget_script._numEntries,
            stampTimes: my_widget_script._stampTimes,
            stampStates: my_widget_script._stampStates,
            allDurations: my_widget_script._allDurations
        };
        return dynamicContent;
    },
    // ********************** END CUSTOM TO_JSON METHODS **********************

    //source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
    data_valid_form: function () {
        var valid = true; //begin with a valid value of true
        //var fail_log = ''; //begin with an empty fail log
        //var name; //create a name variable

        //search the_form for all elements that are of class "needForForm"
        $('.needForTable').each(function () {
            if (!$(this).val()) { //if there is not a value for this input
                valid = false; //change valid to false
                //name = $(this).attr('id'); //replace the name variable with the id attribute of this element
                //fail_log += name + " is required \n"; //add to the fail log that this name is required
            }
        });

        if (!valid) {
            $("#errorMsg").html("<span style='color:red; font-size:36px;'>Please fill out all elements marked by a</span><span style='color:blue; font-size:36px;'> blue #</span>");
        } else {
            $("#errorMsg").html("");
        }

        return valid;
    },

    watchValue: function ($elToWatch, $elToUpdate) {
        var value = $elToWatch.val();
        // console.log($elToWatch, value);
        $elToUpdate.text(value);
    },

    calcValues: function () {
        my_widget_script.getDuration();

        $(".numEntries_calc").text(my_widget_script._numEntries);
        $(".numExits_calc").text(my_widget_script._numExits);

        my_widget_script._entryStamps = [];
        my_widget_script._entryDurs = [];
        my_widget_script._exitStamps = [];
        my_widget_script._exitDurs = [];
        my_widget_script._timeOnNest = 0;
        my_widget_script._timeOffNest = 0;
        my_widget_script._avgDurOnNest = 0;
        my_widget_script._avgDurOffNest = 0;

        // console.log(
        //     my_widget_script._stampTimes,
        //     my_widget_script._stampStates,
        //     my_widget_script._allDurations
        // );

        for(i = 0; i < my_widget_script._stampStates.length; i++ ){
            if(my_widget_script._stampStates[i] == "exit") {
                my_widget_script._exitStamps[my_widget_script._exitStamps.length] = my_widget_script._stampTimes[i];
                my_widget_script._exitDurs[my_widget_script._exitDurs.length] = my_widget_script._allDurations[i];
            }else if(my_widget_script._stampStates[i] == "entry"){
                my_widget_script._entryStamps[my_widget_script._entryStamps.length] = my_widget_script._stampTimes[i];
                my_widget_script._entryDurs[my_widget_script._entryDurs.length] = my_widget_script._allDurations[i];
            }
        }

        // Sum of off nest durations
        my_widget_script._timeOffNest = my_widget_script._exitDurs.reduce(function(a, b){
            return a + b;
        }, 0);

        // Sum of on nest durations
        my_widget_script._timeOnNest = my_widget_script._entryDurs.reduce(function(a, b){
            return a + b;
        }, 0);

        $(".timeOffNest_calc").text(my_widget_script._timeOffNest.toFixed(2));
        $(".timeOnNest_calc").text(my_widget_script._timeOnNest.toFixed(2));

        // Avg of off nest durations
        my_widget_script._avgDurOffNest = my_widget_script._timeOffNest / my_widget_script._exitDurs.length;
        
        // Avg of on nest durations
        my_widget_script._avgDurOnNest = my_widget_script._timeOnNest / my_widget_script._entryDurs.length;

        $(".avgDurOffNest_calc").text(my_widget_script._avgDurOffNest.toFixed(2));
        $(".avgDurOnNest_calc").text(my_widget_script._avgDurOnNest.toFixed(2));      
        
        my_widget_script._percOffNest = (my_widget_script._timeOffNest / my_widget_script._duration) * 100;
        my_widget_script._percOnNest = (my_widget_script._timeOnNest / my_widget_script._duration) * 100;
        
        $(".percOffNest_calc").text(my_widget_script._percOffNest.toFixed(2));
        $(".percOnNest_calc").text(my_widget_script._percOnNest.toFixed(2));
        
        // console.log(
        //     my_widget_script._exitStamps,
        //     my_widget_script._exitDurs,
        //     my_widget_script._entryStamps,
        //     my_widget_script._entryDurs,
        //     my_widget_script._timeOffNest,
        //     my_widget_script._timeOnNest,
        //     my_widget_script._percOffNest,
        //     my_widget_script._percOnNest,
        // );

        $("#outTable tr").each(function () { //for each row
            $("td", this).each(function () { //for each cell
                var value = $(this).text(); //get the value of the text
                if (value === "" || value === "NaN") { //if blank or NaN
                    $(this).text("NA"); //make NA
                }
            })
        });

        my_widget_script.GoogleChartTimeLine();

        //resize the tableDiv
        my_widget_script.resize();

    },

    downloadCSV: function (csv, filename) {
        var csvFile;
        var downloadLink;

        // CSV file
        csvFile = new Blob([csv], { type: "text/csv" });

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = filename;

        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide download link
        downloadLink.style.display = "none";

        // Add the link to DOM
        document.body.appendChild(downloadLink);

        // Click download link
        downloadLink.click();
    },

    zip: function(...args){
        var len = 0;
        var array
        for(array of args){
            var arrLen = array.length;
            // console.log("array length", arrLen);
            if(arrLen>len){
                len = arrLen
            }
        }
        var numArrays = args.length;

        var arr = new Array(len);

        for(var i = 0; i < len; i += 1){
            arr[i] = [];
            for(array of args){
                arr[i].push(array[i]);
            }
        }
        // console.log("array", arr);
        return arr;
    },
    
    exportInfoToCSV: function (filename) {
        var csv = [];
        var columnJoin = ","
        // var columnJoin = "\t"

        var exitStamps = ["OffTimes"].concat(this._exitStamps);
        var entryStamps = ["OnTimes"].concat(this._entryStamps);
        var exitDurs = ["OffDurations"].concat(this._exitDurs);
        var entryDurs = ["OnDurations"].concat(this._entryDurs);
        var locationStates = ["states"].concat(this._stampStates);
        var changeTimes = ["changeTimes"].concat(this._stampTimes);


        csv = this.zip(exitStamps, entryStamps, exitDurs, entryDurs, changeTimes, locationStates)

        // console.log(csv);
        for(var row = 0; row < csv.length; row++){
            csv[row] = csv[row].join(columnJoin); // add the separator between columns
        }

        // Download CSV file
        this.downloadCSV(csv.join("\n"), filename);
    },
    exportInfoToCSV_v2: function (filename) {
        var csv = [];

        var exitStamps = my_widget_script._exitStamps;
        var entryStamps = my_widget_script._entryStamps;
        var exitDurs = my_widget_script._exitDurs;
        var entryDurs = my_widget_script._entryDurs;

        var row = [];
        // var prefix = $("#damID").val() + "_P" + $("#pnd").val() + "_ZT" + $("#zt").val() + "_";

        row.push("OnTimes");
        row.push("OffTimes");
        row.push("OnDurations");
        row.push("OffDurations");
        csv.push(row.join(","));

        for(i = 0; i < exitStamps.length || i < entryStamps.length || i < exitDurs.length || i < entryDurs.length; i++){
            if(exitStamps[i]) {
                var exitTime = exitStamps[i]; 
            } else { var exitTime = "NA"}

            if(entryStamps[i]) {
                var entryTime = entryStamps[i]; 
            } else { var entryTime = "NA"}

            if(exitDurs[i]) {
                var exitDur = exitDurs[i]; 
            } else { var exitDur = "NA"}

            if(entryDurs[i]) {
                var entryDur = entryDurs[i]; 
            } else { var entryDur = "NA"}

            row = [];
            row.push(entryTime);
            row.push(exitTime);
            row.push(entryDur);
            row.push(exitDur);
            csv.push(row.join(","));
        }

        // Download CSV file
        this.downloadCSV(csv.join("\n"), filename);
    },

    exportTableToCSV_old: function (filename, table) {
        var csv = [];
        var datatable = document.getElementById(table);
        var rows = datatable.querySelectorAll("tr");

        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");

            for (var j = 0; j < cols.length; j++) {
                var cellText = '"' + cols[j].innerText + '"'; //add to protect from commas within cell
                row.push(cellText);
            };

            csv.push(row.join(","));
        }

        var exitStamps = my_widget_script._exitStamps;
        var entryStamps = my_widget_script._entryStamps;

        var row = [];
        row.push("OnTimes");
        row.push("OffTimes");
        csv.push(row.join(","));

        for(i = 0; i < exitStamps.length || i < entryStamps.length; i++){
            if(exitStamps[i]) {
                var exitTime = exitStamps[i]; 
            } else { var exitTime = "NA"}

            if(entryStamps[i]) {
                var entryTime = entryStamps[i]; 
            } else { var entryTime = "NA"}

            var row = [];
            row.push(entryTime);
            row.push(exitTime);
            csv.push(row.join(","));
        }

        var exitDurs = my_widget_script._exitDurs;
        var entryDurs = my_widget_script._entryDurs;

        var row = [];
        row.push("OnDurations");
        row.push("OffDurations");
        csv.push(row.join(","));

        for(i = 0; i < exitDurs.length || i < entryDurs.length; i++){
            if(exitDurs[i]) {
                var exitDur = exitDurs[i]; 
            } else { var exitDur = "NA"}

            if(entryDurs[i]) {
                var entryDur = entryDurs[i]; 
            } else { var entryDur = "NA"}

            var row = [];
            row.push(entryDur);
            row.push(exitDur);
            csv.push(row.join(","));
        }

        // Download CSV file
        this.downloadCSV(csv.join("\n"), filename);
    },

    copyTable: function ($table, copyHead, $divForCopy) {
        //create a temporary text area
        var $temp = $("<text" + "area style='opacity:0;'></text" + "area>");
        var addLine = "";
        if (copyHead) {
            $table.find("thead").children("tr").each(function () { //add each child of the row
                var addTab = "";
                $(this).children().each(function () {
                    $temp.text($temp.text() + addTab + $(this).text());
                    addTab = "\t";
                });
            });
            addLine = "\n";
        }

        $table.find("tbody").children("tr").each(function () { //add each child of the row
            $temp.text($temp.text() + addLine);
            var addTab = "";
            $(this).find("td").each(function () {
                if ($(this).text()) {
                    var addText = $(this).text();
                } else {
                    var addText = "NA"
                }
                $temp.text($temp.text() + addTab + addText);
                addTab = "\t";
                addLine = "\n";
            });
        });

        $temp.appendTo($divForCopy).focus().select(); //add temp to tableDiv and select
        document.execCommand("copy"); //copy the "selected" text
        $temp.remove(); //remove temp
    },

    copyDurations: function ($divForCopy) {
        //create a temporary text area
        var $temp = $("<text" + "area style='opacity:0;'></text" + "area>");
        var addLine = "";

        $temp.text("OnDurations\tOffDurations");

        var exitDurs = my_widget_script._exitDurs;
        var entryDurs = my_widget_script._entryDurs;

        for(i = 0; i < exitDurs.length || i < entryDurs.length; i++){
            if(exitDurs[i]) {
                var exitDur = exitDurs[i]; 
            } else { var exitDur = "NA"}

            if(entryDurs[i]) {
                var entryDur = entryDurs[i]; 
            } else { var entryDur = "NA"}

            $temp.text($temp.text() + "\n" + entryDur + "\t" + exitDur);
        }

        $temp.appendTo($divForCopy).focus().select(); //add temp to tableDiv and select
        document.execCommand("copy"); //copy the "selected" text
        $temp.remove(); //remove temp
    },

    copyTimeStamps: function ($divForCopy) {
        //create a temporary text area
        var $temp = $("<text" + "area style='opacity:0;'></text" + "area>");
        var addLine = "";

        $temp.text("OnTimes\tOffTimes");

        var exitStamps = my_widget_script._exitStamps;
        var entryStamps = my_widget_script._entryStamps;

        for(i = 0; i < exitStamps.length || i < entryStamps.length; i++){
            if(exitStamps[i]) {
                var exitTime = exitStamps[i]; 
            } else { var exitTime = "NA"}

            if(entryStamps[i]) {
                var entryTime = entryStamps[i]; 
            } else { var entryTime = "NA"}

            $temp.text($temp.text() + "\n" + entryTime + "\t" + exitTime);
        }

        $temp.appendTo($divForCopy).focus().select(); //add temp to tableDiv and select
        document.execCommand("copy"); //copy the "selected" text
        $temp.remove(); //remove temp
    },

    calcTableFuncs: function() {
        my_widget_script.data_valid_form(); //run to give error, but allow to calc regardless
        my_widget_script.calcValues();
    },

    toCSVFuncs: function (fileName, $errorMsg) {
        var data_valid = this.data_valid_form();

        if (data_valid) {
            this.calcValues();
            this.exportInfoToCSV(fileName);
            $errorMsg.html("<span style='color:grey; font-size:24px;'>Saved successfully</span>");
        } else {
            $errorMsg.append("<br/><span style='color:grey; font-size:24px;'>Did not export</span>");
        }
    },

    copyDataFuncs: function ($copyHead, $tableToCopy, $tableDiv, $errorMsg, $divForCopy){
        var data_valid = my_widget_script.data_valid_form();
        var copyHead

        //only copy the heading when the input box is checked
        if ($copyHead.is(":checked")) {
            copyHead = true;
        } else {
            copyHead = false;
        }

        my_widget_script.calcValues();

        if (data_valid) { //if data is valid
            $tableDiv.show(); //show the table
            my_widget_script.resize(); //resize
            my_widget_script.copyTable($tableToCopy, copyHead, $divForCopy); //copy table
            $errorMsg.html("<span style='color:grey; font-size:24px;'>Copied successfully</span>") //update error message
        } else {
            $errorMsg.append("<br/><span style='color:grey; font-size:24px;'>Nothing was copied</span>"); //add to error message
        }
    },

    copyDurationsFuncs: function ($errorMsg, $divForCopy){
        var data_valid = my_widget_script.data_valid_form();

        my_widget_script.calcValues();

        if (data_valid) { //if data is valid
            my_widget_script.copyDurations($divForCopy); //copy durations
            $errorMsg.html("<span style='color:grey; font-size:24px;'>Copied successfully</span>") //update error message
        } else {
            $errorMsg.append("<br/><span style='color:grey; font-size:24px;'>Nothing was copied</span>"); //add to error message
        }
    },

    copyTimeStampsFuncs: function ($errorMsg, $divForCopy){
        var data_valid = my_widget_script.data_valid_form();

        my_widget_script.calcValues();

        if (data_valid) { //if data is valid
            my_widget_script.copyTimeStamps($divForCopy); //copy durations
            $errorMsg.html("<span style='color:grey; font-size:24px;'>Copied successfully</span>") //update error message
        } else {
            $errorMsg.append("<br/><span style='color:grey; font-size:24px;'>Nothing was copied</span>"); //add to error message
        }
    },

    GoogleChartTimeLine: function () {
        google.charts.load("current", {packages:["timeline"]});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {

            var container = document.getElementById('example3.1');
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn({ type: 'string', id: 'Position' });
            dataTable.addColumn({ type: 'date', id: 'Start' });
            dataTable.addColumn({ type: 'date', id: 'End' });

            var startTime = $("#recTime").val();
            if(startTime){
                var splitTime = my_widget_script.getHoursMin(startTime);
                var startHour = splitTime.hours;
            } else{
                startHour = 0;
            }


            for(i = 0; i < my_widget_script._stampStates.length; i++ ){
                var movement = "", time = NaN, duration = NaN;
                movement = my_widget_script._stampStates[i];
                time = my_widget_script._stampTimes[i];
                duration = my_widget_script._allDurations[i];

                var state = ""
                if(movement == "exit"){
                    state = "OFF Nest"
                } else if(movement == "entry") {
                    state = "ON Nest"
                }

                dataTable.addRows([
                    [ state, new Date(0, 0, 0, startHour, 0, time), new Date(0, 0, 0, startHour, 0, time + duration) ]
                ]);
            }

            if(my_widget_script._startState == "off"){
                colors = ['#f4c8ce', '#ccdbf6']
            } else if(my_widget_script._startState == "on"){
                colors = ['#ccdbf6', '#f4c8ce']
            }
            var options = {
                hAxis: {
                title: 'Time'
                },
                colors: colors,
                avoidOverlappingGridLines: false
            };
            var container = document.getElementById("chart_div");
            var chart = new google.visualization.Timeline(container);
            
            chart.draw(dataTable, options);
        }
    },

    // downloadTimeline: function(){
    //     var chartContainer = document.getElementById("chart_div");
    //     var chartArea = chartContainer.getElementsByTagName('svg')[0].parentNode;
    //     var svg = chartArea.innerHTML;
    //     var doc = chartContainer.ownerDocument;
    //     var canvas = doc.createElement('canvas');
    //     canvas.setAttribute('width', chartArea.offsetWidth);
    //     canvas.setAttribute('height', chartArea.offsetHeight);
    
    //     canvas.setAttribute(
    //         'style',
    //         'position: absolute; ' +
    //         'top: ' + (-chartArea.offsetHeight * 2) + 'px;' +
    //         'left: ' + (-chartArea.offsetWidth * 2) + 'px;');
    //     doc.body.appendChild(canvas);
    //     canvg(canvas, svg); // would have to add another set of libraries
    //     var imgData = canvas.toDataURL('image/png');
    //     canvas.parentNode.removeChild(canvas);
    // },

    // // https://stackoverflow.com/questions/41277531/google-timeline-chart-to-image
    // // http://jsfiddle.net/xfh7nctk/23/
    // // Doesn't draw full timeline
    // downloadTimeline_test: function(){
    //     var container = document.getElementById("chart_div");

    //     var getSVG = container.getElementsByTagName("svg")[0]; // Gets the graph
    //     getSVG.setAttribute('xmlns', "http://www.w3.org/2000/svg"); // Add attr to svg
    //     getSVG.setAttribute('xmlns:svg', "http://www.w3.org/2000/svg"); // Add attr to svg

    //     // From Fiddle
    //     var myCanvas = document.getElementById("canvas");
    //     var ctxt = myCanvas.getContext("2d");


    //     my_widget_script.drawInlineSVG(ctxt, getSVG.outerHTML, function() {
    //         console.log("printing?")
    //         console.log(canvas.toDataURL());  // -> PNG
    //     });
    // },

    // drawInlineSVG: function(ctx, rawSVG, callback) {
    //     var svg = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"}),
    //         domURL = self.URL || self.webkitURL || self,
    //         url = domURL.createObjectURL(svg),
    //         img = new Image;

    //     img.onload = function () {
    //         ctx.drawImage(this, 0, 0);     
    //         domURL.revokeObjectURL(url);
    //         callback(this);
    //     };

    //     img.src = url;
    // }
};
