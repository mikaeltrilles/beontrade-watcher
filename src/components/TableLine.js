import React, { useState } from 'react';
import PercentChange from './PercentChange';
import Favorites from './Favorites';
import CoinChart from './CoinChart';

//* Ce composant permet de remplir les lignes du tableau des cryptos en recupérant les données de l'API et l'index de la ligne dans le tableau

const TableLine = ({ coin, index }) => {

  //* Boulen qui permet de savoir si l'on montre le graphique ou pas

  const [showChart, setShowChart] = useState(false);

  //* Fonction pour formatter le prix des cryptos inférieure à 1$ pour affiché les petites valeurs
  //* Formule trouvé sur https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  const priceFormatter = (num) => {
    if (Math.round(num).toString().length < 4) {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 7
      }).format(num);
    } else {
      return num;
    }
  }

  //* Fonction pour formatter le prix du marché en Million de $ en recuperant le prix de la crypto sans les 6 derniers chiffres puis nous retournons un nombre join avec un espace pour séparer les milliers, il faut d'abord convertir le nombre en string pour pouvoir utiliser la fonction split et ensuite on reconverti en nombre
  const mktCapFormatter = (num) => {
    let newNum = String(num).split("").slice(0, -6); // On retire les 6 derniers chiffres du nombre
    // console.log(newNum);
    return Number(newNum.join("")); // On reconverti en nombre les chiffres sans séparateur
  }


  return (
    <div className="table-line">
      {/* // * Conteneur des infos de la crypto qui contient l'étoile de favoris, l'index, l'icone crypto, le nom, le symbole et le lien vers la crypto sur coingecko */}
      <div className="infos-container">
        <Favorites coinId={coin.id} />
        {/* Index + 1 car on demarre de zéro */}
        <p>{index + 1}</p>
        <div className="img">
          <img src={coin.image} alt={coin.symbol} height="20" />
        </div>
        <div className="infos">
          <div className="chart-img"
            onMouseEnter={() => setShowChart(true)}     //~ Au passage de la souris on affiche le graphique
            onMouseLeave={() => setShowChart(false)}    //~ A la sortie de la souris on cache le graphique
          >
            <img src="assets/chart-icon.svg" alt="chart-icon" />
            {/* On affiche le graphique si showChart est à true */}
            <div className="chart-container" id={coin.name}>
              {showChart && <CoinChart coinId={coin.id} coinName={coin.name} />}
            </div>
          </div>
          <h4> {coin.name} </h4>
          <span>- {coin.symbol.toUpperCase()}</span>
          <a
            target="_blank"
            href={"https://www.coingecko.com/fr/pi%C3%A8ces/" + coin.name
              .toLowerCase()
              .replaceAll(" ", "-") // Remplace tous les espaces par un tiret
              // .replace(" ", "-") // Remplace le deuxieme espace par un tiret
              // .replace(" ", "-") // Remplace le troisième espace par un tiret au cas ou d'une monnaie a quatre termes
            }
          >
            <img src="assets/info-icon.svg" alt="info" />
          </a>
        </div>
      </div>
      {/* Affichage du prix avec le formatage de la fonction priceFormatter */}
      <p> {priceFormatter(coin.current_price).toLocaleString()} $</p>
      {/* Affichage du MarketCap avec le formatage de la fonction mktFormatter et séparateur de milleirs*/}
      <p className="mktcap"> {(mktCapFormatter(coin.market_cap)).toLocaleString()} Mio$</p>
      <p className="volume"> {coin.total_volume.toLocaleString()} $</p>
      {/* liste des pourcentage 1h, 1j , 1s, 1m , 6m , 1a, ATH */}
      <PercentChange percent={coin.price_change_percentage_1h_in_currency} />   {/* 1h */}
      <PercentChange percent={coin.price_change_percentage_24h} />              {/* 1j */}
      <PercentChange percent={coin.price_change_percentage_7d_in_currency} />   {/* 1s */}
      <PercentChange percent={coin.price_change_percentage_30d_in_currency} />  {/* 1m */}
      <PercentChange percent={coin.price_change_percentage_200d_in_currency} /> {/* 6m */}
      <PercentChange percent={coin.price_change_percentage_1y_in_currency} />   {/* 1a */}
      {/* ATH avec prévision de le dépasser lorsqu'on est proche de la valeur inférieur à 2% d'écart */}
      {coin.ath_change_percentage > -2 ? (
        <p className="ath">ATH !</p>
      ) : (
        <PercentChange percent={coin.ath_change_percentage} />
      )}
    </div>
  );
};

export default TableLine;