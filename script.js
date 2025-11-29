// Messages fixes pour chaque case (modifiez le texte entre guillemets)
const caseMessages = {
    1: "Tien ?! Vein est dans cette case !",
    2: "Un petit carton dans cette case ??",
    3: "Un bon pour une après midi shopping !",
    4: "Balade entre chique !",
    5: "Youyouyou ! The survivalist est dans cette case!",
    6: "Et hop ! 15 minutes de papouilles !",
    7: "Un bon pour une yes day !",
    8: "Choisi un film Ghibli que tu aimerais qu'on regarde ensemble !",
    9: "Balade entre chique !",
    10: "Let's do sport togetheeer !",
    11: "Bon pour un petit jeu style gartic phone ou play clouds !",
    12: "Moulons nos mains !",
    13: "Choisi n'importe quel film que tu aimerais qu'on regarde ensemble !",
    14: "Rendez vous au tribunal !",
    15: "Sac à post it !",
    16: "Faisons n jeu de société !",
    17: "Choisi n'importe quelle série !",
    18: "Bon pour faire un gateau !",
    19: "Rendez vous au cinéma !",
    20: "Regardons la star académie !",
    21: "Et si nous faisions une chanson ensemble ?",
    22: "Bon pour un restaurant !",
    23: "Bon pour faire un gateau !"
};

let porte = null;
let maison = null;
let calendrier = null;

// State persisted in localStorage under 'avent_state'
// { opened: [1,2], messages: { '3':'msg used for case 3' } }
function loadState() {
    try {
        const raw = localStorage.getItem('avent_state');
        return raw ? JSON.parse(raw) : { opened: [], messages: {} };
    } catch (e) {
        return { opened: [], messages: {} };
    }
}

function saveState(state) {
    localStorage.setItem('avent_state', JSON.stringify(state));
}

let state = loadState();

// Normalize any previously-saved width/height percentages to safe bounds
(function normalizeStoredSizes(){
    try {
        const minPct = 4, maxPct = 80;
        if (!state) return;
        if (state.specialText) {
            if (typeof state.specialText.widthPct === 'number') state.specialText.widthPct = Math.min(Math.max(state.specialText.widthPct, minPct), maxPct);
            if (typeof state.specialText.heightPct === 'number') state.specialText.heightPct = Math.min(Math.max(state.specialText.heightPct, minPct), maxPct);
        }
        if (state.specialText2) {
            if (typeof state.specialText2.widthPct === 'number') state.specialText2.widthPct = Math.min(Math.max(state.specialText2.widthPct, minPct), maxPct);
            if (typeof state.specialText2.heightPct === 'number') state.specialText2.heightPct = Math.min(Math.max(state.specialText2.heightPct, minPct), maxPct);
        }
        try { saveState(state); } catch(e) {}
    } catch (e) {}
})();

