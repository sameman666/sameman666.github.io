import { useState } from 'react';
import './App.scss';
import dictionary from './dictionary.json';

let counter = 1

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

shuffleArray(dictionary)

const App = () => {
  if (dictionary.length < 4) {
    throw new Error("Not enough words in dictionary (min 4)");
  }

  const getNextQuestion = (counter) => {

    const getRandomAnswer = (existingAnswer, currentAnswers) => {
      const filteredWords = dictionary.filter(word => word.translation !== existingAnswer)
      const randomAnswer = filteredWords[Math.floor(Math.random() * filteredWords.length)].translation
      if (!currentAnswers.includes(randomAnswer)) {
        return randomAnswer
      } else {
        return getRandomAnswer(existingAnswer, currentAnswers)
      }
    }

    const word = dictionary[counter - 1]
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

  const [state, setState] = useState(getNextQuestion(counter));

  const setNextQuestion = (counter) => {
    setState(getNextQuestion(counter));
  };

  let allowClick = true

  const checkAnswer = (answer, e) => {
    if (!allowClick) {
      return
    }

    allowClick = false
    counter = counter >= dictionary.length ? 1 : ++counter

    const card = e.currentTarget
  
    if (answer === state.answer) {
      card.classList.add("correct-answer")
      setTimeout(() => {
        card.classList.remove("correct-answer")
        setNextQuestion(counter)
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
        setNextQuestion(counter)
      }, 2000);
    }
  }

  return (
    <>
      <header>
        <div className='question word'>{state.question}</div>
        <p>kysymys {counter} / {dictionary.length}</p>
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
