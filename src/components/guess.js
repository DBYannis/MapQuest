import React, { useState } from 'react';
import pin from '../images/pin.png';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardStep } from '@fortawesome/free-solid-svg-icons';

const Guess = ({ correctCity, onCorrectGuess, onSkipCity }) => {
  const { t } = useTranslation();
  const [userGuess, setUserGuess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formatCityName = (city) => {
    return city
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  };

  const getTranslatedCity = (city) => {
    return t(`cities.${city}`, city);
  };

  const handleGuess = () => {
    const translatedCity = getTranslatedCity(correctCity);

    if (formatCityName(userGuess) === formatCityName(translatedCity)) {
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
    onSkipCity();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    </div>
  );
};

export default Guess;

