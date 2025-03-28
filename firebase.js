(function () {
  // Configuração do Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyByGAfLQHYHECv95f-CN5cNk8Eh0hTS0Qo",
    authDomain: "revelacao-cb353.firebaseapp.com",
    projectId: "revelacao-cb353",
    storageBucket: "revelacao-cb353.firebasestorage.app",
    messagingSenderId: "327865009566",
    appId: "1:327865009566:web:4477abd22bdd45aa93028f",
  };

  // Inicializando o Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Use o Firestore conforme necessário
});