// If positions are missing or incomplete, populate with the provided default layout
(function ensureDefaultPositions(){
    try {
        const need = !state.positions || Object.keys(state.positions).length < 24;
        if (!need) return;
        state.positions = {
            "1": { "left": 11.57, "top": 15.08, "sizeRatio": 0.105 },
            "2": { "left": 9.57, "top": 93.35, "sizeRatio": 0.105 },
            "3": { "left": 89.29, "top": 11.95, "sizeRatio": 0.105 },
            "4": { "left": 39.57, "top": 19.92, "sizeRatio": 0.105 },
            "5": { "left": 28.43, "top": 53.79, "sizeRatio": 0.105 },
            "6": { "left": 10.71, "top": 67.74, "sizeRatio": 0.105 },
            "7": { "left": 11.57, "top": 39.56, "sizeRatio": 0.105 },
            "8": { "left": 73.44, "top": 16.16, "sizeRatio": 0.105 },
            "9": { "left": 24.71, "top": 68.59, "sizeRatio": 0.105 },
            "10": { "left": 84.71, "top": 92.78, "sizeRatio": 0.105 },
            "11": { "left": 91.29, "top": 57.49, "sizeRatio": 0.105 },
            "12": { "left": 43.86, "top": 33.87, "sizeRatio": 0.105 },
            "13": { "left": 24.14, "top": 91.07, "sizeRatio": 0.105 },
            "14": { "left": 87.57, "top": 33.87, "sizeRatio": 0.105 },
            "15": { "left": 38.43, "top": 66.31, "sizeRatio": 0.105 },
            "16": { "left": 47.73, "top": 49.28, "sizeRatio": 0.105 },
            "17": { "left": 24.71, "top": 19.64, "sizeRatio": 0.105 },
            "18": { "left": 85.29, "top": 73.43, "sizeRatio": 0.105 },
            "19": { "left": 71.57, "top": 43.55, "sizeRatio": 0.105 },
            "20": { "left": 57.86, "top": 83.11, "sizeRatio": 0.105 },
            "21": { "left": 10.14, "top": 52.37, "sizeRatio": 0.105 },
            "22": { "left": 57, "top": 20.21, "sizeRatio": 0.105 },
            "23": { "left": 35.57, "top": 82.54, "sizeRatio": 0.105 },
            "24": { "left": 76.01, "top": 53.76, "sizeRatio": 0.15750000000000003 }
        };
        try { saveState(state); } catch(e) {}
    } catch (e) {}
})();

// Suppression de la fonction d'édition/sauvegarde directe des textes spéciaux.
 
// --- Gestion du texte cartoon modifiable, position, taille, persistance ---
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer les éléments DOM une fois le document prêt
    porte = document.getElementById("porte");
    maison = document.getElementById("maison");
    calendrier = document.getElementById("calendrier");
    
    // Mettre l'opacité de la porte à 0 et sauvegarder
    if (porte) {
        porte.style.opacity = '0';
        state.doorOpacity = 0;
        saveState(state);
    }
    
    const customText = document.getElementById('customText');
    if (customText) {
        // Appliquer l'état sauvegardé mais désactiver toute édition/drag/resize
        const t = state.customText || {};
        if (t.value) customText.textContent = t.value;
        if (t.left != null && t.top != null) {
            customText.style.left = t.left + '%';
            customText.style.top = t.top + '%';
            customText.style.transform = 'translate(-50%, 0)';
        }
        if (t.width) customText.style.width = t.width;
        if (t.height) customText.style.height = t.height;
    }

    // Définir l'opacité des cases à 1 par défaut
    document.documentElement.style.setProperty('--case-opacity', '1');
    
    // Listener d'ouverture de la porte (zoom -> entrer dans la maison)
    if (porte) {
        porte.addEventListener("click", function() {
            if (!calendrier) return;
            // Empêcher double entrée
            if (calendrier.style.display === 'block') {
                console.log('[PORTE] Clic ignoré, déjà à l\'intérieur');
                return;
            }
            console.log('[PORTE] Clic accepté, lancement transition');

            // Jouer le son d'ouverture de porte si disponible
            const doorAudio = document.getElementById('doorAudio');
            if (doorAudio) {
                try { doorAudio.currentTime = 0; doorAudio.play(); } catch(e){}
            }

            // Ajouter effet de zoom sur la porte
            porte.classList.add("zoom");

            // Afficher l'écran noir immédiatement puis attendre 2.5s
            const black = document.getElementById('blackScreen');
            if (black) black.classList.add('visible');

            // Tempo de 2500ms (2.5s) avant d'entrer dans la maison
            setTimeout(() => {
                if (maison) maison.style.display = "none";
                if (calendrier) calendrier.style.display = "block";
                afficherImageInterieur();
                genererCases();

                // Laisser un bref fondu puis retirer l'écran noir
                if (black) {
                    setTimeout(() => { black.classList.remove('visible'); }, 200);
                }
            }, 2500);
        });
    }

    // Apply persisted door position if present (maintenir après assignation de `porte`)
    if (typeof applyDoorPosition === 'function') applyDoorPosition();

    // Apply fullscreen house on mobile widths (appel initial et attachement du resize)
    if (typeof applyMaisonFullscreenIfMobile === 'function') {
        applyMaisonFullscreenIfMobile();
        window.addEventListener('resize', applyMaisonFullscreenIfMobile);
    }

    // Appliquer et sauvegarder les positions importées seulement si l'utilisateur n'a pas
    // déjà des positions sauvegardées (évite d'écraser à chaque chargement)
    if (typeof importedPositionsPayload !== 'undefined' && (!state.positions || Object.keys(state.positions).length === 0)) {
        state.positions = importedPositionsPayload;
        saveState(state);
        // Si l'intérieur est déjà affiché, regénérer immédiatement
        const existingImg = calendrier ? calendrier.querySelector('img.interieur') : null;
        if (existingImg && existingImg.complete) {
            genererCases();
        } else if (existingImg) {
            existingImg.addEventListener('load', genererCases, { once: true });
        }
    }
});

