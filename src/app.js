let input = document.querySelector("#input");
let searchBtn = document.querySelector("#search");
let apiKey = "";
let notFound = document.querySelector(".not_found");
let defBox = document.querySelector(".def");


function loading(isLoading) {
    const loader = document.querySelector(".loading");
    if (isLoading) {
        loader.style.opacity = 1; // Show loader
    } else {
        loader.style.opacity = 0; // Hide loader
    }
}
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Get input data
  let word = input.value;

  // Call API get data
  if (!word || "") {
    alert("word is required.");
    return;
  }

  loading(true); // Start loading
  getData(word).finally(() => loading(false)); // End loading when data fetch is complete
});

async function getData(word) {
  // Ajax call
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  if(!response.ok){
    throw new Error("Error fetching data.")
  }
  const data = await response.json();
  console.log(data);

  if(typeof data[0] === "string"){
    notFound.innerHTML = "No result Found!";
    return
  }

  // if empty result
  if (!data.length) {
    notFound.innerText = `No result found!`;
  }

  // if reuslt is suggestion
  if (typeof data[0] === "string") {
    let heading = document.createElement("h3");
    heading.innerText = `Did you mean?`;
    notFound.appendChild(heading);
    data.forEach((elem) => {
      let suggestion = document.createElement("span");
      suggestion.classList.add("suggested");
      suggestion.innerText = elem;
      notFound.appendChild(suggestion);
    });
  }

  // result found
  function retrieveData(){
    
    document.querySelector(".audioPhonetic").classList.remove("opacity-0");
    document.querySelector(".textPhonetic").innerHTML = data[0].phonetics[1].text;
    document.querySelector(".audioPhonetic").src = data[0].phonetics[1].audio;

    data[0].meanings.map((meaning, id) => {
        let partsOfSpeech = meaning.partOfSpeech;
        let wordDefinitions = meaning.definitions[0].definition;
        console.log(document.querySelectorAll('.partsOfSpeech')[id])
        document.querySelectorAll('.partsOfSpeech')[id].innerHTML =  `
        Parts-of-speeh: ${partsOfSpeech} <br>
         - ${partsOfSpeech} definition: ${wordDefinitions}`;
      });

    data[0].meanings[2].definitions.map((definition, id) => {
        let defPara = document.createElement("p");
        defPara.classList.add("def-para")
        let def = definition.definition;
        let example = definition.example;
        defPara.innerHTML =  `
        ${id+1}: 
        Definition: ${def} <br>
        Example: ${example}</p>
        `;
        document.querySelector('.difinitions-examples').appendChild(defPara);
      });
  }
  retrieveData();



  // Sound
  // if(!sound){
  //     let sound = data[0].hwi.prs[0].sound.audio;
  // }
}
