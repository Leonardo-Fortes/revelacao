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
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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

document.getElementById("nameInput").addEventListener("input", function () {
  document.getElementById("confirmButton").disabled = this.value.trim() === "";
});

// Função para confirmar presença
async function confirmarPresenca() {
  let name = document.getElementById("nameInput").value.trim();
  if (!name) {
    alert("Digite seu nome antes de confirmar presença!");
    return;
  }

  try {
    // Adiciona um novo documento na coleção "confirmados"
    await addDoc(collection(db, "confirmados"), { nome: name });

    // Limpa o campo de entrada e desabilita o botão após confirmação
    document.getElementById("nameInput").value = "";
    document.getElementById("confirmButton").disabled = true;

    alert(`${name}, sua presença foi confirmada!`);
  } catch (error) {
    console.error("Erro ao confirmar presença:", error);
  }
}

document.getElementById("confirmButton").addEventListener("click", confirmarPresenca);

// Função para exibir a lista de presença
async function mostrarLista() {
  let password = prompt("Digite a senha para ver a lista:");
  let correctPassword = "050425"; // Alterar para a sua senha

  if (password !== correctPassword) {
    alert("Senha incorreta!");
    return;
  }

  try {
    // Obtém todos os documentos da coleção "confirmados"
    const querySnapshot = await getDocs(collection(db, "confirmados"));
    let listElement = document.getElementById("confirmedList");
    listElement.innerHTML = ""; // Limpa a lista atual

    // Itera sobre os documentos da coleção
    querySnapshot.forEach((doc) => {
      let li = document.createElement("li");
      li.textContent = doc.data().nome; // Exibe o nome do participante
      listElement.appendChild(li);
    });

    document.getElementById("listTitle").style.display = "block";
    listElement.style.display = "block";
  } catch (error) {
    console.error("Erro ao buscar lista de presença:", error);
  }
}


document.getElementById("showListButton").addEventListener("click", mostrarLista);