// Apply persisted door position if present
function applyDoorPosition() {
    if (state.doorPos && state.doorPos.left != null && state.doorPos.top != null) {
        porte.style.position = 'absolute';
        porte.style.left = state.doorPos.left + '%';
        porte.style.top = state.doorPos.top + '%';
        const scale = (state.doorSize != null) ? state.doorSize : 1;
        porte.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
}
function applyMaisonFullscreenIfMobile() {
    const mobileThreshold = 600; // px, same threshold as interior logic
    const should = window.innerWidth <= mobileThreshold;
    if (should) {
        maison.classList.add('fullscreen-house');
        // prevent body scroll while home is fullscreen
        document.documentElement.style.overflow = 'hidden';
    } else {
        maison.classList.remove('fullscreen-house');
        document.documentElement.style.overflow = '';
    }
}

// --- Import des positions fournies par l'utilisateur (appliquer une fois) ---
// Ces positions proviennent de la demande: elles remplaceront les positions existantes.
const importedPositionsPayload = {
    "1": {"left":11.57, "top":15.08, "sizeRatio":0.10500000000000001},
    "2": {"left":9.57, "top":93.35, "sizeRatio":0.10500000000000001},
    "3": {"left":89.29, "top":11.95, "sizeRatio":0.10500000000000001},
    "4": {"left":39.57, "top":19.92, "sizeRatio":0.10500000000000001},
    "5": {"left":28.43, "top":53.79, "sizeRatio":0.10500000000000001},
    "6": {"left":10.71, "top":67.74, "sizeRatio":0.10500000000000001},
    "7": {"left":11.57, "top":39.56, "sizeRatio":0.10500000000000001},
    "8": {"left":72.14, "top":23.91, "sizeRatio":0.10500000000000001},
    "9": {"left":24.71, "top":68.59, "sizeRatio":0.10500000000000001},
    "10": {"left":84.71, "top":92.78, "sizeRatio":0.10500000000000001},
    "11": {"left":91.29, "top":57.49, "sizeRatio":0.10500000000000001},
    "12": {"left":43.86, "top":33.87, "sizeRatio":0.10500000000000001},
    "13": {"left":24.14, "top":91.07, "sizeRatio":0.10500000000000001},
    "14": {"left":87.57, "top":33.87, "sizeRatio":0.10500000000000001},
    "15": {"left":38.43, "top":66.31, "sizeRatio":0.10500000000000001},
    "16": {"left":73.29, "top":61.48, "sizeRatio":0.10500000000000001},
    "17": {"left":24.71, "top":19.64, "sizeRatio":0.10500000000000001},
    "18": {"left":85.29, "top":73.43, "sizeRatio":0.10500000000000001},
    "19": {"left":71.57, "top":43.55, "sizeRatio":0.10500000000000001},
    "20": {"left":57.86, "top":83.11, "sizeRatio":0.10500000000000001},
    "21": {"left":10.14, "top":52.37, "sizeRatio":0.10500000000000001},
    "22": {"left":57, "top":20.21, "sizeRatio":0.10500000000000001},
    "23": {"left":35.57, "top":82.54, "sizeRatio":0.10500000000000001},
    "24": {"left":58.71, "top":62.61, "sizeRatio":0.15750000000000003}
};

// Le payload `importedPositionsPayload` est défini ci-dessus.
// Son application est réalisée plus bas, une fois le DOM prêt.
// Fin import

// Compute available messages by removing already-used messages saved in state.messages
// Fonction obsolète, maintenant les messages sont fixes par case

// (Handler de la porte déplacé dans DOMContentLoaded)

function afficherImageInterieur() {
    if (calendrier.querySelector('img.interieur')) return; // déjà ajoutée
    // Crée un wrapper qui contient l'image et l'overlay pour les cases
    let wrapper = calendrier.querySelector('.interior-wrapper');
    if (!wrapper) wrapper = document.createElement('div');
    wrapper.className = 'interior-wrapper';

    const img = document.createElement('img');
    img.className = 'interieur';
    img.src = 'Interieurmaison.png'; // Mets ici le nom de ton image (assure-toi que le fichier existe)
    img.alt = 'Intérieur de la maison';
    // overlay pour placer les cases par-dessus l'image
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    // ajouter image et overlay dans le wrapper puis wrapper dans calendrier
    wrapper.appendChild(img);
    wrapper.appendChild(overlay);
    calendrier.appendChild(wrapper);

    // Si écran mobile (petite largeur), mettre le wrapper en full-bleed pour coller aux bordures
    function applyFullscreenIfMobile() {
        const mobileThreshold = 600; // px
        const should = window.innerWidth <= mobileThreshold;
        if (should) {
            wrapper.classList.add('fullscreen');
            img.classList.add('fullscreen');
            overlay.classList.add('fullscreen');
            // prevent body scroll when fullscreen
            document.documentElement.style.overflow = 'hidden';
        } else {
            wrapper.classList.remove('fullscreen');
            img.classList.remove('fullscreen');
            overlay.classList.remove('fullscreen');
            document.documentElement.style.overflow = '';
        }
    }
    applyFullscreenIfMobile();
    window.addEventListener('resize', applyFullscreenIfMobile);
    
    // Jouer le son de cheminée en boucle
    const chemineeAudio = document.getElementById('chemineeAudio');
    if (chemineeAudio) {
        chemineeAudio.currentTime = 0;
        chemineeAudio.volume = 0.6; // Volume à 60%
        chemineeAudio.play().then(() => {
            console.log('Son de cheminée démarré');
        }).catch(e => {
            console.log('Impossible de lire le son de cheminée:', e);
        });
    }
}

function genererCases() {
    // Conserver le wrapper et l'overlay
    const interiorWrapper = calendrier.querySelector('.interior-wrapper');
    if (!interiorWrapper) return; // rien à faire
    const overlay = interiorWrapper.querySelector('.overlay');
    // vider l'overlay
    overlay.innerHTML = '';

    // Génération aléatoire des positions et tailles (persistées)
    state.positions = state.positions || {};

    // dimensions du wrapper pour convertir ratio -> pixels
    const wrapperRect = interiorWrapper.getBoundingClientRect();
    const wrapperWidth = wrapperRect.width || window.innerWidth;

    for (let i = 1; i <= 24; i++) {
        // créer position si inexistante
        if (!state.positions[i]) {
            // éviter les bords : marge en pourcentage
            const margin = 8; // %
            const left = Math.round((Math.random() * (100 - margin * 2) + margin) * 100) / 100;
            const top = Math.round((Math.random() * (100 - margin * 2) + margin) * 100) / 100;
            // taille ratio relative à la largeur du wrapper
            const minRatio = 0.08; // 8% of width
            const maxRatio = 0.14; // 14% of width
            let sizeRatio = Math.random() * (maxRatio - minRatio) + minRatio;
            if (i === 24) sizeRatio *= 1.5; // la case 24 un peu plus grosse
            state.positions[i] = { left, top, sizeRatio };
        }

        const pos = state.positions[i];

        // Créer le bouton case directement avec le numéro dedans
        const caseDiv = document.createElement('button');
        caseDiv.type = 'button';
        caseDiv.className = 'case';
        caseDiv.textContent = i;
        caseDiv.dataset.index = i;
        
        // Position et taille
        caseDiv.style.position = 'absolute';
        caseDiv.style.left = pos.left + '%';
        caseDiv.style.top = pos.top + '%';
        caseDiv.style.transform = 'translate(-50%, -50%)';
        
        // calcul taille en px selon la largeur actuelle
        const sizePx = Math.max(28, Math.round(pos.sizeRatio * wrapperWidth));
        caseDiv.style.width = sizePx + 'px';
        caseDiv.style.height = sizePx + 'px';
        caseDiv.style.fontSize = Math.max(12, Math.round(sizePx * 0.45)) + 'px';

        // si déjà ouvert dans l'état, marquer
        if ((state.opened || []).includes(i)) {
            caseDiv.classList.add('ouverte');
            caseDiv.setAttribute('data-open','true');
        }
        
        caseDiv.addEventListener('click', function (ev) {
            ev.stopPropagation();
            const idxNum = parseInt(this.dataset.index, 10);
            if (this.classList.contains('ouverte') || this.classList.contains('opening')) return;

            // Vérifier l'ordre séquentiel : on ne peut ouvrir que la case suivante
            const openedCases = state.opened || [];
            const maxOpened = openedCases.length > 0 ? Math.max(...openedCases) : 0;
            const nextExpected = maxOpened + 1;
            
            if (idxNum !== nextExpected) {
                // Case cliquée dans le désordre - afficher un message
                showOrderWarning(idxNum, nextExpected);
                return;
            }

            // Jouer le son de clic sur la case
            const caseAudioEl = document.getElementById('caseAudio');
            if (caseAudioEl) {
                try { 
                    caseAudioEl.currentTime = 0; 
                    caseAudioEl.play(); 
                } catch(e){}
            }

            // lancer l'animation d'ouverture (1s)
            this.classList.add('opening');

            const onEnd = () => {
                this.removeEventListener('animationend', onEnd);
                this.classList.remove('opening');
                this.classList.add('ouverte');
                this.setAttribute('data-open','true');

                // Récupérer le message fixe pour cette case
                const msg = caseMessages[idxNum] || 'Joyeux Noël !';

                // enregistrer dans l'état
                state.opened = Array.from(new Set([...(state.opened || []), idxNum]));
                state.messages = state.messages || {};
                state.messages[idxNum] = msg;
                saveState(state);

                // Si c'est la case 24, afficher l'image spéciale en plein écran
                if (Number(idxNum) === 24) {
                    try {
                        // try to play the special audio if present
                        const specialAudio = document.getElementById('specialAudio');
                        if (specialAudio) {
                            try { specialAudio.currentTime = 0; specialAudio.play(); } catch(e){}
                        }
                        if (typeof showSpecialImage === 'function') showSpecialImage('joliecieltotoro.png');
                        else window.open('joliecieltotoro.png', '_blank');
                    } catch (e) {
                        // fallback : ouvrir dans un nouvel onglet si quelque chose se passe mal
                        try { window.open('joliecieltotoro.png', '_blank'); } catch(_){ }
                    }
                } else {
                    // Pour les autres cases : écran noir immédiat + son coffre + attendre 2.5s + message
                    showBlackScreenWithDelay(msg, idxNum);
                }
            };

            this.addEventListener('animationend', onEnd);
        });

        overlay.appendChild(caseDiv);
    }

    // sauvegarder positions si nouvellement générées
    saveState(state);

    // afficher le dernier message ouvert si présent
    const lastOpened = (state.opened || []).slice(-1)[0];
    if (lastOpened && state.messages && state.messages[lastOpened]) {
        afficherMessage(state.messages[lastOpened]);
    }
}

// Wrapper to reproduce the door entry tempo for the special image:


function afficherMessage(msg) {
    let msgDiv = document.querySelector('.message');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.className = 'message';
        calendrier.parentNode.insertBefore(msgDiv, calendrier.nextSibling);
    }
    msgDiv.textContent = msg;
}

