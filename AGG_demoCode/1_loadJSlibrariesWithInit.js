my_widget_script =
{
    init: function (mode, json_data) {
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
    },

    //https://stackoverflow.com/questions/8139794/load-jquery-in-another-js-file
    include: function(src, integrity, crossorigin, onload) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.setAttribute("integrity", integrity);
        script.setAttribute("crossorigin", crossorigin);
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
    }
};

// In HTML script - load bootstrap CSS and add own css styles

// <!-- Bootstrap CSS -->
// <link crossorigin="anonymous" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
//     integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" rel="stylesheet" />
// <style type="text/css">
//     /* TO DO Place css styling code here */

//     /* responsive table doesn't work with xs screen sizes for some reason, so apply a specific width for these */
//     @media (max-width: 576px) {
//         .xsTableDiv {
//             width: 300px !important;
//             overflow-x: scroll;
//         }
//     }

//     table {
//         border: 2px solid black;
//     }

//     th {
//         padding: 5px;
//         border: 2px solid black;
//     }

//     td {
//         padding: 5px;
//         border: 1px solid black;
//     }

//     .fullWidth {
//         width: 100%
//     }
// </style>