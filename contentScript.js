let ChannelId;

const LengthFilterforYouTube = {

  formatDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1].slice(0, -1)) : 0;
    const minutes = match[2] ? parseInt(match[2].slice(0, -1)) : 0;
    const seconds = match[3] ? parseInt(match[3].slice(0, -1)) : 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const formatted = new Date(totalSeconds * 1000).toISOString().substr(11, 8);
    return `Duração: ${formatted.replace(/^00:/, '')}`;
  },

  GetApi: (filter) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://gray-impossible-turkey.cyclic.app/api?id=' + ChannelId + "&type=" + filter);
    xhr.responseType = 'json';
    xhr.onload = function () {
      if (xhr.status === 200) {
        const dados = xhr.response;
        const divisao = dados.data.length / 4;
        const content = document.querySelector("#contents")
        var adicionados = 0;
        for (var dadosz of dados.data) {

          // if(adicionados == 0){
          content.innerHTML += `<div class="video" onclick="window.location.href = 'https://www.youtube.com/watch?v=${dadosz.id}'">
            <div class="video__thumbnail">
              <img style="border-radius: 10px;"src="${dadosz.thumbnail.replace("default.jpg", "hqdefault.jpg")}" alt="">
            </div>
            <div class="video__details">
            
              <div class="title">
                <h3>
                 ${dadosz.title}
                </h3>
                <span>${LengthFilterforYouTube.formatDuration(dadosz.duration)}</span>
              </div>
            </div>
          </div>`
          //  }

        }


        // faça algo com os dados JSON recebidos
      } else {
        console.log('Erro ao carregar os dados: ' + xhr.status);
      }
    };
    xhr.send();
  },

  SetButtons: () => {
    const buttonList = document.querySelector("#chips");
    buttonList.setAttribute("style", "display: flex");

    const shorterButton = document.createElement("div");
    shorterButton.setAttribute("class", "button-yt-more")
    shorterButton.innerHTML = '<div>Mais curtos</div>';

    // Adicione um evento de clique ao botão "Mais curtos"
    shorterButton.addEventListener("click", () => {
      document.querySelector("#contents").innerHTML = ""
      LengthFilterforYouTube.GetApi("short")
      // TODO: Adicionar lógica para filtrar vídeos mais curtos
    });

    const longerButton = document.createElement("div");
    longerButton.setAttribute("class", "button-yt-more")
    longerButton.setAttribute("style", "margin-left: 0px !important;")
    longerButton.innerHTML = '<div>Mais longos</div>';

    // Adicione um evento de clique ao botão "Mais curtos"
    longerButton.addEventListener("click", () => {
      document.querySelector("#contents").innerHTML = ""
      LengthFilterforYouTube.GetApi("longer")
    });

    // Adicione os botões à lista de botões na página
    buttonList.appendChild(shorterButton);
    buttonList.appendChild(longerButton);
  },

  ClickButtonsStyle: () => {

    const buttons = document.querySelectorAll(".button-yt-more");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const chip = document.querySelector("yt-chip-cloud-chip-renderer.style-scope.ytd-feed-filter-chip-bar-renderer.iron-selected");
        if (chip != null) {
          chip.classList.remove("iron-selected");
          chip.removeAttribute("selected");
          chip.setAttribute("aria-selected", "false");
        }


        buttons.forEach((btn) => {
          btn.classList.remove("selected");
        });
        button.classList.add("selected");
      });
    });

  },

  Watch: () => {
    //yt-chip-cloud-chip-renderer
    var dom_observer = new MutationObserver(function (e) {


      console.log('Estou observando')
      LengthFilterforYouTube.SetButtons()


    }); // Start
    dom_observer.observe(document.querySelector(".style-scope.ytd-feed-filter-chip-bar-renderer.iron-selected"), { childList: true, subtree: true });
  }

}

window.addEventListener("load", () => {

  let previousUrl = '';
  //yt-chip-cloud-chip-renderer
  var dom_observer = new MutationObserver(function (e) {
    if (location.href !== previousUrl) {
      previousUrl = location.href;
      setTimeout(function () {
        console.log('Loaded Youtube')
        LengthFilterforYouTube.SetButtons()
        LengthFilterforYouTube.ClickButtonsStyle()
        LengthFilterforYouTube.Watch()

        const meta = document.querySelector("meta[itemprop='channelId']");
        ChannelId = meta.getAttribute("content");
      }, 800)
    }
  }); // Start

  dom_observer.observe(document, { childList: true, subtree: true });

})