import React, { useState } from 'react';
import pin from '../images/pin.png';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardStep } from '@fortawesome/free-solid-svg-icons';
import ModalSkip from './modalSkip';

const Guess = ({ correctCity, onCorrectGuess, onSkipCity }) => {
  const { t, i18n } = useTranslation();
  const [userGuess, setUserGuess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [skippedCity, setSkippedCity] = useState('');

  const cityTranslations = {
    "London": "Londres",
    "Londres": "London",
    "Cairo": "Le Caire",
    "Le Caire": "Cairo",
    "Cape Town": "Le Cap",
    "Le Cap": "Cape Town",
    "Algiers": "Alger",
    "Alger": "Algiers",
    "Moscow": "Moscou",
    "Moscou": "Moscow",
    "Seoul": "Séoul",
    "Séoul": "Seoul",
    "Marrakesh": "Marrakech",
    "Marrakech": "Marrakesh",
    "Lisbon": "Lisbonne",
    "Lisbonne": "Lisbon",
    "Singapore": "Singapour",
    "Singapour": "Singapore",
    "Brussels": "Bruxelles",
    "Bruxelles": "Brussels",
    "Edinburgh": "Édimbourg",
    "Édimbourg": "Edinburgh",
    "Geneva": "Genève",
    "Genève": "Geneva",
    "Barcelona": "Barcelone",
    "Barcelone": "Barcelona",
    "Copenhagen": "Copenhague",
    "Copenhague": "Copenhagen"
  };

  const getAllPossibleNames = (city) => {
    const translatedCity = cityTranslations[city];
    return translatedCity ? [city, translatedCity] : [city];
  };

  const formatCityName = (city) => {
    return city
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  };

  const handleGuess = () => {
    const possibleNames = getAllPossibleNames(correctCity);
    
    if (possibleNames.some(name => formatCityName(userGuess) === formatCityName(name))) {
      setErrorMessage('');
      onCorrectGuess();
      setUserGuess('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.activeElement.blur();
    } else {
      document.activeElement.blur();
      setErrorMessage(t('guess.wrong'));
      setUserGuess('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleGuess();
    }
  };

  const handleSkipCity = () => {
    const translatedCity = i18n.language === 'fr' ? cityTranslations[correctCity] || correctCity : correctCity;

    setSkippedCity(translatedCity);
    setModalOpen(true);
    onSkipCity();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeModal = () => {
    setModalOpen(false);
    setUserGuess('');
  };
  
  return (
    <div className="guess">
      {errorMessage && <p className="error_message">{errorMessage}</p>}
      <input 
        className='input'
        placeholder={t('guess.placeholder')}
        value={userGuess}
        onChange={(e) => setUserGuess(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <div className='button_container'>
        <div className='skip_container'>
          <button className='skip_button' onClick={handleSkipCity}>
            {t('guess.skip')}
            <FontAwesomeIcon icon={faForwardStep} className='skip_icon' />
          </button>
        </div>
        <div className='guess_container'>
          <button className='guess_button' onClick={handleGuess}>
            {t('guess.button')}
            <img src={pin} className='pin' alt='pin' />
          </button>
        </div>
      </div>
      <ModalSkip 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        city={skippedCity}
      />
    </div>
  );
};

export default Guess;
