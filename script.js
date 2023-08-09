// promt: describes the story of Snow White and the Seven Dwarfs through frames and the first word is frame
//Describe the story of Snow White and the Seven Dwarfs through frames and the first word is frame
const dalleEndpoint = 'https://api.openai.com/v1/images/generations';
const endpoint = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
const text =''
const frame = []
const reqButton = document.getElementById('button-request');
const reqButtonImg = document.getElementById('button-requestImg')
const reqStatus = document.getElementById('request-status');
const reqtext = document.getElementById('text');
const apiKey = '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';
reqButton.onclick = function () {
    const prompt = document.getElementById('text-prompt').value;
    const datacontainer = document.getElementById('data');
    axios.post(endpoint, {
       prompt: prompt,
        max_tokens: 3000,
    }, {
      headers: {
      'Authorization': `Bearer ${apiKey}`
    }
    })
    
  .then(response => {
      const data = response.data.choices[0].text;
      datacontainer.insertAdjacentHTML('beforeend', '<p>DONE</p>');
      //let data = document.createElement('p');
      //data = response.data.choices[0].text;
      //datacontainer.appendChild(response.data.choices[0].text)

    //reqtext.innerHTML = response.data.choices[0].text;
    frames = data.split('\n\n')
    .map(frameText => ({
    frameNumber: frameText.split(':')[0].trim().replace('Frame ', ''),
    frameContent: frameText.split(':')[1]
  }));
    console.log(frames)
    //console.log("---------------------------")
    //console.log(response.data.choices[0].text);
  })
    .catch(error => {
    console.error(error);
});
    reqButtonImg.onclick = function () {
      let currentIndex = 1;
      function sendNextRequest () {
        
        if (currentIndex >= frames.length) {
          console.log("Done")
        return;
      }
        const promptDalle = `${frames[currentIndex].frameContent}`;
        console.log(promptDalle)
        //reqButton.disabled = true; 
        reqStatus.innerHTML = "Request started...";
        const reqBody = {
        prompt: 'Drawing like artist Ljungkvist Laura,' + prompt + ",no text in the picture",
        n: 1,
        size: "512x512",
        response_format: 'url',
    };
        const reqParams = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        
        'Authorization': `Bearer ${apiKey}`,
    },
        body: JSON.stringify(reqBody)
    }
        fetch(dalleEndpoint, reqParams)
        .then(res => res.json())
        .then(json => addImages(json, prompt, promptDalle))
        .catch(error => {
          reqStatus.innerHTML = error;
          reqButton.disabled = false;
        })
        .finally(() => {
          currentIndex++;
          setTimeout(sendNextRequest, 1200); 
    });
  }
    sendNextRequest();
}
//create img
  /*for(let i=1; i<frames.length;i++){
    const promptDalle = `${frames[i].frameContent}`;
    console.log(promptDalle)
    //reqButton.disabled = true; 
    reqStatus.innerHTML = "Request started...";
    const reqBody = {
      prompt: 'draw the story fairy tale' + prompt,
      n: 1,
      size: "256x256",
      response_format: 'url',
    };
  const reqParams = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(reqBody)
  }
  fetch(dalleEndpoint, reqParams)
    .then(res => res.json())
    .then(json => addImages(json, prompt))
    .catch(error => {
        reqStatus.innerHTML = error;
        reqButton.disabled = false;
    });
}*/
}

function addImages(jsonData, prompt, frame) {
  reqButton.disabled = false;
  if (jsonData.error)
  {
    reqStatus.innerHTML = 'ERROR: ' + jsonData.error.message;
    return;
  }
  const container = document.getElementById('image-container');
  for (let i = 0; i < jsonData.data.length; i++) {
    let imgData = jsonData.data[i];
    let img = document.createElement('img');
    let text = document.createElement('p')
    img.src = imgData.url;
    img.alt = frame;
    text.textContent = frame;
    container.appendChild(img);
    container.appendChild(text);
  }
  reqStatus.innerHTML =  prompt ;
}