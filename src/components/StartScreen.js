import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const StartScreen = ({ onStart, changeLanguage, setSelectedDifficulty, selectedDifficulty }) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    changeLanguage('en');
  }, [changeLanguage]);

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.checked ? 'fr' : 'en');
  };

  const handleDifficultyChange = (difficulty) => {
    if (selectedDifficulty.includes(difficulty)) {
      setSelectedDifficulty(selectedDifficulty.filter(d => d !== difficulty));
    } else {
      setSelectedDifficulty([...selectedDifficulty, difficulty]);
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleStartClick = () => {
    if (selectedDifficulty.length === 0) {
      setErrorMessage(t('difficulty_error'));
    } else {
      onStart();
    }
  };

  return (
    <div className="start_screen">
      <video 
        autoPlay 
        loop 
        muted 
        className="background_video"
      >
        <source src="https://firebasestorage.googleapis.com/v0/b/mapquest-2e211.appspot.com/o/3121459-uhd_3840_2160_24fps.mp4?alt=media&token=3a6a5654-23bb-4b13-ab09-c13358ba5d5b" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <h1 className="start_title">{t('startGame')} <span className='mapquest'>{t('title')}</span></h1>
        <p className='rules'>{t('rule1')} <br/> {t('rule2')}</p>

        <div className='difficulty_buttons'>
          <div className='difficulty_container'>
            <h2 className='difficulty_text'>{t('easy')}</h2>
            <label className="switch_diff">
              <input 
                type="checkbox"
                checked={selectedDifficulty.includes('easy')}
                onChange={() => handleDifficultyChange('easy')} 
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className='difficulty_container'>
            <h2 className='difficulty_text'>{t('medium')}</h2>
            <label className="switch_diff">
              <input 
                type="checkbox"
                checked={selectedDifficulty.includes('medium')}
                onChange={() => handleDifficultyChange('medium')}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className='difficulty_container'>
            <h2 className='difficulty_text'>{t('hard')}</h2>
            <label className="switch_diff">
              <input 
                type="checkbox"
                checked={selectedDifficulty.includes('hard')}
                onChange={() => handleDifficultyChange('hard')}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {errorMessage && <p className="error_message">{errorMessage}</p>}

        <button className="start_button" onClick={handleStartClick}>
          {t('startGameButton')}
        </button>
      </div>

      <div className="language-selector">
        <center>
          <div className="switch">
            <input 
              id="language-toggle" 
              className="check-toggle check-toggle-round-flat" 
              type="checkbox" 
              onChange={handleLanguageChange}
            />
            <label htmlFor="language-toggle"></label>
            <span className="on">EN</span>
            <span className="off">FR</span>
          </div>
        </center>
      </div>
    </div>
  );
};

export default StartScreen;
