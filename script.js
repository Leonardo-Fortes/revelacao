function startCountdown() {
  const targetDate = new Date("2025-04-05T16:00:00").getTime(); // Data final
  const timer = setInterval(function () {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      clearInterval(timer);
      document.querySelector(".countdown-container").innerHTML =
        "<h2>Tempo esgotado!</h2>";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(
      2,
      "0"
    );
    document.getElementById("minutes").textContent = String(minutes).padStart(
      2,
      "0"
    );
    document.getElementById("seconds").textContent = String(seconds).padStart(
      2,
      "0"
    );
  }, 1000);
}

startCountdown();

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByGAfLQHYHECv95f-CN5cNk8Eh0hTS0Qo",
  authDomain: "revelacao-cb353.firebaseapp.com",
  projectId: "revelacao-cb353",
  storageBucket: "revelacao-cb353.firebasestorage.app",
  messagingSenderId: "327865009566",
  appId: "1:327865009566:web:4477abd22bdd45aa93028f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





function vote(option) {
  if (localStorage.getItem("voted")) {
    alert("Você já votou!");
    return;
  }

  const voteRef = doc(db, "votos", "contagem");

  getDoc(voteRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        let data = docSnap.data();
        data[option] = (data[option] || 0) + 1;
        return updateDoc(voteRef, data);
      } else {
        return setDoc(voteRef, { menino: 0, menina: 0, [option]: 1 });
      }
    })
    .then(() => {
      localStorage.setItem("voted", "true"); // Marca que o usuário votou
      alert("Voto registrado!");
      updateButtons();
    })
    .catch((error) => {
      console.error("Erro ao registrar voto:", error);
    });
}
// Função para atualizar os botões com a porcentagem de votos
function updateButtons() {
  console.log("Firestore DB:", db);
  const voteRef = doc(db, "votos", "contagem");

  getDoc(voteRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        let data = docSnap.data();
        let totalVotes = (data.menino || 0) + (data.menina || 0);
        let percentMenino = totalVotes
          ? ((data.menino / totalVotes) * 100).toFixed(1)
          : 0;
        let percentMenina = totalVotes
          ? ((data.menina / totalVotes) * 100).toFixed(1)
          : 0;

        document.getElementById(
          "btnMenino"
        ).textContent = `Menino (${percentMenino}%)`;
        document.getElementById(
          "btnMenina"
        ).textContent = `Menina (${percentMenina}%)`;
      }
    })
    .catch((error) => {
      console.error("Erro ao atualizar os botões:", error);
    });
}


// Registra os votos
document
  .getElementById("btnMenino")
  .addEventListener("click", () => vote("menino"));
document
  .getElementById("btnMenina")
  .addEventListener("click", () => vote("menina"));
// Atualiza os botões quando o DOM for carregado
document.addEventListener("DOMContentLoaded", function () {
  updateButtons();
});

// confirmação presença

function getConfirmedList() {
  return JSON.parse(localStorage.getItem("confirmedList")) || [];
}

function updateConfirmedList() {
  let list = getConfirmedList();
  let listElement = document.getElementById("confirmedList");
  listElement.innerHTML = "";

  list.forEach((name) => {
    let li = document.createElement("li");
    li.textContent = name;
    listElement.appendChild(li);
  });
}

document.getElementById("nameInput").addEventListener("input", function () {
  document.getElementById("confirmButton").disabled = this.value.trim() === "";
});

document.getElementById("confirmButton").addEventListener("click", function () {
  let name = document.getElementById("nameInput").value.trim();
  if (!name) return;

  let list = getConfirmedList();

  // Impede que a mesma pessoa confirme mais de uma vez
  if (list.includes(name)) {
    alert("Este nome já foi confirmado!");
    return;
  }

  list.push(name);
  localStorage.setItem("confirmedList", JSON.stringify(list));

  document.getElementById("nameInput").value = "";
  document.getElementById("confirmButton").disabled = true;

  updateConfirmedList();
});

// Atualiza a lista quando a página carrega
updateConfirmedList();

document
  .getElementById("showListButton")
  .addEventListener("click", function () {
    let password = prompt("Digite a senha para ver a lista:");
    let correctPassword = "050425"; // ALTERE ESSA SENHA!

    if (password === correctPassword) {
      document.getElementById("listTitle").style.display = "block";
      document.getElementById("confirmedList").style.display = "block";
      updateConfirmedList();
    } else {
      alert("Senha incorreta!");
    }
  });
