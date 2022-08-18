/**
 * Loads Scripts and libraries that are used in the core(anchor)
 */
 function SmartMixer(){


    //load the scripts

   // - Load the Axios Library
   const axiosScript = document.createElement("script");
           axiosScript.src="https://unpkg.com/axios@0.25.0/dist/axios.min.js";
           axiosScript.async = true;
           document.head.appendChild(axiosScript)

    // - Load in the LocalForage Library 
    const localForageScript = document.createElement("script");
         localForageScript.src="https://unpkg.com/localforage@1.10.0/dist/localforage.min.js";
         localForageScript.async = true;
         document.head.appendChild(localForageScript)

   // - Load the Cookie.js library for example
   const cookieScript = document.createElement("script");
           cookieScript.src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js";
           cookieScript.async = true;
           document.head.appendChild(cookieScript);
           

           this.load_dependencies = () => {

               return new Promise((resolve, reject) =>{
                    intervalObject = setTimeout(() =>{
       
                       if(
                           typeof axios !== 'undefined' 
                           && typeof Cookies !== 'undefined'
                           && typeof localforage !== "undefined"
                           ){
                               resolve({
                                   axios: axios,
                                   Cookies: Cookies,
                                   localforage: localforage
                               })
                           
                       }else{
                           dependencies = this.load_dependencies();
                           resolve(dependencies)
                       }
       
       
                      
                   }, 100)
       
               })
       
       
           }


}


const SmartEditorContent = new function(){
    
    this.saveEditorContent = async function(new_content){

        //console.log("Save content to storage: ", new_content)
    
        new_content_update = {
            content: new_content,
            last_updated: new Date().getTime()
        }
    
        await localforage.setItem("smart-contents-storage", JSON.stringify(new_content_update));
    
    }
    
    this.getEditorContent = async function(){
    
        let content_storage = await localforage.getItem("smart-contents-storage");

        console.log(content_storage)
    
        if(content_storage != null && typeof content_storage != "undefined"){
    
            content_storage = JSON.parse(content_storage);
            content_storage = content_storage.content;
    
        }else{
            content_storage = null;
        }
    
        return content_storage;
    }


}



/**
 * Smart Formatter Core Engine 
 */
const SmartFormatters = new function(){
    const smartContentArea = document.querySelector(".smart-content-area");
       
    //activate or deactivate the bold format option
    this.boldFormat = async function(){

            let smart_options_storage = await localforage.getItem("smart-options-storage");

            smart_options_storage = JSON.parse(smart_options_storage);

            if(smart_options_storage.formatters.bold.option == true){
                
                //this is currently bold, make it normal
                smart_options_storage.formatters.bold.option = false;

                //update the option
                document.querySelector(".smart-option-bold").style.color = "white";
                document.querySelector(".smart-option-bold").style.backgroundColor = "black";
            
            }else{
                //this is currently bold, make it normal
                smart_options_storage.formatters.bold.option = true;
                document.querySelector(".smart-option-bold").style.color = "black";
                document.querySelector(".smart-option-bold").style.backgroundColor = "white";


            }

            //get the last index for the entered data in the content area
            //let last_content_length = smartContentArea.innerText.length; //seems SmartContentArea cannot provide what we need right now..

            //Lets switch to a Storage
            lastContent = await SmartEditorContent.getEditorContent();

            if(lastContent == null){
                last_content_length = 0;
            }else{
                last_content_length = lastContent.length;
            }

            

           
            console.log("Last Content Bold Option Length: ", last_content_length)

            
            //get the current item in the editor 
            if(smartContentArea.innerText == "start typing ..."){
                //there is no content
                smartContentArea.innerText = ""
                last_content_length = 0;
                console.log(last_content_length)
            }

            //save this to storage
            smart_options_storage.formatters.bold.last_content_length = last_content_length

             //update the time last updated
             smart_options_storage.formatters.bold.last_updated = new Date().getTime();

             //save it back
             await localforage.setItem('smart-options-storage', JSON.stringify(smart_options_storage));


           

        
        }




};
// - End of Smart Formatter Core Engine ----





