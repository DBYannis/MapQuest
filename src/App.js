import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useCallback, useRef } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Clues from './components/clues';
import Guess from './components/guess';
import Helper from './components/helper';
import StartScreen from './components/StartScreen';
import Modal from './components/modal';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const [mapUrl, setMapUrl] = useState('');
  const [clues, setClues] = useState([]);
  const [founded, setFounded] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [round, setRound] = useState(1);
  const [correctCity, setCorrectCity] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const lastCitiesRef = useRef([]);
  const [showModal, setShowModal] = useState(false);
  const [cityStatus, setCityStatus] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState(['easy', 'medium', 'hard']);
  const timerRef = useRef(null);

  const fetchMapImage = useCallback(async () => {
    try {
      const citiesCollection = collection(db, 'cities');
      const citiesSnapshot = await getDocs(citiesCollection);
  
      if (!citiesSnapshot.empty) {
        const citiesArray = citiesSnapshot.docs.map(doc => doc.data());
        const filteredCities = citiesArray.filter(city => {
          return (selectedDifficulty.includes('easy') && (city.difficulty >= 1 && city.difficulty <= 2))
            || (selectedDifficulty.includes('medium') && city.difficulty === 3)
            || (selectedDifficulty.includes('hard') && (city.difficulty >= 4 && city.difficulty <= 5));
        });
  
        const availableCities = filteredCities.filter(city => 
          !lastCitiesRef.current.includes(city.name)
        );
  
        if (availableCities.length === 0) {
          console.warn("Toutes les villes ont été utilisées. Réinitialisation des villes utilisées.");
          lastCitiesRef.current = [];
          return;
        }
  
        const randomCity = availableCities[Math.floor(Math.random() * availableCities.length)];
        setMapUrl(randomCity.image);
        setClues(randomCity.clues);
        setFounded(randomCity.founded);
        setCorrectCity(randomCity.name);
        setDifficulty(randomCity.difficulty);
        lastCitiesRef.current.push(randomCity.name);
        if (lastCitiesRef.current.length > 5) {
          lastCitiesRef.current.shift();
        }
      } else {
        console.error("Aucun document trouvé dans la collection 'cities'.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'image de la carte :", error);
    }
  }, [selectedDifficulty]);

  const resetClues = () => {
    setClues([]);
  };

  const handleCorrectGuess = () => {
    const newRound = round + 1;
    setRound(newRound);
    fetchMapImage();
    resetClues();
    setCityStatus([...cityStatus, 'correct']);
    setCorrectGuesses(correctGuesses + 1); 

    if (newRound > 5) {
      clearInterval(timerRef.current);
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(totalTime);
      setShowModal(true);
    }
  };

  const handleSkipCity = () => {
    const newRound = round + 1;
    setRound(newRound);
    fetchMapImage();
    resetClues();
    setCityStatus([...cityStatus, 'skipped']);

    if (newRound > 5) {
      clearInterval(timerRef.current);
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(totalTime);
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetchMapImage();
  }, [fetchMapImage]);

  const handleStart = () => {
    setHasStarted(true);
    setStartTime(Date.now());
    
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const handleCloseModal = () => {
    clearInterval(timerRef.current);
    setShowModal(false);
    setRound(1);
    setCityStatus([]);
    setCorrectGuesses(0);
    lastCitiesRef.current = [];
    setElapsedTime(0);
    setStartTime(Date.now());
  
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
  
    fetchMapImage();
  };

  useEffect(() => {
    if (showModal) {
      clearInterval(timerRef.current);
    } else if (hasStarted) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  
    return () => clearInterval(timerRef.current);
  }, [showModal, hasStarted]);

  const handleTitleClick = () => {
    setHasStarted(false);
    setRound(1);
    setCityStatus([]);
    setCorrectGuesses(0);
    lastCitiesRef.current = [];
    setElapsedTime(0);
    setStartTime(null);
    resetClues();
    fetchMapImage();
  };

  useEffect(() => {
    if (showModal) {
      clearInterval(timerRef.current);
    }
  }, [showModal]);

  const handleMenu = () => {
    clearInterval(timerRef.current);
    setHasStarted(false);
    setRound(1);
    setCityStatus([]);
    setCorrectGuesses(0);
    lastCitiesRef.current = [];
    setElapsedTime(0);
    setStartTime(null);
    setShowModal(false);
    resetClues();
    fetchMapImage();
  };

  if (!hasStarted) {
    return <StartScreen onStart={handleStart} changeLanguage={i18n.changeLanguage} setSelectedDifficulty={setSelectedDifficulty} selectedDifficulty={selectedDifficulty}/>;
  }

  return (
    <div className="App">
      <div className='title' onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faMapLocationDot} className='map_icon' />
        <h1 className='title_text'>{t('title')}</h1>
      </div>
      <Helper founded={founded} difficulty={difficulty} round={round} cityStatus={cityStatus}/>
      <div className='main'>
        {mapUrl && <img className='map' alt='map' src={mapUrl} />}
        <div className='clues_guess'>
          <Clues clues={clues} onResetClues={resetClues} />
          <Guess correctCity={correctCity} onCorrectGuess={handleCorrectGuess} onSkipCity={handleSkipCity} />
        </div>
      </div>
      {showModal && (
        <Modal 
          onClose={handleCloseModal}
          onMenu={handleMenu}
          score={correctGuesses}
          time={elapsedTime}
        />
      )}
    </div>
  );
}

export default App;
