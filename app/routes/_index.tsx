import React, { useState } from 'react';
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { quizQuestions } from '~/data';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export const loader: LoaderFunction = async () => {
  return json(quizQuestions);
};

const QuizPage: React.FC = () => {
  const loadedData = useLoaderData<typeof quizQuestions>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const questions: Question[] = loadedData.reading_questions;

  const handleAnswerSelection = (selectedOption: string) => {
    const newAnswers = [...selectedAnswers, selectedOption];
    setSelectedAnswers(newAnswers);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true); // クイズ終了
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResult(false);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (question.answer === selectedAnswers[index]) {
        score += 1;
      }
    });
    return score;
  };

  if (showResult) {
    const score = calculateScore();
    return (
      <div className="resultSection">
        <h2>クイズ結果</h2>
        <p>あなたのスコアは {score} / {questions.length} です。</p>
        <button onClick={resetQuiz}>もう一度チャレンジ</button>
      </div>
    );
  }

  return (
    <div className="quizPage">
      <div className="questionSection">
        <div className="questionCount">
          <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
        </div>
        <div className="questionText">{questions[currentQuestionIndex].question}</div>
      </div>
      <div className="answerSection">
        {questions[currentQuestionIndex].options.map((option, index) => (
          <button key={index} onClick={() => handleAnswerSelection(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;
