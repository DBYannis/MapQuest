import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import search from '../images/search.png';
import { useTranslation } from 'react-i18next';

const Clues = ({ clues, onResetClues }) => {
  const { t } = useTranslation();
  const [cluesList, setCluesList] = useState([]);
  const [revealedClues, setRevealedClues] = useState([]);
  const [currentClue, setCurrentClue] = useState(0);
  const [cluesUsed, setCluesUsed] = useState(0); 

  const cluesLabels = [
    'flagEmblem',
    'population',
    'continent',
    'country',
    'letters',
  ];

  const resetClues = useCallback(() => {
    setCluesUsed(0);
    setCurrentClue(0);
    setRevealedClues(Array(cluesList.length).fill(false));
    onResetClues();
  }, [cluesList.length, onResetClues]);

  useEffect(() => {
    if (clues.length > 0) {
      setCluesList(clues);
      setRevealedClues(Array(clues.length).fill(false));
      resetClues();
    }
  }, [clues, resetClues]);

  const handleRevealClue = () => {
    if (currentClue < cluesList.length) {
      const newRevealedClues = [...revealedClues];
      newRevealedClues[currentClue] = true;
      setRevealedClues(newRevealedClues);
      setCluesUsed(prev => prev + 1);

      if (currentClue === 4) {
        const translatedLetters = t(`cities.${cluesList[currentClue]}`);
        const mixedLetters = mixLetters(translatedLetters);
        setCluesList(prevClues => {
          const newClues = [...prevClues];
          newClues[currentClue] = mixedLetters;
          return newClues;
        });
      }

      setCurrentClue(currentClue + 1);
    }
  };

  const mixLetters = (letters) => {
    const lettersArray = letters.split('');
    for (let i = lettersArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lettersArray[i], lettersArray[j]] = [lettersArray[j], lettersArray[i]];
    }
    return lettersArray.join('');
  };

  return (
    <div className="clues">
      <ul className="clue-list">
        {cluesList.map((clue, index) => {
          let displayClue = clue;

          if (index === 2) {
            displayClue = t(`continents.${clue}`);
          } else if (index === 3) {
            displayClue = t(`countries.${clue}`);
          }

          return (
            <li key={index} className="clue-item">
              {revealedClues[index] ? (
                <>
                  <FontAwesomeIcon icon={faLockOpen} className="clue-icon" />
                  {index === 0 ? (
                    <img src={clue} alt="Flag" className="clue_flag" />
                  ) : (
                    displayClue
                  )}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLock} className="clue-icon" />
                  <div className="hidden-clue">{t(cluesLabels[index])}</div>
                </>
              )}
            </li>
          );
        })}
      </ul>
        <div className="clue_button_container">
          {currentClue < cluesList.length && cluesUsed < 5 ? (
            <button className="get_clue" onClick={handleRevealClue}>
              {t("clues.get")}
              <img src={search} alt="magnifying glass" className="glass" />
            </button>
          ) : (
            <p className='no_clues'>{t('clues.no_clues')}</p>
          )}
          <p className="clues_left">
            {t("clues.left")} {cluesList.length - currentClue}
          </p>
      </div>
    </div>
  );
};

export default Clues;
