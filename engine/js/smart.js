//load in the essential elements
const smartEditor = document.querySelector(".smart-editor");
const smartFormatter = document.querySelector(".smart-formatter");
const smartContentArea = document.querySelector(".smart-content-area");
const smartContentAreaWrapper = document.querySelector(".smart-content-area-wrapper");
const boldOption = document.querySelector(".smart-option-bold");

/**
 * Custom Events
 */
const SmartEvents = ["keyup", "SmartBoldEvent", "SmartItalicEvent", "SmartUnderlineEvent"];
const SmartBoldEvent = new Event("SmartBoldEvent");
const SmartItalicEvent = new Event("SmartItalicEvent");
const SmartUnderlineEvent = new Event("SmartUnderlineEvent");
const SmartEditorLoadedEvent = new Event("SmartEditorLoadedEvent");


//ingore keycodes
const ignoreKeyCodes = [8, 13, 32, 37, 38, 39, 40];
const ignoreKeys = ["CapsLock", "NumsLock", "Tab", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Backspace", "Enter", "Shift", "Alt"]
 

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
// --- End of SmartMixer ---------------------------------------------



// --- SmartStorage -------------------------------------------------
const SmartStorage = function(){

    /**
     * Initializes the storage engine
     */
    this.initStorage = async function(default_options = null){
        
        //check if the storage exists, creates it if it doesnt
        let getSmartOptions = await localforage.getItem("smart-options");

        if(getSmartOptions == null ){
            await localforage.setItem("smart-options", JSON.stringify(default_options));
        }

    }


    this.getFormatStorage = async function(){
        let getSmartFormats = await localforage.getItem("smart-options");

        return JSON.parse(getSmartFormats);

    }

    this.getFormatStatus = async function(format){
        const format_storage = await this.getFormatStorage();

        //console.log("format storage: ", format_storage)

        return format_storage[format]

    }

    this.getLastContent = async function(){
        const format_storage = await this.getFormatStorage();
        return format_storage.last_content;
    }

    this.refreshLastContent = async function(flag){
        const format_storage = this.getFormatStatus();

        if(format_storage != null){
            if(flag === true){
                format_storage.last_content = null;
                format_storage.last_updated = null;
            }
            
        }

        await localforage.setItem("smart-options", JSON.stringify(format_storage));

    }



    this.updateOptionsStorage = async function(format, last_content){
        //console.log("Look up the format: ", format);
        //console.log("Last content: ", last_content)
        //check if bold is active or inactive
        let formatStorage = await this.getFormatStorage();
        if(format === "bold"){
           
            //console.log("Format Storage: ", formatStorage)

            if(formatStorage.bold.currently_active === true){
                //the bold is active, so switch off
                formatStorage.bold.currently_active = false;
            }else{
                //the bold is inactive, so switch on
                formatStorage.bold.currently_active = true;
            }
            formatStorage.bold.last_used = new Date().getTime();
            formatStorage.last_content = last_content;
            formatStorage.last_updated = new Date().getTime();

        }

        //save the formatStorage
        formatStorage = JSON.stringify(formatStorage);

        await localforage.setItem("smart-options", formatStorage);


    }


}


// --- End of SmartStorage ------------------------------------------

/**
 * SmartChannel handles the mode of the editor
 * every character must go through these tunnels
 */
const SmartTunnel = function(){


    this.runTunnel = function(character, smartStorage = null){
     
            //check the modes
            character = this.bold_tunnel(character, smartStorage)
            //character = this.italic_tunnel(character, smartStorage)
            //haracter = this.underline_tunnel(character, smartStorage)






            return character;

    }


    this.bold_tunnel = async function(character, smartStorage){

        //console.log("in the bold tunnel: ", character)

        //check if the bold option is active..
        format_status = await this.is_active_format("bold", smartStorage)
        
        if(format_status.currently_active === true){
            //wrap this character with bold from the last_content
            //split this character if it has <b> already
            
            character = `<b>${character}</b>`
        }


        return character;


    }

    this.italic_tunnel = async function(character, smartStorage){
        console.log("in the italic tunnel: ", character)
        return character;
    }

    this.underline_tunnel = async function(character, smartStorage){
        console.log("in the underline tunnel: ", character)
        return character;
    } 
    
    


    this.is_active_format = async function(format, smartStorage){
       
        //check the status of this format
        let format_status = await smartStorage.getFormatStatus(format)
       
        return format_status;

    }



}


const SmartContentEditor = function(){

    this.insertIntoDOM = function(character, smartStorage){
 
        smartStorage.getLastContent().then((last_content) => {
            
            console.log("Last Content: ", last_content)
            console.log(character)

            if(last_content != null){
                var range = window.getSelection().getRangeAt(0);
                var newElement = document.createElement('span');
                // newElement.id = 'myId';
                newElement.innerHTML += `${character}`
                console.log(range.startContainer.parentNode);
                if(range.startContainer.parentNode.className ==='smart-content-area') {
                    console.log("range: ", range);
                    // delete whatever is on the range
                    // range.deleteContents();
                    
                    // place your span
                    range.insertNode(newElement);
                 }
            }

           

            //balance the caret
            //this.caretEngineHandler(last_content, character);

        })


        

    }


    this.caretEngineHandler = function(last_content, character){
        let range_position = document.createRange();
        let caret_setter = window.getSelection();
        console.log(document.querySelector('.smart-content-area').childNodes.length)

        //if(document.querySelector(".smart-content-area").childNodes[0]){
            range_position.setStart(document.querySelector('.smart-content-area').childNodes[0], 1);
            range_position.collapse(true)
            caret_setter.removeAllRanges();
            caret_setter.addRange(range_position);
        
            document.querySelector('.smart-content-area').focus();
        //}
            

    }




}











const smartjs = (function(smartMixer, smartStorage, smartTunnel, smartContentEditor){


    // - Handle what happens when the page is reloaded 
     


    //when a user is typing, the editor needs to be aware of which mode it is in
    //each character the user types is tricked down a list of modes
    //the modes are configured with a small storage ..

    

    //load the needed dependences
    smartMixer.load_dependencies().then( async (dependencies) => {
        //Now you can use the dependencies here..
        //console.log(dependencies)
        //prepare the storage
        //set the initial options default
        const default_options = {
            "bold": {
                "currently_active": false,
                "last_used": null
            },
            "italic": {
                "currently_active": false,
                "last_used": null
            },
            "underline": {
                "currently_active": false,
                "last_used": null
            },
            "last_updated": null,
            "last_content": null
        }



        //initialize the storage
        smartStorage.initStorage(default_options);

        //or you can call the library(ies) directly, 
        // e,g localforage like this: console.log(localforage)


        //since this page has been loaded
        //remove the last content 
        //await smartStorage.refreshLastContent(true);
            
        //smartContentArea.dispatchEvent(SmartEditorLoadedEvent);


   
        //When typing is going on... each character should trickle down through the SmartTunnel..
        captureTyping();





        function captureTyping(){
            for(SmartEvent of SmartEvents){
                let character = "";
                smartContentArea.addEventListener(SmartEvent, async function(event){
                    if(event.type == "keyup"){
                        console.log(event);
                        //go through the tunnel
                        if( !ignoreKeys.includes(event.key)  ){
    
                            let result = ""; //set the default 
                            result = await smartTunnel.runTunnel(event.key, smartStorage);
                            console.log(result)
                            //then add
                            character = result;
    
    
                        }
                        
                        
                    }else{
                        console.log("Custom Event Triggered");
                        //console.log(event)
    
                        
                        if(event.type == "SmartBoldEvent"){
                            //The Bold Format option has been chosen
                            character = smartContentArea.innerHTML;
                            //console.log(document.querySelector(".smart-content-area-wrapper"))
    
                            //character here represents the accumulation of the characters entered
                            await smartStorage.updateOptionsStorage("bold", character);
                        }
                        
                    
                    }
                    
                    //console.log(character) //
                    //insert this into the DOM with a reference to the last content
                    smartContentEditor.insertIntoDOM(character, smartStorage)
    
                })
                
            }
        }

        
        




        //When a mode/format is clicked
        boldOption.addEventListener("click", function(){
            //the bold option has been clicked
            //trigger the event
            smartContentArea.dispatchEvent(SmartBoldEvent);

        })





    

       

        

        
})






}(new SmartMixer, new SmartStorage, new SmartTunnel, new SmartContentEditor))