my_widget_script= {
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

    /**
     * Example - anything with this. is a property of my_widget_script created by the widget
     * This takes multiple arrays (which can have different lengths), 
     * and stitches them together as columns to export as a CSV
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
    */
}