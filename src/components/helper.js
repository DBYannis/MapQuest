import React from 'react';
import { useTranslation } from 'react-i18next';

const Helper = ({ founded, difficulty, cityStatus }) => {

  const { t } = useTranslation();

  const getDifficultyDescription = (difficulty) => {
    switch (difficulty) {
      case 1:
        return t('difficultyDescriptions.very_easy');
      case 2:
        return t('difficultyDescriptions.easy');
      case 3:
        return t('difficultyDescriptions.medium');
      case 4:
        return t('difficultyDescriptions.hard');
      case 5:
        return t('difficultyDescriptions.very_hard');
      default:
        return '';
    }
  };

  const renderCircles = () => {
    const totalRounds = 5;
    const circles = [];
  
    for (let i = 0; i < totalRounds; i++) {
      let circleClass = '';
  
      if (cityStatus[i] === 'correct') {
        circleClass = 'correct';
      } else if (cityStatus[i] === 'skipped') {
        circleClass = 'skipped';
      }
  
      circles.push(
        <div
          key={i}
          className={`round_circle ${circleClass}`}
        />
      );
    }
  
    return circles;
  };

  return (
    <div className="helper">
      <div className='helper_container'>
        <h2 className='helper_title'>{t('founded')}</h2>
        <p className='helper_text'>{founded}</p>
      </div>
      <div className='helper_container'>
        <h2 className='helper_title'>{t('rounds')}</h2>
        <div className='circles_container'>
          {renderCircles()}
        </div>
      </div>
      <div className='helper_container'>
        <h2 className='helper_title'>{t('difficulty')}</h2>
        <p className='helper_text'>{difficulty} ({getDifficultyDescription(difficulty)})</p>
      </div>
    </div>
  );
};

export default Helper;
