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


/**
 * Smart Formatter Core Engine 
 */
const SmartFormatters = new function(){
    const smartContentArea = document.querySelector(".smart-content-area");
       
    //activate or deactivate the bold format option
    this.boldFormat = async function(){

            let smart_options_storage = await localforage.getItem("smart-options-storage");

            smart_options_storage = JSON.parse(smart_options_storage);

            if(smart_options_storage.bold.option == true){
                
                //this is currently bold, make it normal
                smart_options_storage.bold.option = false;

                //update the option
                document.querySelector(".smart-option-bold").style.color = "white";
                document.querySelector(".smart-option-bold").style.backgroundColor = "black";
            
            }else{
                //this is currently bold, make it normal
                smart_options_storage.bold.option = true;
                document.querySelector(".smart-option-bold").style.color = "black";
                document.querySelector(".smart-option-bold").style.backgroundColor = "white";


            }

            //get the last index for the entered data in the content area
            let last_content_length = smartContentArea.innerText.length;

           


            
            //get the current item in the editor 
            if(smartContentArea.innerText == "start typing ..."){
                //there is no content
                smartContentArea.innerText = ""
                last_content_length = 0;
                console.log(last_content_length)
            }

            //save this to storage
            smart_options_storage.bold.last_content_length = last_content_length

             //update the time last updated
             smart_options_storage.bold.last_updated = new Date().getTime();

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


        //When the document body is loaded 
        //load the essentials
        let smart_options_storage = await localforage.getItem("smart-options-storage");

        smart_options_storage = JSON.parse(smart_options_storage);

        for(smart_option in smart_options_storage){

            console.log(smart_option)
            if(smart_option === "bold"){
                if(smart_options_storage[smart_option].option == true){
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
            smartContentArea.addEventListener("keyup", async function(event){
                //Check the current options that are activated 

                console.log(event)
                //check the options storage
                let smart_options_storage = await localforage.getItem("smart-options-storage");

                smart_options_storage = JSON.parse(smart_options_storage);

                console.log(smart_options_storage);

                const active_smart_options = [];
                //get the ones that are activated at the moment
                for(smart_option in smart_options_storage){
                    // if(smart_option.option == true){
                    //     //this option is set to 'on' or true
                    //     active_smart_options.push(smart_option);

                    // }

                    // console.log(event.target.innerHTML)
                    switch(smart_option){
                        case "bold":
                            if(smart_options_storage.bold.option == true){
                                // console.log("apply bold")
                                //get the newly added text 
                                last_content_length = smart_options_storage.bold.last_content_length;

                                console.log("Last content: ", last_content_length);

                                //remaining_content = `<strong>Tester</strong>`;
                                remaining_content = `<strong>${event.target.innerText.substring(last_content_length)}</strong>`

                                //event.target.innerHTML
                                console.log("Remaining content: ", remaining_content)

                                //return 'remaining_content'
                                spanElement = document.createElement("span");
                                spanElement.style.fontWeight = "bold";

                               

                                

                                


                            }else{
                                console.log("remove bold")
                            }
                        

                    }



                }


               



               
                


            })



        

        
    })


async function initStorage(){
    let smart_options_storage = await localforage.getItem("smart-options-storage");

    if(smart_options_storage == null || typeof smart_options_storage == "undefined"){
        //this storage has not been created 
        //so create it 

        smart_options_storage = {
                "bold" : {
                    "option": false,
                    "last_updated": null,
                    "last_content_length": 0

                },
                "italic" : {
                    "option": false,
                    "last_updated": null,
                    "last_content_length": 0
                },
                "underline": {
                    "option": false,
                    "last_updated" : null,
                    "last_content_length": 0
                }


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