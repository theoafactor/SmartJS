const SmartContentEditor = function(){




}


/**
 * Caret Handler Engine 
 * @param {*} content 
 */
const caretHandlerEngine = function(content){
    //console.log("Caret Engine: ", content);

    let range_position = document.createRange();
    let caret_setter = window.getSelection();
    console.log(document.querySelector('.smart-content-area').childNodes[0])

    if(document.querySelector(".smart-content-area").childNodes[0]){
        range_position.setStart(document.querySelector('.smart-content-area').childNodes[0],  1);
        range_position.collapse(true)
        caret_setter.removeAllRanges();
        caret_setter.addRange(range_position);
    
        document.querySelector('.smart-content-area').focus();
    }
    

   

}



const smartjs = (function(){

    const smartEditor = document.querySelector(".smart-editor");
    const smartContentArea = document.querySelector(".smart-content-area");
    const smartContentAreaWrapper = document.querySelector(".smart-content-area-wrapper")

    // --- Capturing the Keystrokes -------------------------------
    //Yo need a way to capture certain events that ocurred in the smartContentAreaWrapper
    //the events you are looking for are: 
    // - click
    // - keyup
    
    const allowedEvents = ["click", "keyup"];

    // Set the list of format classes 
    const format_classes = ["smart-formatter-option smart-option-bold", 
                            "smart-formatter-option smart-option-italic",
                            ];

    
    for(allowedEvent of allowedEvents){

        smartEditor.addEventListener(allowedEvent, function(event){
            //console.log("captured event: ", allowedEvent);
            //console.log(event.target.className);
            //console.log("Smart formatter area")

            let textInput;
            if(event.target.className === "smart-formatter"){
                console.log("Smart formatter area")
            

            }else{
                //only react if this is a keyup event
                if(allowedEvent === "keyup"){
                    textInput = event.target.innerText;

                    //console.log(event.target.className)
                    // let startFormatElement = "<span>";
                    // let endFormatElement = "</span> ";
                    if(format_classes.includes(event.target.className)){
                        //this is a format clicked
                        //get what was clicked
                        //console.log(event.target.className, " WAS CLICKED")
                        const selection_box = event.target.className.split(" ");
                        const format_selected = selection_box[1];
                        //console.log(format_selected);
                        textInput = smartContentArea.innerText;
                        let   formatInput
                        switch(format_selected){
                            case "smart-option-bold":
                                console.log("apply bold styles")
                                //const formatElement = document.createElement("strong");
                                // startFormatElement = "<strong>";
                                // endFormatElement = "</strong>";
                                console.log(textInput)
                                console.log(event.key)
                                formatInput = `<strong>` 
                                textInput += formatInput
            
                                break;
                            case "smart-option-italic":
                                console.log("apply italic styles")
                                break;


                            default:
                               


                        }

                        



                    }else{
                      
                    }
                    if(textInput.length > 0){

                        console.log("Text input: ", textInput)

                        //remove all spans

                        spanElement = document.createElement("span");
                        
                        spanElement.innerHTML = `${textInput}`
                        smartContentArea.replaceChild(spanElement, smartContentArea.childNodes[0])
                
                        
                
                    }


                   
                }

            }





            caretHandlerEngine(textInput);
    
        }, false)


    }





    // -- End of Capturing the keystrokes



    // -- Bold Format Option ----
    const boldFormat = function(){


    }













    return {
        boldFormat: boldFormat

    }






}(new SmartContentEditor, caretHandlerEngine));