const smartjs = (function(smartMixer){


    smartMixer.load_dependencies().then( async (dependencies) => {
        //Now you can use the dependencies here..
        //console.log(dependencies)
        //prepare the storage
        initStorage();

        //or you can call the library(ies) directly, 
        // e,g axios like this: console.log(axios)

        //load in the essential elements
        const smartEditor = document.querySelector(".smart-editor");
        const smartFormatter = document.querySelector(".smart-formatter");
        const smartContentArea = document.querySelector(".smart-content-area");
        const smartContentAreaWrapper = document.querySelector(".smart-content-area-wrapper");


        //When the document body is loaded 
        //load the essentials
        let smart_options_storage = await localforage.getItem("smart-options-storage");

        smart_options_storage = JSON.parse(smart_options_storage);

        let formatters = smart_options_storage.formatters;

        for(formatter in formatters){

            console.log(formatter)
            if(formatter === "bold"){
                if(smart_options_storage.formatters[formatter].option == true){
                    //console.log("Nah")
                    document.querySelector(".smart-option-bold").style.color = "black";
                    document.querySelector(".smart-option-bold").style.backgroundColor = "white";

                }else{
                    //console.log("Bam")
                    document.querySelector(".smart-option-bold").style.color = "white";
                    document.querySelector(".smart-option-bold").backgroundColor = "black";
                }

            

              
            }


        }


        //Get the Editor Content if you want to do persistence
        // let editorContent = await getEditorContent()
        // if(editorContent != null){
        //     console.log(editorContent);
        // }





        /**
             * Resetting the content to "start typing ..." when clicked from outside 
             *  - when the body tag is clicked, the content of the smartContentArea should be returned to "start typing ..."
         */
        document.body.addEventListener("click", function(event){
                if(smartContentArea.innerText.trim().length == 0){
                    smartContentArea.innerText = "start typing ...";
                }
        }, true);


        //when the smart content area is clicked check if there is any content 
        smartContentArea.addEventListener("click", function(event){

                //console.log(event.target.innerText);
                if(event.target.innerText.trim() === "start typing ..."){
                    //there is nothing in here for now
                    event.target.innerText = "";
                }

            }, true);

            // --------------------------- 


            // -- Typing Event 
            smartContentAreaWrapper.addEventListener("keyup", async function(event){

                let online_content = event.target.innerHTML;

                console.log(online_content);

                //now you can manage this content from here ..
                let smart_options_storage = await getStorage();

                console.log(smart_options_storage);

                //go through the formatters ..
                let formatters = smart_options_storage.formatters;

                //console.log(formatters);
                let new_content;
                let new_content_length = 0;
                let current_tags_options = {
                    'bold' : {
                        in_use: null,
                    }
                }

                for(formatter in formatters){
                    switch(formatter){
                        case "bold":
                            if(smart_options_storage.formatters.bold.option == true){
                                console.log("Currently using bold ...")

                                last_content_length = smart_options_storage.formatters.bold.last_content_length;

                          
                                new_content = `<b>${online_content}</b>`
                                //new_content = bold_formatted_result;
                                //new_content = online_content
                                new_content_length = new_content.length;
                                current_tags_options['bold']['in_use'] = true
                                  
                            }else{


                                console.log("Currently not using bold ...")
                                new_content = online_content;
                                new_content_length = new_content.length
                                current_tags_options['bold']['in_use'] = false



                            }

                    }

                }

            
                
                //Repaint this DOM ...
                //forces a hard repaint ..
                smartContentAreaWrapper.innerHTML = `<div class='smart-content-area' contenteditable>${new_content}</div>`

                //console.log("New Content length: ", new_content_length)
                //force the cursor to the end
                caretHandlerEngine(current_tags_options, new_content)

                //save this to the storage
                await SmartEditorContent.saveEditorContent(new_content)
                


            })





        

        
})





/**
 * This Caret Handler Engine handles positioning of the caret during live update ..
 * - this engine will be rewritten in the future
 * @param {*} content 
 */
function caretHandlerEngine(current_tags_options, content){

    //console.log("Content from handler engine: ", content)
    let content_length = content.length;

    //console.log(content_length);

    //console.log(content_length)
    let range_position = document.createRange();
    let caret_setter = window.getSelection();
   
    if(content_length <= 1){
        //console.log(document.querySelector('.smart-content-area').childNodes[0]);
        range_position.setStart(document.querySelector('.smart-content-area').childNodes[0],  1)
    }else{
        let stripper = document.createElement("div");
        stripper.innerHTML = content

        let stripper_text = stripper.innerText;

        //console.log("Stripper Text: ", stripper_text)

        content_length = stripper_text.length;
        //console.log(document.querySelector('.smart-content-area').childNodes[0].tagName);
        if(document.querySelector(".smart-content-area").childNodes[0].tagName == "B"){
            innerTextContent = document.querySelector(".smart-content-area").childNodes[0].innerText;
            //console.log("Current Tags Options: ", current_tags_options)
            if(current_tags_options.bold.in_use == false){
                //strip away the bold (b) tags
                document.querySelector('.smart-content-area').innerHTML = innerTextContent;
                range_position.setStart(document.querySelector('.smart-content-area').childNodes[0], document.querySelector('.smart-content-area').childNodes.length)
            }else{
                //leave the b tags as they are
                document.querySelector(".smart-content-area").innerHTML = `<b>${innerTextContent}</b>`
                range_position.setStart(document.querySelector('.smart-content-area').childNodes[0], document.querySelector('.smart-content-area').childNodes.length)
            }

            

           
            

        }else{
        
            range_position.setStart(document.querySelector('.smart-content-area').childNodes[0], content_length)

        }
        
    }


    range_position.collapse(true)
    caret_setter.removeAllRanges();
    caret_setter.addRange(range_position);

    document.querySelector('.smart-content-area').focus();
    
}





async function getStorage(){
     //check the options storage
     let smart_options_storage = await localforage.getItem("smart-options-storage");

     return JSON.parse(smart_options_storage);

}




async function initStorage(){
    let smart_options_storage = await localforage.getItem("smart-options-storage");

    if(smart_options_storage == null || typeof smart_options_storage == "undefined"){
        //this storage has not been created 
        //so create it 

        smart_options_storage = {
                formatters : {
                        bold : {
                            "option": false,
                            "last_updated": null,
                            "last_content_length": 0
        
                        },
                        italic : {
                            "option": false,
                            "last_updated": null,
                            "last_content_length": 0
                        },
                        underline : {
                            "option": false,
                            "last_updated" : null,
                            "last_content_length": 0
                        }

                },
                
                last_content_captured: null,
                last_content_length: 0

        }


        //save this to the storage
        smart_options_storage = JSON.stringify(smart_options_storage);

        await localforage.setItem("smart-options-storage", smart_options_storage);

    }
    

}


return {

    boldFormat: SmartFormatters.boldFormat

}



}(new SmartMixer, SmartFormatters)); //Passes the SmartMixer and SmartFormatters to the smartjs core library