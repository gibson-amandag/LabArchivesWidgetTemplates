my_widget_script =
{
    init: function (mode, json_data) {
        //this method is called when the form is being constructed
        // parameters
        // mode = if it equals 'view' than it should not be editable
        //        if it equals 'edit' then it will be used for entry
        //        if it equals 'view_dev' same as view,  does some additional checks that may slow things down in production
        //        if it equals 'edit_dev' same as edit,   does some additional checks that may slow things down in production

        // json_data will contain the data to populate the form with, it will be in the form of the data
        // returned from a call to to_json or empty if this is a new form.
        //By default it calls the parent_class's init.

        //uncomment to inspect and view code while developing
        // debugger;

        //Get the parsed JSON data
        var parsedJson = this.parseInitJson(json_data);

        //Uncomment to print parsedJson to consol
        //console.log("init", parsedJson);

        //check parsedJson for info not contained in form inputs and reinitialize
        this.initDynamicContent(parsedJson);

        //resize the content box when the window size changes
        window.onresize = ()=> this.resize(); // need the arrow func, or "this" within resize becomes associated with event

        // Initialize the form with the stored widgetData using the parent_class.init() function
        this.parent_class.init(mode, () => JSON.stringify(parsedJson.widgetData));

        // $("select.alexafluor").each((i,e)=>{
        //     console.log("Select after init", $(e).val());
        // });

        // Add * and # to mark required field indicators
        this.addRequiredFieldIndicators();

        // Set up the form based on previously entered form input
        this.setUpInitialState();

        //adjust form design and buttons based on mode
        this.adjustForMode(mode);

        // Print to console log if any elements don't have a required name attribute
        this.checkForNames();
    },
    
    to_json: function () {
        //should return a json string containing the data entered into the form by the user
        //whatever is return from the method is persisted in LabArchives.  must not be binary data.
        //called when the user hits the save button, when adding or editing an entry

        //Acquire input data from the form using the parent_class.to_json() function
        var widgetJsonString = this.parent_class.to_json();

        //Get information about any dynamic content that may have been created
        var dynamicContent = this.getDynamicContent();

        // Add widgetData and any additional dynamic content to an output object
        // Will be accessed within the init and from_json methods
        var output = { 
            widgetData: JSON.parse(widgetJsonString),
            abNums: this.abNums
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

    /**
     * In preview, the form is populated with test data when the
     * parent_class.test_data() function is called. This randomly selects options for 
     * dropdown select menus, radio buttons, and checkboxes.
     */
    test_data: function () {
        //during development this method is called to populate your form while in preview mode

        // ORIGINAL LABARCHIVES RETURN FOR TEST DATA
        //return this.parent_class.test_data();

        // CUSTOM TEST DATA

        //store the outcome of the the test data within the testData variable
        var testData = JSON.parse(this.parent_class.test_data());

        //If no additional dynamic content 
        var output = { 
            widgetData: testData,
            abNums: [1, 3] 
        };

        //Add additional content to match the objects in to_json
        //var output = { widgetData: testData, addedRows: 2 }; //When in development, initialize with 2 addedRows

        //return the stringified output for use by the init function
        return JSON.stringify(output);
    },

    /**
     * This function determines whether or not the user is allowed to save the widget to the page
     * 
     * The original LabArchives function checks for fields that have _mandatory appended to the name attribute
     * 
     * The custom function checks for fields with the required attribute. If any of these fields are blank, 
     * an alert is returns that provides a fail log with the ids of the elements that are missing. If there are
     * no blank required fields, an empty array is returned.
     * 
     * source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
     */
     is_valid: function (b_suppress_message) {
        //called when the user hits the save button, to allow for form validation.
        //returns an array of dom elements that are not valid - default is those elements marked as mandatory
        // that have no data in them.
        //You can modify this method, to highlight bad form elements etc...
        //LA calls this method with b_suppress_message and relies on your code to communicate issues to the user
        //Returning an empty array [] or NULL equals no error
        //TO DO write code specific to your form

        //ORIGINAL LABARCHIVES IS_VALID FUNCTION
        //return this.parent_class.is_valid(b_suppress_message);

        //CUSTOM FUNCTION TO CHECK REQUIRED ITEMS
        var fail = false; //begin with a fail variable that is false
        var fail_log = ''; //begin with an empty fail log
        var name; //create a name variable

        //search the_form for all elements that are of type select, textarea, or input
        $('#the_form').find('select, textarea, input').each((i, e)=> {
            if (!$(e).prop('required')) { //if this element does not have a required attribute
                //don't change anything (fail remains false)
            } else { //if there is a required attribute
                if (!$(e).val()) { //if there is not a value for this input
                    fail = true; //change fail to true
                    name = $(e).attr('id'); //replace the name variable with the name attribute of this element
                    fail_log += name + " is required \n"; //add to the fail log that this name is required
                }

            }
        });

        $("input[type='date']").each((i, e)=> {
            var date = $(e).val();
            if(date){
                var validDate = this.isValidDate(date);
                if(!validDate){
                    fail = true;
                    fail_log += "Please enter valid date in form 'YYYY-MM-DD'";
                }
            }
        });

        $("input[type='time']").each((i, e)=> {
            var time = $(e).val();
            if(time){
                var validtime = this.isValidTime(time);
                if(!validtime){
                    fail = true;
                    fail_log += "Please enter valid time in form 'hh:mm' - 24 hr time";
                }
            }
        });

        if (fail) { //if fail is true (meaning a required element didn't have a value)
            return bootbox.alert(fail_log); //return the fail log as an alert
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

    /**
     * TO DO: edit this function to reinitialize any dynamic content that is not explicity
     * defined within the HTML code. 
     * 
     * This function requires the parsedJson object.
     */
    initDynamicContent: function (parsedJson) {
        // console.log("parsedJson, initDynamic:", parsedJson);
        if(parsedJson.abNums){
            // console.log("initDynamic: abNums", parsedJson.abNums);
            for(var i = 0; i < parsedJson.abNums.length; i++){
                var abNum = parsedJson.abNums[i];
                this.addAntibodies(abNum);
            }
        }
    },

    /**
     * TO DO: edit this function to define how the HTML elements should be adjusted
     * based on the current mode.
     * 
     * Here, a subset of buttons are disabled when the widget is not being edited.
     * There may be other elements that should be shown/hidden based on the mode
     */
    adjustForMode: function (mode) {
        if (mode !== "edit" && mode !== "edit_dev") {
            //disable when not editing
            $(".disableOnView").prop("disabled", true);
            $("input[type='date']").removeClass(".hasDatePicker");
            $(".hideView").hide();
        } else {
            $("input[type='date']").each((i, e)=> {
                this.checkDateFormat($(e));
            });
            
            $("input[type='time']").each((i, e)=> {
                this.checkTimeFormat($(e));
            });
        }
    },

    /**
     * TO DO: edit this function to define the symbols that should be added to the HTML
     * page based on whether or not a field is required to save the widget to the page
     * 
     * Here, the function adds a blue # before fields of the class "needForFormLab" and a 
     * red * before fields with the "requiredLab" property
     */
    addRequiredFieldIndicators: function () {
        $('.needForTableLab').each((i, e)=> { //find element with class "needForFormLab"
            //alert($(e).val());
            $(e).html("<span class='hideView' style='color:blue'>#</span>" + $(e).html()); //add # before
        });

        $('.requiredLab').each((i, e)=> { //find element with class "requiredLab"
            //alert($(e).val());
            $(e).html("<span class='hideView' style='color:red'>*</span>" + $(e).html()); //add # before
        });
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
        this.timeSupported = supported;
        input.remove();
        return (supported);
    },

    timeSupported: true,

    checkTimeFormat: function ($timeInput) {
        if(!this.timeSupported){ // if not supported
            $timeInput.next(".timeWarning").remove();
            var time = $timeInput.val();
            var isValid = this.isValidTime(time);
            if(!isValid){
                $timeInput.after('<div class="text-danger timeWarning">Enter time as "hh:mm" in 24-hr format</div>');
            }
            this.resize();
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
        this.dateSupported = supported;
        input.remove();
        return (supported);
    },

    dateSupported: true,

    checkDateFormat: function ($dateInput) {
        if(!this.dateSupported){ // if not supported
            $dateInput.next(".dateWarning").remove();
            var date = $dateInput.val();
            var isValid = this.isValidDate(date);
            if(!isValid){
                $dateInput.after('<div class="text-danger dateWarning">Enter date as "YYYY-MM-DD"</div>');
            }
            $dateInput.datepicker({dateFormat: "yy-mm-dd"})
            this.resize();
        }
    },

    /**
     * TO DO: edit this function to define how the form should be initilized based 
     * on the existing form values. This is particularly important for when the 
     * widget already has data entered, such as when saved to a page.
     */
    setUpInitialState: function () {
        //Add classes to add bootstrap styles for left column in form
        $('.myLeftCol').addClass("col-12 col-sm-6 col-md-4 col-lg-3 text-left text-sm-right");
        
        this.isDateSupported();
        this.isTimeSupported();


        $("input[type='date']").prop("placeholder", "YYYY-MM-DD").on("change", (e)=> {
            this.checkDateFormat($(e.target));
        });
        
        $("input[type='time']").prop("placeholder", "hh:mm").on("change", (e)=> {
            this.checkTimeFormat($(e.target));
        });

        $('textarea.autoAdjust').each((i,e)=> { // i is the index for each match, textArea is the object
            e.setAttribute('style', 'height:' + (e.scrollHeight) + 'px;overflow-y:hidden;');
        }).on('input', (e)=> {
            e.target.style.height = 'auto';
            e.target.style.height = (e.target.scrollHeight) + 'px';
            this.resize();
        });

        $("#addAntibody").on("click", (e)=> {
            this.addAntibodyClick();
        });

        $("select.alexafluor").each((i, e)=>{
            this.showOther($(e));
            // console.log("calling update fluor info with setUpInitialState")
            this.updateFluorInfo($(e));
        });

        this.updateWatched();

        for(var i=0; i<this.abNums.length; i++){
            this.updateAbName("primary", this.abNums[i]);
            this.updateAbName("secondary", this.abNums[i]);
        }

        this.resize();
    },

    /**
     * TO DO: edit this function to define which <div>s or other elements
     * should be adjusted based on the current width of the window
     */
    resize: function () {
        //resize the container
        this.parent_class.resize_container();
    },

    checkForNames: function() {
        $("input, select, textarea").each((i,e)=>{
            var hasName = $(e).attr("name");
            if(!hasName){
                console.log("There is no name attribute for: ", e.id);
            }
        })
    },
    // ********************** END CUSTOM INIT METHODS **********************


    // ********************** START CUSTOM TO_JSON METHODS **********************
    getDynamicContent: function () {
        var dynamicContent = {
        };
        return dynamicContent;
    },
    // ********************** END CUSTOM TO_JSON METHODS **********************

    /** -----------------------------------------------------------------------------
     * VALIDATE FORM ENTRY BEFORE COPYING OR SAVING TABLE TO CSV
     *
     * This function will check that elements with a class "needForTable"
     * are not blank. If there are blank elements, it will return false
     * and will post an error message "Please fill out all elements marked by a blue #"
     *
     * source: https://stackoverflow.com/questions/18495310/checking-if-an-input-field-is-required-using-jquery
     * -----------------------------------------------------------------------------
     */
     data_valid_form: function () {
        var valid = true; //begin with a valid value of true
        //var fail_log = ''; //begin with an empty fail log
        //var name; //create a name variable

        //search the_form for all elements that are of class "needForForm"
        $('.needForTable').each((i, e)=> {
            if (!$(e).val()) { //if there is not a value for this input
                valid = false; //change valid to false
                //name = $(e).attr('id'); //replace the name variable with the id attribute of this element
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

    alexaFluorDyes: {
        350: {absorption: 346, emission: 442, cssTextColor: "white", color: "blue", cssBackColor: "blue"},
        405: {absorption: 401, emission: 421, cssTextColor: "white", color: "blue", cssBackColor: "blue"},
        430: {absorption: 433, emission: 541, cssTextColor: "black", color: "green/yellow", cssBackColor: "greenyellow"},
        488: {absorption: 496, emission: 519, cssTextColor: "white", color: "green", cssBackColor: "green"},
        532: {absorption: 532, emission: 553, cssTextColor: "black", color: "yellow", cssBackColor: "yellow"},
        546: {absorption: 556, emission: 573, cssTextColor: "black", color: "orange", cssBackColor: "orange"},
        555: {absorption: 555, emission: 565, cssTextColor: "black", color: "orange", cssBackColor: "orange"},
        568: {absorption: 578, emission: 603, cssTextColor: "white", color: "orange/red", cssBackColor: "orangered"},
        594: {absorption: 590, emission: 617, cssTextColor: "white", color: "red", cssBackColor: "red"},
        610: {absorption: 612, emission: 628, cssTextColor: "white", color: "red", cssBackColor: "red"},
        633: {absorption: 632, emission: 647, cssTextColor: "white", color: "far red", cssBackColor: "darkred"},
        635: {absorption: 633, emission: 647, cssTextColor: "white", color: "far red", cssBackColor: "darkred"},
        647: {absorption: 650, emission: 665, cssTextColor: "white", color: "near-ir", cssBackColor: "grey"},
        660: {absorption: 663, emission: 690, cssTextColor: "white", color: "near-ir", cssBackColor: "grey"},
        680: {absorption: 679, emission: 702, cssTextColor: "white", color: "near-ir", cssBackColor: "grey"},
        700: {absorption: 702, emission: 723, cssTextColor: "white", color: "near-ir", cssBackColor: "grey"},
        750: {absorption: 749, emission: 775, cssTextColor: "white", color: "near-ir", cssBackColor: "grey"},
        790: {absorption: 784, emission: 814, cssTextColor: "white", color: "near-ir", cssBackColor: "grey"},
    },

    otherObj: {absorption: "", emission: "", cssTextColor: "black", color: "", cssBackColor: "white"},

    primaryAbsNums: [],

    secondaryAbsNums: [],

    abNums: [],

    primaryWatchNames: ["target", "species", "dilution", "lot", "ref", "company"],
    primaryColNames: ["Target", "Species", "Dilution", "Lot #", "Ref/Cat #", "Company"],
    secondaryWatchNames: ["target", "species", "dilution", "lot", "ref", "company", "alexafluor", "color", "absorption", "emission"],
    secondaryCalcNames: ["target", "species", "dilution", "alexafluor", "color", "lot", "ref", "company", "absorption", "emission"],
    secondaryColNames: ["Target", "Species", "Dilution", "Lot #", "Ref/Cat #", "Company", "Fluorophore", "Color", "Absorption Peak", "Emission Peak"],

    checkInArray: function (searchVal, array){
        var inArray = $.inArray(searchVal, array) !== -1;
        return inArray
    },

    dataSearch: function (dataName, dataValue) {
        var dataSearch = "[data-" + dataName + "='" + dataValue + "']";
        return dataSearch
    },

    abNumSearch: function (abNum) {
        var abSearch = this.dataSearch("abnum", abNum);
        return abSearch;
    },

    abTypeSearch: function (abType) {
        var abSearch = this.dataSearch("abtype", abType);
        return abSearch;
    },

    abSearch: function(abType, abNum){
        var abSearch = this.abTypeSearch(abType) + this.abNumSearch(abNum);
        return abSearch;
    },

    calcSearch: function (calc) {
        var calcSearch = this.dataSearch("calc", calc);
        return calcSearch;
    },

    watchSearch: function (watch) {
        var watchSearch = this.dataSearch("watch", watch);
        return watchSearch;
    },

    watchValue: function ($el) {
        var watch = $el.data("watch");
        var calcSearch = this.calcSearch(watch);
        var abType = $el.data("abtype");
        var abNum = $el.data("abnum");
        
        var val = $el.val();

        // console.log("watch: " + watch + "; val: " + val);
        
        if(abType){
            calcSearch += this.abTypeSearch(abType);
        }
        if(abNum){
            calcSearch += this.abNumSearch(abNum);
        }
        if(watch === "alexafluor" && val !== "Other"){
            val = "AF" + val;
        }

        $(calcSearch).html(val);

        this.resize();
    },

    updateAbName: function (abType, abNum){
        // var search = this.abTypeSearch(abType) + this.abNumSearch(abNum);
        var search = this.abSearch(abType, abNum);
        var target = $(".target"+search).val();
        var species = $(".species"+search).val();
        
        // console.log("target" + target);
        // console.log("species "+ species);

        if(target && species){
            var name = this.capitalize(species) + " anti-" + target;
        } else {
            var name = this.capitalize(abType) + " Antibody " + abNum;
        }

        $(".abName"+search).text(name);
        this.resize();
    },

    capitalize: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    showOther: function ($el) {
        if($el.val() === "Other") {
            // console.log("showing other");
            var $other = $el.next(".ifOther").show();
            // Adjust height
            var thisScrollHeight = $other.prop("scrollHeight");
            $other.css("height", thisScrollHeight).css("overflow-y", "hidden");
        } else {
            $el.next(".ifOther").hide();
        }
        this.resize();
    },

    colorFluorOptions: function ($selection) {
        // console.log($selection);
        $selection.find("option").each((i, e)=> {
            var val = $(e).val();
            if(val !== "Other"){
                var thisAF = this.alexaFluorDyes[val];
            } else{
                var thisAF = this.otherObj;
            }
            this.colorFluor($(e), thisAF)
        });
    },

    colorFluor: function($el, alexaFluorObj) {
        $el.css("background-color", alexaFluorObj.cssBackColor).css("color", alexaFluorObj.cssTextColor);
    },
    
    updateFluorInfo: function ($el) {
        var thisVal = $el.val();

        if(thisVal){
            var abType = $el.data("abtype");
            var abNum = $el.data("abnum");
            var abSearch = this.abSearch(abType, abNum);
            var fieldsToUpdate = ["color", "absorption", "emission"];
            
            if(thisVal !== "Other"){
                var thisAF = this.alexaFluorDyes[thisVal];
            }else{
                var thisAF = this.otherObj;
            }
        
            for(i = 0; i<fieldsToUpdate.length; i++){
                var field = fieldsToUpdate[i];
                var watchSearch = this.watchSearch(field);
                $(abSearch + watchSearch).val(thisAF[field]).each((i, e)=> {
                    this.watchValue($(e));
                });
            }
            this.colorFluor($(this.calcSearch("color")+abSearch), thisAF);
            this.colorFluor($(".alexafluor"+abSearch), thisAF);
            this.colorFluor($el.parents(".card-body").prev(), thisAF)
    
            this.resize();
        }
    },

    toggleCard: function ($cardHead) {
        $cardHead.next().toggleClass("collapse");
        $cardHead.next().find("textarea.autoAdjust").each((i, e)=> {
            if(! $(e).is(":hidden")) {
                e.setAttribute(
                    'style', 'height:' + (e.scrollHeight) + 'px;overflow-y:hidden;display:inline-block;'
                );
            } 
        });
        this.resize();
    },

    makeCard: function ($div, cardHeadContent, cardBodyContent, abNum) {
        // Add extras to header, such as classes or data attributes in calling function after making the card
        $div.append(
            $("<div></div>", {
                "class": "col col-md-6",
                "data-abnum": abNum
            }).append(
                $("<div></div>", {
                    "class": "card"
                }).append(
                    $("<button></button>", {
                        "type": "button",
                        "class": "card-header",
                    }).on("click", (e)=> {
                        // This has to be currentTarget, because target can be the div within the button
                        this.toggleCard($(e.currentTarget));
                    }).append(cardHeadContent)
                ).append(
                    $("<div></div>", {
                        "class": "card-body collapse"
                    }).append(
                        cardBodyContent
                    )
                )
            )
        );
        this.resize();
    },

    addAntibodyClick: function (){
        var abNum = 1;
        if(this.abNums.length > 0){
            var lastAb = this.abNums[this.abNums.length - 1];
            // console.log("lastAb: " + lastAb);
            abNum = lastAb + 1;
        }

        var inArray = this.checkInArray(abNum, this.abNums);
        if(! inArray){
            this.addAntibodies(abNum);
        }
    },

    addAntibodies: function(abNum) {
        this.abNums.push(abNum);
        // this.primaryAbs[abNum] = {} // haven't made yet, not sure if needed
        $(".cardDiv").append(
            $("<h3/>", {
                "data-abnum": abNum,
                "class": "col-12"
            }).append("Antibody Series " + abNum)
        ).append(
            $("<div></div>", {
                "class": "col-12 mb-2",
                "data-abnum": abNum
            }).append(
                $("<input></input>", {
                    "type": "button",
                    "data-abnum": abNum,
                    "value": "Delete antibody",
                    name: "deleteab"+abNum,
                    id: "deleteAb"+abNum,
                    "class": "fullWidth deleteAb hideView"
                }).on("click", (e)=>{
                    this.deleteAb(abNum)
                })
            )
        );

        this.addAbTableRow(
            "primary", 
            abNum,
            this.primaryWatchNames
        );

        this.addAbCard(
            "primary", 
            abNum, 
            this.primaryWatchNames, 
            this.primaryColNames
        );
        this.addAbTableRow(
            "secondary", 
            abNum,
            this.secondaryCalcNames
        );
        this.addAbCard(
            "secondary", 
            abNum, 
            this.secondaryWatchNames, 
            this.secondaryColNames
        );
        
        var primaryAbSearch = this.abSearch("primary", abNum);
        var secondaryAbSearch = this.abSearch("secondary", abNum);
        $(".species"+primaryAbSearch).on("input", (e)=>{
            // e.target is okay here because if there is input into the field,
            // then this is the field that should be interacted with
            // I don't think that there's a sub field
            var thisVal = $(e.target).val(); // target is okay here, because if 
            $(".target"+secondaryAbSearch).val(thisVal)
            this.updateAbName("secondary", abNum);
            this.updateWatched();
            // $(this.calcSearch("target")+secondaryAbSearch).text(thisVal);
        })
    },

    updateWatched: function() {
        // console.log("Update Watched");
        $(".watch").each((i,e)=>{
            // console.log($(e));
            var watch = $(e).data("watch");
            if(watch !== "alexafluor"){
                // console.log("in update: watch: " + watch + "; val: " +$(e).val());
                this.watchValue($(e));
            } else{
                // console.log("alexafluor");
                if($(e).val() !== "Other"){
                    this.watchValue($(e));
                } else {
                    var $other = $(e).next(".ifOther");
                    var other = $other.val();
                    var calcSearch = this.calcSearch("alexafluor");
                    var abType = $other.data("abtype");
                    var abNum = $other.data("abnum");
                    var abSearch = this.abSearch(abType, abNum);
                    $(abSearch + calcSearch).text(other);
                }
            }
        })
    },

    deleteAb: function (abNum){
        this.runIfConfirmed(
            "Are you sure that you wish to delete this antibody?",
            ()=>{
                var search = this.abNumSearch(abNum);
                $(search).remove(); 
                
                var index = this.abNums.indexOf(abNum);
                if(index > -1){
                    this.abNums.splice(index, 1);
                }
            }
        )
    },

    addAbTableRow: function(abType, abNum, colNames) {
        // console.log("addPrimaryTableRow ", abNum);
        var $tableBody = $(".abTable"+this.abTypeSearch(abType)).find("tbody");
        
        $tableBody.append($("<tr/>"));
        
        for(i = 0; i < colNames.length; i ++){
            var col = colNames[i];
            $tableBody.find("tr").last().append(
                $("<td/>", {
                    "data-abtype": abType,
                    "data-abnum": abNum,
                    "data-calc": col
                })
            );
        }
    },

    addAbCard: function(abType, abNum, watchNames, colNames) {
        // console.log("addPrimaryCard");
        var $cardDiv = $(".cardDiv");

        // Make the card head
        var cardHead = $("<div></div>", {
            "data-abtype": abType,
            "data-abnum": abNum,
            "class": "abName"
        }).append(this.capitalize(abType) + " Antibody " + abNum);

        // Make the card body
        var cardBody = $("<div></div>", {
            "data-abtype": abType,
            "data-abnum": abNum,
            "class": "container"
        });

        var lengthEntries = watchNames.length;

        // Make each entry and add to card body
        for(i = 0; i < lengthEntries; i++){
            var type = watchNames[i];
            var thisID = abType + type + abNum;

            // Properties for input object
            var inputObject = {
                "class": "fullWidth watch " + type,
                id: thisID,
                name: thisID,
                "data-abtype": abType,
                "data-abnum": abNum,
                "data-watch": type 
            }

            // Selection for the fluorophore, others input
            if(type === "alexafluor"){
                var $input = $("<select></select>", inputObject)
                for(dye in this.alexaFluorDyes){
                    $input.append(
                        $("<option></option>", {
                            value: dye
                        }).append("AlexaFluor "+dye)
                    );
                }
                $input.append(
                    $("<option></option>", {
                        value: "Other"
                    }).append(
                        "Other"
                    )
                ).on("input", (e)=> {
                    // target === currentTarget here, as far as I can tell with the select
                    // But, I think currentTarget is safer just in case someone there was input
                    // on the options within the select 
                    // console.log("target = currentTarget", e.target === e.currentTarget);
                    this.showOther($(e.currentTarget));
                    // console.log("calling update fluor info with alexafluor changes")
                    this.updateFluorInfo($(e.currentTarget));
                }
                )
            } else {
                var $input = $("<input></input>", inputObject);
            }

            // Make a new row for each entry, then append the name and input
            cardBody.append(
                $("<div></div>", {
                    "class": "row"
                }).append(
                    $("<div></div>", {
                        "class": "col-12 col-md font-weight-bold"
                    }).append(
                        colNames[i]
                    )
                ).append(
                    $("<div></div>", {
                        "class": "col",
                    }).append(
                        $input
                    )
                )
            );

            // For the target and species fields, update the card name based on their input
            if(type === "target" || type === "species"){
                cardBody.find("input").last().on("change", (e)=>{
                    this.updateAbName(abType, abNum);
                })
            }

            // Add a textarea for entry if "other" is selected for the fluorophore
            // Manually update the "calc" fields based on content rather than trying to separate
            // or ignore with just the simple "watch"
            if(type === "alexafluor"){
                cardBody.find("select").parent().append(
                    $("<texta" +"rea></texta" +"rea>", {
                        "class": "fullWidth autoAdjust ifOther " + type, // watch removed
                        id: thisID+"other",
                        name: thisID+"other",
                        "data-abtype": abType,
                        "data-abnum": abNum
                        // "data-watch": type 
                    }).on("input", (e)=>{
                        var calcSearch = this.calcSearch("alexafluor");
                        var abSearch = this.abSearch(abType, abNum);
                        $(abSearch + calcSearch).text($(e.target).val());
                    })
                );
            }
        }


        // textarea no longer has watch on it
        // cardBody.find(".watch").not(".ifOther").each((i,e)=> { // Don't fill with empty if other
        cardBody.find(".watch").each((i,e)=> { 
            this.watchValue($(e));
        }).on("input", (e)=>{
            this.watchValue($(e.target)); // or currentTarget
        });
        
        // This would work because of "bubbling" of event listeners
        // Target here is whatever is directly being interacted with
        // Current target would be full card body div
        
        // cardBody.on("input", (e)=>{
        //     this.watchValue($(e.target));
        // })

        // 2021-11-18, not sure what this was doing here
        // cardBody.find(".watch"+my_widget_script.watchSearch())
        
        this.makeCard(
            $cardDiv,
            cardHead,
            cardBody,
            abNum
        );

        cardBody.find(".alexafluor").not(".ifOther").each((i,e)=>{
            // console.log("calling update fluor info within addAbCard");
            this.updateFluorInfo($(e));
        });

        // Testing to see how value is changing with parent init for test data
        // Switch the first select to 488
        // $("select.alexafluor"+this.abNumSearch(1)).val(488);

        this.colorFluorOptions(cardBody.find("select.alexafluor"));
    },

    runIfConfirmed: function(text, functionToCall){
        var thisMessage = "Are you sure?";
        if(text){
            thisMessage = text;
        }
        bootbox.confirm({
            message: thisMessage,
            callback: (proceed)=>{
                if(proceed){
                    functionToCall()
                }
            }
        });
    },

    dialogConfirm: function(text, functionToCall){
        var thisMessage = "Do you want to proceed?";
        if(text){
            thisMessage = text;
        }
        bootbox.confirm({
            message: thisMessage,
            callback: (result)=>{
                functionToCall(result);
            }
        })
    },

    runBasedOnInput: function(prompt, functionToCall){
        var thisTitle = "Enter value:"
        if(prompt){
            thisTitle = prompt;
        }
        bootbox.prompt({
            title: thisTitle,
            callback: (result)=>{
                functionToCall(result);
            }
        });
    }
};