// Fonction pour afficher un avertissement si l'ordre n'est pas respecté
function showOrderWarning(clickedCase, expectedCase) {
    const warning = document.createElement('div');
    warning.style.position = 'fixed';
    warning.style.top = '50%';
    warning.style.left = '50%';
    warning.style.transform = 'translate(-50%, -50%)';
    warning.style.background = 'rgba(0,0,0,0.9)';
    warning.style.color = '#fff';
    warning.style.padding = '25px 35px';
    warning.style.borderRadius = '15px';
    warning.style.textAlign = 'center';
    warning.style.zIndex = '11000';
    warning.style.fontFamily = "'Great Vibes', cursive";
    warning.style.fontSize = 'clamp(1.2rem, 4vw, 1.8rem)';
    warning.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
    warning.style.opacity = '0';
    warning.style.transition = 'opacity 0.3s ease';
    warning.style.maxWidth = '85%';
    warning.innerHTML = `Ouvre d'abord la case ${expectedCase} ! 🎄`;
    
    document.body.appendChild(warning);
    
    requestAnimationFrame(() => {
        warning.style.opacity = '1';
    });
    
    setTimeout(() => {
        warning.style.opacity = '0';
        setTimeout(() => {
            if (warning.parentNode) warning.parentNode.removeChild(warning);
        }, 300);
    }, 2000);
}

