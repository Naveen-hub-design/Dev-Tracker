import { useState, useCallback } from 'react';
import {
  startMockInterview,
  submitInterviewAnswer,
  finishMockInterview,
} from '../api/ai';

export function useMockInterview() {
  const [stage, setStage] = useState('setup'); // 'setup' | 'interview' | 'report'
  const [role, setRole] = useState('frontend');
  const [level, setLevel] = useState('mid');

  const [questionData, setQuestionData] = useState(null);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  const [exchanges, setExchanges] = useState([]);
  const [finalReport, setFinalReport] = useState(null);
  const [error, setError] = useState(null);

  // Start a new interview session
  const start = useCallback(async (selectedRole = 'frontend', selectedLevel = 'mid') => {
    try {
      setError(null);
      setRole(selectedRole);
      setLevel(selectedLevel);
      setExchanges([]);
      setCurrentEvaluation(null);
      setCandidateAnswer('');
      setFinalReport(null);

      const res = await startMockInterview({ role: selectedRole, level: selectedLevel });
      setQuestionData({
        questionNumber: res.questionNumber,
        totalQuestions: res.totalQuestions,
        question: res.question,
        topic: res.topic,
        isLiveAI: res.isLiveAI,
      });
      setStage('interview');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start mock interview');
    }
  }, []);

  // Submit candidate answer for current question
  const submitAnswer = useCallback(async (answerText) => {
    if (!answerText?.trim()) return;
    try {
      setIsEvaluating(true);
      setError(null);

      const res = await submitInterviewAnswer({
        role,
        level,
        questionNumber: questionData?.questionNumber || 1,
        question: questionData?.question || '',
        answer: answerText,
        history: exchanges,
      });

      const exchangeRecord = {
        questionNumber: questionData.questionNumber,
        question: questionData.question,
        topic: questionData.topic,
        answer: answerText,
        evaluation: res.evaluation,
        isCompleted: res.isCompleted,
        nextQuestion: res.nextQuestion,
      };

      setCurrentEvaluation(res.evaluation);
      setExchanges((prev) => [...prev, exchangeRecord]);
      return exchangeRecord;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to evaluate answer');
      throw err;
    } finally {
      setIsEvaluating(false);
    }
  }, [role, level, questionData, exchanges]);

  // Advance to next question or finalize interview report
  const proceedToNext = useCallback(async () => {
    const lastExchange = exchanges[exchanges.length - 1];
    if (lastExchange?.isCompleted || questionData.questionNumber >= 5) {
      // Completed all questions -> Generate Final Report
      try {
        setIsEvaluating(true);
        const report = await finishMockInterview({
          role,
          level,
          exchanges,
        });
        setFinalReport(report);
        setStage('report');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to generate final interview report');
      } finally {
        setIsEvaluating(false);
      }
    } else if (lastExchange?.nextQuestion) {
      setQuestionData({
        ...questionData,
        questionNumber: lastExchange.nextQuestion.questionNumber,
        question: lastExchange.nextQuestion.question,
        topic: lastExchange.nextQuestion.topic,
      });
      setCurrentEvaluation(null);
      setCandidateAnswer('');
    }
  }, [exchanges, questionData, role, level]);

  const reset = useCallback(() => {
    setStage('setup');
    setQuestionData(null);
    setCurrentEvaluation(null);
    setCandidateAnswer('');
    setExchanges([]);
    setFinalReport(null);
    setError(null);
  }, []);

  return {
    stage,
    role,
    level,
    setRole,
    setLevel,
    questionData,
    candidateAnswer,
    setCandidateAnswer,
    isEvaluating,
    currentEvaluation,
    exchanges,
    finalReport,
    error,
    start,
    submitAnswer,
    proceedToNext,
    reset,
  };
}
