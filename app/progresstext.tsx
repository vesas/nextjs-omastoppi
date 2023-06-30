
import { useState, useEffect } from 'react';

const texts = [
    'pannu tulilla...',
    'brainstorm käynnissä...',
    'koodi kuumenee...',
    'kahvi valmistuu...',
    'ideat suodattuvat...',
    'bugit piileskelevät...', 
    'luodaan uutta matrixia...', 
    'virheet korjaantuvat itsestään...', 
    'nörttivoimat aktivoituvat...', 
    'ideat suodattuvat...',
    'serveri hikoilee...', 
    'lohkot lohkotaan...', 
    'taulukot järjestäytyvät...', 
    'data liikkuu valonnopeudella...', 
    'tietokanta ei vastaa...', 
    'syntaksivirheitä etsitään...', 
    'dataa siirretään yläpilveen...', 
    'taistelu nollia ja ykkösiä vastaan...',
    'binääri lukee itseään...',
    'kahvi valmistuu...',
    'muistia lisätään...',
    'ideat suodattuvat...',
    'datan jäsentäjä ottaa lomaa...',
    'lohkoketju katkeaa, paikataan...',
    'palvelin nukkuu, herätetään...',
    'taulukot järjestyvät itsestään...',
    'käyttöliittymä tekee omia päätöksiään...',
    'viimeiset bugit piilottelevat...',
    'datat sulautetaan matriisiin...',
    'tietokone haistaa koodin...',
    'ladataan matriisia...',
    'ideoidaan idean sisällä...',
    'jäädytetään koodin versio...',
    "algoritmit laukkaavat...",
    "tietokone hikoilee...",
    "bitit lentävät...",
    "bugit korjaantuvat...",
    "muuttujat määrittyvät...",
    "funktiot sulavat yhteen...",
    "koodirivit täydentyvät...",
    "taulukot laajenevat...",
    "testit suoritetaan...",
    "päivitykset ladataan...",
    "backend yhdistyy frontendin kanssa...",
    "dokumentaatio päivittyy...",
    "moduulit integroituvat...",
    "git-haara haarautuu...",
    "ohjelmisto päivittyy...",
    "kehitysympäristö optimoituu...",
    "serverit käynnistyvät...",
    "API vastaa kutsuihin...",
    "CI/CD-pipeline virtaa...",
    "tietokanta päivittyy...",
    "yleisötestaus alkaa...",
    "skriptit suoritetaan...",
    "UI/UX parantuu...",
    "proxyt ohjaavat...",
    "debuggaus aloitetaan..."
];

function ProgressText() {

    const [textIndex, setTextIndex] = useState(0);

    function changeText() {
        setTextIndex(Math.floor(Math.random()*texts.length) );
    }

    useEffect(() => {
        setInterval(changeText, 4000);
    }, []);

    return (
        <div className='text-center text-m p-1 w-full'>{texts[textIndex]}</div>
    )
}

export default ProgressText;