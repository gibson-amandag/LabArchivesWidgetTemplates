my_widget_script =
{
    cells: {},
    cellNums: [],

    to_json: function () {
        //should return a json string containing the data entered into the form by the user
        //whatever is return from the method is persisted in LabArchives.  must not be binary data.
        //called when the user hits the save button, when adding or editing an entry

        //Acquire input data from the form using the parent_class.to_json() function
        var widgetJsonString = this.parent_class.to_json();

        // Add widgetData and any additional dynamic content to an output object
        // Will be accessed within the init and from_json methods
        var output = { 
            widgetData: JSON.parse(widgetJsonString),
            cellNums: this.cellNums,
            cells: this.cells
        };

        //uncomment to check stringified output
        //console.log("to JSON", JSON.stringify(output));

        // return stringified output
        return JSON.stringify(output);
    },

    /**
     * TO DO: edit this function to reinitialize any dynamic content that is not explicity
     * defined within the HTML code. 
     * 
     * This function requires the parsedJson object.
     */
    initDynamicContent: function (parsedJson) {
        // console.log(parsedJson);
        
        // console.time("initDynamic");
        if(parsedJson.cellNums){
            for (var i = 0; i < parsedJson.cellNums.length; i++){
                var cell = parsedJson.cellNums[i];
                // this.cellNums.push(cell);
                this.makeCellCard(cell);
            }
        } else {
            this.cellNums = [];
        }
        // console.timeEnd("initDynamic");
    },

    /**
     * TO DO: edit this function to define how the form should be initilized based 
     * on the existing form values. This is particularly important for when the 
     * widget already has data entered, such as when saved to a page.
     */
    setUpInitialState: function () {
        $(".addCell").on("click", (e)=> {
            if(this.cellNums.length > 0){
                var lastCell = this.cellNums[this.cellNums.length - 1];
                var cellNum = lastCell + 1;
            } else {
                var cellNum = 1;
            }
            this.makeCellCard(cellNum);
        });
    },

    makeCard: function ($div, cardHeadContent, cardBodyContent) {
        // Add extras to header, such as classes or data attributes in calling function after making the card
        $div.append(
            $("<div></div>", {
                "class": "card"
            }).append(
                $("<button></button>", {
                    "type": "button",
                    "class": "card-header",
                }).on("click", (e)=> {
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
        this.resize();
    },

    makeCellCard: function(cellNum){
        var inArray = this.checkInArray(cellNum, this.cellNums);
        if(! inArray){
            // debugger;
            this.cellNums.push(cellNum);
            this.cells[cellNum] = {
                id: ""
            };

            var $div = $("#cellCardDiv");

            if(! $div.find(".card").length){
                $div.html("");
            }

            $div.append(
                $("<div/>", {
                    "class": "col col-md-6 mt-2 cellCard",
                    "data-cell": cellNum
                })
            )
            
            var $cellDiv = $(".cellCard"+this.cellSearch(cellNum));
            
            var header = $("<div></div>", {
                "class": "cellIDCalc",
                "data-cell": cellNum,
                "data-calc": "cellID"
            }).append("Cell " + cellNum);

            var $body = this.makeCellCardBody(cellNum);
            this.makeCard($cellDiv, header, $body)
            this.makeCellRow(cellNum);
        }

    },

    deleteCellFuncs: function (cellNum) {
        this.runIfConfirmed(
            "Are you sure that you wish to delete this cell?", 
            ()=>{
                // Remove it from the cellNums
                var index = this.cellNums.indexOf(cellNum);
                if(index > -1){
                    this.cellNums.splice(index, 1);
                }
        
                // Remove it from the cells object
                delete this.cells[cellNum];
        
                // console.log(this.cellNums);
        
                var cellSearch = this.cellSearch(cellNum);
                $(".cellCard"+cellSearch).remove();
                // $("tr"+cellSearch).remove();

                // remove everything with this data attribute
                $(cellSearch).remove();
            }
        );
        this.resize();
    }
};