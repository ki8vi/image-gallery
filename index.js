const KEY = "JbgRtydKxWQE4HTxH7cJLDKCGCrKvZRI0r29qO7AdGU";
const gridArea = document.querySelector(".grid-area");
const input = document.querySelector("input");
const cancelBtn = document.getElementById("cancel-btn");
const form = document.querySelector("form");
const searchBtn = document.getElementById("search-btn");
const mainSide = document.querySelector(".right-side");
const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal-body");
const innerModal = document.querySelector(".inner-modal");
const modalCloseBtn = document.querySelector(".modal-close-btn");
const statBtn = document.querySelector(".stat-btn");
const statBody = document.querySelector(".stat-body");
const statAuthor = document.querySelector(".author");
const statBio = document.querySelector(".bio");
const statDescription = document.querySelector(".descrition");
const statLikes = document.querySelector(".likes");
const statDate = document.querySelector(".date");
const statCloseBtn = document.querySelector(".stat-close-btn");
const remainRequest = document.querySelector(".remain-display");
const fullLink = document.querySelector(".full-link");
const gifWrapper = document.querySelector(".gif-wrapper");
const errorSpan = document.querySelector(".error");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let indexTyping = 0;
let isModalOpen = false;
let isStatOpen = false;
let content;
let requests;
let isError = false;


function fetchData(query) {
  const urlInputQuery = `https://api.unsplash.com/search/photos?query=${query}&per_page=30&client_id=${KEY}`;
    fetch(urlInputQuery)
      .then(response => {
        if (!response.ok) {
          isError = true;
          setTimeout(() => {
            errorSpan.innerText = 'Response is not ok';
            addGif(content)
          }, 500);
          throw new Error('Response is not ok');
        }
          requests = response.headers.get('X-Ratelimit-Remaining');
          isError = false;
          return response.json();
      })
      .then(data => {
          content = data;
          showImage(content);
          selectImage()
          addGif(content);
          remainRequest.innerText = "";
          remainRequest.innerText = `${requests}`;
        })
      .catch(error => {
        console.error('Problem with the fetch:', error);
      });
  }

function showImage(data) {
  gridArea.innerHTML = "";
    data.results.map((el) => {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image';
        const img = document.createElement('img');
        img.src = `${el.urls.regular}`;
        img.alt = `${el.alt_description}`;
        imageWrapper.appendChild(img);
        gridArea.appendChild(imageWrapper);
    });
}

input.addEventListener("input", (e) => {
  e.preventDefault();
  if(e.target.value !== "") {
    cancelBtn.style.opacity = 1;
  } else {
    cancelBtn.style.opacity = 0;
  }
});

cancelBtn.addEventListener("click", () => {
  input.value = "";
  input.focus()
  cancelBtn.style.opacity = 0;
});

searchBtn.addEventListener("click", () => {
  fetchData(input.value)
  
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchData(input.value)
});

function selectImage() {
  const imageArr = document.querySelectorAll(".image");
  imageArr.forEach((el, i) => {
    el.addEventListener("click", () => {
      const selectedImg = el.querySelector("img");
      slider(i, imageArr, selectedImg);
      innerModal.src = "";
      statRender(i);
      innerModal.src = selectedImg.src;
      innerModal.alt = selectedImg.alt;
      if(isModalOpen) {
        isModalOpen = false;
        closeModal();
      } else {
        isModalOpen = true;
        openModal();
      }
    })
  })
}

function openModal() {
  isModalOpen = true;
  modal.classList.add("modal-active");
  setTimeout(() => modal.style.display =  "block");
  setTimeout(() => prevBtn.style.backgroundColor = "#1d1c1c85", 300)
  setTimeout(() => nextBtn.style.backgroundColor = "#1d1c1c85", 600)
  setTimeout(() => prevBtn.style.backgroundColor = "", 600)
  setTimeout(() => nextBtn.style.backgroundColor = "", 900)
  setTimeout(() => {
    statBtn.style.transform = "scale(1.3)";
    setTimeout(() => {
      statBtn.style.transform = "";
    }, 500);
  }, 1000);
}

function closeModal() {
  isModalOpen = false;
  modal.classList.remove("modal-active");
  setTimeout(() => modal.style.display =  "none", 1000);
  closeStat();
  input.focus();
}

statCloseBtn.addEventListener("click", closeStat);
modalBody.addEventListener("click", (e) => {
  if(!statBody.contains(e.target) && !statBtn.contains(e.target) && e.target !== prevBtn && e.target !== nextBtn) {
    closeStat();
  }
});

modal.addEventListener("click", (e) => {
  if(e.target !== innerModal && e.target !== statBtn && !statBody.contains(e.target) && e.target !== prevBtn && e.target !== nextBtn) {
      closeModal();
  }
})
modalCloseBtn.addEventListener("click", closeModal);
statBtn.addEventListener("click", () => {
  if(isStatOpen) {
    isStatOpen = false;
    closeStat();
  } else {
    isStatOpen = true;
    openStat();
  }
});

function openStat() {
  takeWidthHeight();
  isStatOpen = true;
  statBody.classList.add("stat-body-active");
  statBtn.style.backgroundColor = "#a52a2a9b";
};
function closeStat() {
  isStatOpen = false;
  statBody.classList.remove("stat-body-active");
  statBtn.style.backgroundColor = "";
};


document.addEventListener("DOMContentLoaded", () => {
  takeWidthHeight();
  setTimeout(typing, 500);
});

