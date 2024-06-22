import { useState } from 'react';
import './App.scss';
import dictionary from './dictionary.json';

const App = () => {
  if (dictionary.length < 4) {
    throw new Error("Not enough words in dictionary (min 4)");
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const getRandomQuestion = () => {

    const getRandomAnswer = (existingAnswer, currentAnswers) => {
      const filteredWords = dictionary.filter(word => word.translation !== existingAnswer)
      const randomAnswer = filteredWords[Math.floor(Math.random() * filteredWords.length)].translation
      if (!currentAnswers.includes(randomAnswer)) {
        return randomAnswer
      } else {
        return getRandomAnswer(existingAnswer, currentAnswers)
      }
    }

    const word = dictionary[Math.floor(Math.random() * dictionary.length)]
    const question = word.word
    const answer = word.translation

    const answers = [answer]

    for (let i = 0; i < 3; i++) {
      answers.push(getRandomAnswer(answer, answers))
    }

    shuffleArray(answers)

    return {
      question,
      answer,
      answers
    }

  }

  const [state, setState] = useState(getRandomQuestion());

  const setNewRandomQuestion = () => {
    setState(getRandomQuestion());
  };

  let allowClick = true

  const checkAnswer = (answer, e) => {
    if (!allowClick) {
      return
    }
    allowClick = false

    const card = e.currentTarget
  
    if (answer === state.answer) {
      card.classList.add("correct-answer")
      setTimeout(() => {
        card.classList.remove("correct-answer")
        setNewRandomQuestion()
      }, 800);
    } else {
      const root = card.parentElement
      const cards = root.querySelectorAll(".card")
      cards.forEach(cardd => {
        if (cardd.textContent === state.answer) {
          cardd.classList.add("correct-answer")
        }
      }) 
      card.classList.add("wrong-answer")
      setTimeout(() => {
        card.classList.remove("wrong-answer")
        root.querySelector(".correct-answer").classList.remove("correct-answer")
        setNewRandomQuestion()
      }, 2000);
    }
  }

  return (
    <>
      <header>
        <div className='question word'>{state.question}</div>
      </header>
      {state.answers.map(answer => (
        <div onClick={(e) => checkAnswer(answer, e)} key={answer} className='card word'>
          <span>{answer}</span>
        </div>
      ))}
    </>
  )
};

export default App;
