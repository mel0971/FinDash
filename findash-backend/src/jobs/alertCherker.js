const Alert = require('../models/Alert');
const Holding = require('../models/Holding');
const axios = require('axios');

// Fonction pour récupérer le prix actuel (exemple avec Yahoo Finance)
async function getCurrentPrice(symbol) {
  try {
    // Tu peux utiliser une API gratuite comme:
    // - Alpha Vantage
    // - Financial Modeling Prep
    // - Finnhub
    // Ici exemple simple avec un prix mocké
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`
    );
    const currentPrice = response.data.chart.result[0].meta.regularMarketPrice;
    return currentPrice;
  } catch (error) {
    console.error(`Erreur récupération prix ${symbol}:`, error.message);
    return null;
  }
}

// Fonction principale qui vérifie les alertes
async function checkAllAlerts() {
  try {
    console.log('🔔 Vérification des alertes...');

    // 1. Récupère toutes les alertes actives NON déclenchées
    const alerts = await Alert.find({ isActive: true, triggered: false });

    if (alerts.length === 0) {
      console.log('✅ Aucune alerte à vérifier');
      return;
    }

    for (const alert of alerts) {
      try {
        // 2. Récupère le holding associé
        const holding = await Holding.findById(alert.holdingId);
        if (!holding) continue;

        // 3. Récupère le prix actuel
        const currentPrice = await getCurrentPrice(holding.symbol);
        if (!currentPrice) continue;

        console.log(`📊 ${holding.symbol}: Prix actuel = ${currentPrice}€`);

        // 4. Vérifie la condition de l'alerte
        let shouldTrigger = false;

        if (alert.alertType === 'PRICE_UP' && currentPrice >= alert.targetPrice) {
          console.log(`✅ ALERTE DÉCLENCHÉE: ${holding.symbol} > ${alert.targetPrice}€`);
          shouldTrigger = true;
        } 
        else if (alert.alertType === 'PRICE_DOWN' && currentPrice <= alert.targetPrice) {
          console.log(`✅ ALERTE DÉCLENCHÉE: ${holding.symbol} < ${alert.targetPrice}€`);
          shouldTrigger = true;
        } 
        else if (alert.alertType === 'PERCENT_CHANGE') {
          const changePercent = ((currentPrice - alert.referencePrice) / alert.referencePrice) * 100;
          if (Math.abs(changePercent) >= alert.percentChange) {
            console.log(`✅ ALERTE DÉCLENCHÉE: ${holding.symbol} a changé de ${changePercent.toFixed(2)}%`);
            shouldTrigger = true;
          }
        }

        // 5. Si déclenchée, met à jour
        if (shouldTrigger) {
          alert.triggered = true;
          alert.triggeredAt = new Date();
          await alert.save();

          // 6. Envoie notification (optionnel)
          // await sendEmailNotification(alert, currentPrice);
        }
      } catch (error) {
        console.error(`Erreur traitement alerte:`, error.message);
      }
    }

    console.log('✅ Vérification des alertes terminée');
  } catch (error) {
    console.error('❌ Erreur vérification alertes:', error);
  }
}

// Lance la vérification toutes les 5 minutes
const INTERVAL = 5 * 60 * 1000; // 5 minutes

console.log('🚀 Démarrage du job de vérification des alertes...');
setInterval(checkAllAlerts, INTERVAL);

// Vérification immédiate au démarrage
checkAllAlerts();

module.exports = { checkAllAlerts };
