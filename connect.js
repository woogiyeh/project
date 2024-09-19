import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBl4SS089lh3EQSVdiPeNOBNhvWeFkrS3g",
    authDomain: "genshin-39618.firebaseapp.com",
    databaseURL: "https://genshin-39618-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "genshin-39618",
    storageBucket: "genshin-39618.appspot.com",
    messagingSenderId: "360822506418",
    appId: "1:360822506418:web:3f4784abcaf058d3d85aab"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('accountForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const characterData = {
            character: document.getElementById('Character').value,
            named: document.getElementById('Named').value,
            quality: document.getElementById('Quality').value,
            element: document.getElementById('Element').value,
            weapon: document.getElementById('Weapon').value,
            region: document.getElementById('Region').value
        };

        const charactersRef = ref(db, 'characters/');
        const newCharacterRef = push(charactersRef);

        set(newCharacterRef, characterData)
            .then(() => {
                alert('Data saved successfully!');
                document.getElementById('accountForm').reset();
            })
            .catch((error) => {
                console.error('Error saving data: ', error);
                alert('Failed to save data.');
            });
    });

    document.getElementById('download').addEventListener('click', () => {
        const dbRef = ref(db, 'characters/');

        get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log('Fetched data:', data);
                downloadExcel('characters-data.xlsx', data);
            } else {
                alert('No data available for download');
            }
        }).catch((error) => {
            console.error('Error fetching data: ', error.message);
            alert('Failed to fetch data: ' + error.message);
        });
    });

    function downloadExcel(filename, data) {
        const rows = Object.values(data).map(item => ({
            Character: item.character,
            Named: item.named,
            Quality: item.quality,
            Element: item.element,
            Weapon: item.weapon,
            Region: item.region
        }));

        // Ensure XLSX is defined
        if (typeof XLSX === 'undefined') {
            console.error('XLSX library is not loaded');
            alert('Failed to load Excel library.');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Characters");

        // Write the file to the user's system
        XLSX.writeFile(workbook, filename);
    }
});
