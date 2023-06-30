
import { useState, useEffect } from 'react';

const texts = [
    'pannu tulilla...',
    'brainstorm käynnissä...',
    'koodi kuumenee...',
    'koodi kuumenee edelleen...',
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
    'koodi kuumenee edelleen...',
    'binääri lukee itseään...',
    'kahvi valmistuu...',
    'muistia lisätään...',
    'ideat suodattuvat...',
    'pannu tulilla...',
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
];

function ProgressText() {

    const [textIndex, setTextIndex] = useState(0);

    function changeText() {
        setTextIndex(Math.floor(Math.random()*texts.length) );
    }

    useEffect(() => {
        setInterval(() => {
            changeText();
        }, 4000);
        
    }, []);

    return (
        <div className='text-center text-m p-5 w-full'>{texts[textIndex]}</div>
    )
}

export default ProgressText;