window.addEventListener("load", () => {
  fetchData(randomWord())
});

window.addEventListener("resize", () => {
  takeWidthHeight();
  
});

function typing() {
  let text = "Hello, type here...";
  if (indexTyping < text.length) {
      input.value += text.charAt(indexTyping);
      indexTyping++;
      setTimeout(typing, 100); 
  } else {
    setTimeout(() => {
      input.value = "";
      input.focus();
    }, 200);
  }
}


function takeWidthHeight() {
  modalBody.style.height = mainSide.offsetHeight + "px";
  modalBody.style.width = mainSide.offsetWidth + "px";
  modalBody.style.top = mainSide.offsetTop + "px";
  modalBody.style.left = mainSide.offsetLeft + "px";
  modalBody.style.right = mainSide.offsetRight + "px";
  modalBody.style.bottom = mainSide.offsetBottom + "px";
  statBody.style.maxWidth = mainSide.offsetWidth + "px"
  statBody.style.maxHeight = mainSide.offsetHeight + "px"
}



function addGif(content) {
  if(!content.results.length || isError) {
    setTimeout(() => {
      gifWrapper.style.display = "flex"
      gridArea.style.display = "none";
      gifWrapper.style.opacity = "0.3";
      }, 100);
      indexTyping = 0;
    if(!input.value.length) {
      setTimeout(typing, 100);
      errorSpan.innerText = "empty";
    }
  } else {
    setTimeout(() => {
      gridArea.style.display = "grid";
      gifWrapper.style.display = "none"
      gifWrapper.style.opacity = "0";
    }, 100);
  }
}

function slider(index, arr) {
  let slideIndex = index;
  prevBtn.addEventListener("click", () => {
    slideIndex--;
    if(slideIndex < 0) {
      slideIndex = arr.length - 1;
    }
    innerModal.style.display = "none"
    innerModal.src = arr[slideIndex].querySelector("img").src;
    innerModal.alt = arr[slideIndex].querySelector("img").alt;
    setTimeout(() => {
      innerModal.style.opacity = "1"
      setTimeout(() => {
        innerModal.style.display = "flex";
      })
    }, 10);
    
    statRender(slideIndex);
    });
    nextBtn.addEventListener("click", () => {
    slideIndex++;
    if(slideIndex >= arr.length) {
      slideIndex = 0;
    }
    innerModal.style.display = "none";
    innerModal.src = arr[slideIndex].querySelector("img").src;
    innerModal.alt = arr[slideIndex].querySelector("img").alt;
    setTimeout(() => {
      innerModal.style.opacity = "1"
      setTimeout(() => {
        innerModal.style.display = "flex";
      })
    }, 10);
    statRender(slideIndex);
  });
  
}

function statRender(i) {
  statAuthor.innerText = "";
  statBio.innerText = "";
  statDescription.innerText = "";
  statLikes.innerText = "";
  statDate.innerText = "";
  fullLink.href = "";
  statAuthor.innerText = content.results[i].user.name || "Author did not provide info...";
  statBio.innerText = content.results[i].user.bio || "Author did not provide info...";
  statDescription.innerText = content.results[i].description || "Author did not provide info...";
  statLikes.innerText = content.results[i].likes || "Author did not provide info...";
  const date = new Date(content.results[i].created_at) || "Author did not provide info..."
  statDate.innerText = `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
  fullLink.href = content.results[i].urls.full;
 }



console.log("Все пункты ТЗ выполнены, оценка 60 баллов")









function randomWord() {
  const beautifulPhrases = [
    "Gorgeous sunset", "Lovely flowers", "Stunning landscapes", "Beautiful butterflies", "Charming melodies",
    "Enchanting gardens", "Breathtaking views", "Picturesque scenery", "Exquisite cuisine", "Amazing wildlife",
    "Majestic mountains", "Graceful dancers", "Captivating stories", "Adorable puppies", "Elegant fashion",
    "Peaceful beaches", "Incredible artwork", "Radiant smiles", "Serene waters", "Delightful surprises",
    "Harmonious music", "Vivid colors", "Tranquil gardens", "Dazzling jewels", "Fantastic adventures",
    "Mesmerizing performances", "Whispering winds", "Lively celebrations", "Gentle rainbows", "Awe-inspiring moments",
    "Spectacular sunrises", "Heartfelt poetry", "Delicate snowflakes", "Brilliant stars", "Caring friendships",
    "Sparkling laughter", "Golden beaches", "Beautiful horizons", "Peaceful meadows", "Enchanted forests",
    "Delicious desserts", "Radiant sunsets", "Vibrant gardens", "Tranquil lakes", "Cherished memories",
    "Elegant sunsets", "Whimsical dreams", "Captivating sunsets", "Gentle sunrises", "Eternal love", "Twinkling stars",
    "Serene sunsets", "Magical moments", "Crystal-clear waters", "Wonderful vacations", "Dreamy landscapes",
    "Joyful laughter", "Lively festivals", "Refreshing rainbows", "Breathtaking sunsets", "Harmonious sunrises",
    "Glistening snowflakes", "Soothing lullabies", "Charming sunsets", "Adventurous journeys", "Mystical adventures",
    "Calm oceans", "Majestic sunsets"];
  const randomNumber = Math.floor(Math.random() * beautifulPhrases.length); 
  return beautifulPhrases[randomNumber];
}