// Fonction pour afficher l'écran noir, jouer le son coffre, attendre 2.5s puis afficher le message
function showBlackScreenWithDelay(msg, caseNumber) {
    // Créer écran noir immédiat
    const blackOverlay = document.createElement('div');
    blackOverlay.style.position = 'fixed';
    blackOverlay.style.inset = '0';
    blackOverlay.style.background = '#000';
    blackOverlay.style.zIndex = '9999';
    blackOverlay.style.opacity = '0';
    blackOverlay.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(blackOverlay);
    
    // Afficher écran noir immédiatement
    requestAnimationFrame(() => {
        blackOverlay.style.opacity = '1';
    });
    
    // Jouer son coffre
    const coffreAudioEl = document.getElementById('coffreAudio');
    if (coffreAudioEl) {
        try { 
            coffreAudioEl.currentTime = 0; 
            coffreAudioEl.play(); 
        } catch(e){}
    }
    
    // Attendre 2.5s puis afficher le message
    setTimeout(() => {
        // Retirer l'écran noir temporaire
        if (blackOverlay.parentNode) {
            blackOverlay.parentNode.removeChild(blackOverlay);
        }
        // Afficher le message avec l'écran de message complet
        showMessageScreen(msg, caseNumber);
    }, 2500);
}

// Fonction pour afficher l'écran noir avec le message
function showMessageScreen(msg, caseNumber) {
    // Créer l'overlay noir
    const overlay = document.createElement('div');
    overlay.className = 'message-screen-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = '#000';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10000';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease';
    
    // Texte du message
    const messageText = document.createElement('div');
    messageText.className = 'message-screen-text';
    messageText.textContent = msg;
    messageText.style.color = '#fff';
    messageText.style.fontSize = 'clamp(1.5rem, 4vw, 2.5rem)';
    messageText.style.fontFamily = "'Great Vibes', cursive";
    messageText.style.textAlign = 'center';
    messageText.style.padding = '20px';
    messageText.style.maxWidth = '80%';
    messageText.style.textShadow = '0 0 20px rgba(255,255,255,0.8)';
    messageText.style.marginBottom = '40px';
    messageText.style.opacity = '0';
    messageText.style.transform = 'scale(0.8)';
    messageText.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
    
    // Bouton retour
    const backButton = document.createElement('button');
    backButton.textContent = 'Retour';
    backButton.className = 'message-back-button';
    backButton.style.padding = '12px 30px';
    backButton.style.fontSize = '1.2rem';
    backButton.style.background = 'rgba(255,255,255,0.9)';
    backButton.style.border = '2px solid #fff';
    backButton.style.borderRadius = '8px';
    backButton.style.color = '#333';
    backButton.style.cursor = 'pointer';
    backButton.style.fontFamily = "'Segoe UI', Arial, sans-serif";
    backButton.style.fontWeight = 'bold';
    backButton.style.transition = 'all 0.3s ease';
    backButton.style.opacity = '0';
    backButton.style.transform = 'translateY(20px)';
    backButton.style.transitionDelay = '0.6s';
    
    backButton.addEventListener('mouseenter', () => {
        backButton.style.background = '#fff';
        backButton.style.transform = 'translateY(20px) scale(1.05)';
    });
    backButton.addEventListener('mouseleave', () => {
        backButton.style.background = 'rgba(255,255,255,0.9)';
        backButton.style.transform = 'translateY(20px) scale(1)';
    });
    
    backButton.addEventListener('click', () => {
        // Animation de sortie
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 500);
    });
    
    overlay.appendChild(messageText);
    overlay.appendChild(backButton);
    document.body.appendChild(overlay);
    
    // Déclencher les animations d'entrée
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        setTimeout(() => {
            messageText.style.opacity = '1';
            messageText.style.transform = 'scale(1)';
            backButton.style.opacity = '1';
            backButton.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Permettre de fermer avec Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            backButton.click();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Animation des flocons (clé conservée)
const styleSheet = document.createElement("style");
styleSheet.textContent = `@keyframes fall{0%{transform:translateY(0);}100%{transform:translateY(100vh);}}`;
document.head.appendChild(styleSheet);

// Optional: fonction pour réinitialiser l'état (utile pour debug)
window.aventReset = function() {
    state = { opened: [], messages: {} };
    saveState(state);
    location.reload();
};

// Suppression des contrôles de placement / randomisation / reset.

// Attach listeners to editor buttons (if present)

// Affiche une image spéciale en plein écran (comportement: nouvelle pièce, pas overlay)
function showSpecialImage(src) {
    if (document.querySelector('.special-room-wrapper')) return;
    // Contenu spécial statique (initialisation si absent)
    if (src && src.toLowerCase().indexOf('joliecieltotoro') !== -1) {
        // Initialiser uniquement si complètement absent
        if (!state.specialText) {
            state.specialText = {
                value: "Tu est la plus belle chose qui me soit jamais arrivé ! Je t'aime mon amour de chaton, Joyeux Noël !",
                left: 59.6905,
                top: 5.15111,
                fontSize: 43
            };
        }
        // S'assurer que value existe
        if (!state.specialText.value) {
            state.specialText.value = "Tu est la plus belle chose qui me soit jamais arrivé ! Je t'aime mon amour de chaton, Joyeux Noël !";
        }
        
        if (!state.specialText2) {
            state.specialText2 = {
                value: '"You and me belong together"',
                left: 27.9763,
                top: 94.5143,
                fontSize: 19
            };
        }
        // S'assurer que value existe
        if (!state.specialText2.value) {
            state.specialText2.value = '"You and me belong together"';
        }
    }
    const overlay = document.createElement('div');
    overlay.className = 'interior-wrapper special-room-wrapper';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    const card = document.createElement('div');
    card.className = 'special-card';
    const img = document.createElement('img');
    img.className = 'interieur';
    img.src = src;
    img.alt = 'Image';
    // Créer un conteneur pour le texte avec poignées de redimensionnement
    const t1Container = document.createElement('div');
    t1Container.className = 'text-box-container';
    t1Container.style.position = 'absolute';
    t1Container.style.left = (state.specialText && state.specialText.left != null ? state.specialText.left : 59.6905) + '%';
    t1Container.style.top = (state.specialText && state.specialText.top != null ? state.specialText.top : 5.15111) + '%';
    t1Container.style.width = (state.specialText && state.specialText.width != null ? state.specialText.width : 300) + 'px';
    t1Container.style.minHeight = '50px';
    t1Container.style.border = '2px solid rgba(255,255,255,0.5)';
    t1Container.style.background = 'rgba(0,0,0,0)';
    t1Container.style.borderRadius = '8px';
    t1Container.style.padding = '10px';
    t1Container.style.boxSizing = 'border-box';
    t1Container.style.cursor = 'move';
    t1Container.style.zIndex = '2';
    
    const t1 = document.createElement('div');
    t1.className = 'special-text-content';
    t1.textContent = (state.specialText && state.specialText.value) || '';
    t1.style.color = '#ffffff';
    t1.style.fontFamily = "'Great Vibes', cursive";
    t1.style.fontSize = (state.specialText && state.specialText.fontSize != null ? state.specialText.fontSize : 43) + 'px';
    t1.style.textShadow = '0 0 10px rgba(255,255,255,0.9), 0 4px 12px rgba(0,0,0,0.45)';
    t1.style.wordWrap = 'break-word';
    t1.style.userSelect = 'none';
    t1.contentEditable = false;
    
    // Poignée de redimensionnement (coin bas-droit)
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '-5px';
    resizeHandle.style.bottom = '-5px';
    resizeHandle.style.width = '12px';
    resizeHandle.style.height = '12px';
    resizeHandle.style.background = '#ffffff';
    resizeHandle.style.border = '1px solid #333';
    resizeHandle.style.borderRadius = '2px';
    resizeHandle.style.cursor = 'nwse-resize';
    resizeHandle.style.zIndex = '10';
    
    t1Container.appendChild(t1);
    // Masquer la poignée de redimensionnement (verrouillé)
    resizeHandle.style.display = 'none';
    t1Container.appendChild(resizeHandle);
    
    // Verrouillé : pas de drag ni resize
    t1Container.style.cursor = 'default';
    t1Container.style.border = 'none';
    t1Container.style.pointerEvents = 'none';
    const t2 = document.createElement('div');
    t2.className = 'special-text small';
    t2.textContent = (state.specialText2 && state.specialText2.value) || '';
    t2.style.left = (state.specialText2 && state.specialText2.left != null ? state.specialText2.left : 27.9763) + '%';
    t2.style.top = (state.specialText2 && state.specialText2.top != null ? state.specialText2.top : 94.5143) + '%';
    t2.style.fontSize = (state.specialText2 && state.specialText2.fontSize != null ? state.specialText2.fontSize : 19) + 'px';
    t2.style.background = 'rgba(0,0,0,0)';
    t2.contentEditable = false;
    card.appendChild(img);
    card.appendChild(t1Container);
    card.appendChild(t2);
    overlay.appendChild(card);
    try { if (calendrier) calendrier.style.display='none'; } catch(e) {}
    try { calendrier.parentNode.insertBefore(overlay, calendrier.nextSibling); } catch(e){ document.body.appendChild(overlay); }
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    try { history.pushState({ specialOverlay:true }, ''); } catch(e) {}
    function cleanup(){
        // stop audio
        try { const specialAudio = document.getElementById('specialAudio'); if (specialAudio){ specialAudio.pause(); specialAudio.currentTime=0; } } catch(e){}
        document.documentElement.style.overflow = prevOverflow || '';
        try { if (calendrier) calendrier.style.display='block'; } catch(e){}
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    window.addEventListener('popstate', function onPop(ev){
        if (!(ev.state && ev.state.specialOverlay)) {
            window.removeEventListener('popstate', onPop);
            cleanup();
        }
    });
    document.addEventListener('keydown', function onKey(ev){ if(ev.key==='Escape'){ try{ history.back(); } catch(e){ cleanup(); } } });
}

