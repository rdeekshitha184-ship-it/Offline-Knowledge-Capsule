// pages/QuizPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuizScore } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz,     setQuiz]     = useState(null);
  const [current,  setCurrent]  = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers,  setAnswers]  = useState([]);
  const [timer,    setTimer]    = useState(30);
  const [finished, setFinished] = useState(false);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getQuiz(id).then(res => setQuiz(res.data)).finally(() => setLoading(false));
  }, [id]);

  const handleNext = useCallback(() => {
    if (!quiz) return;
    const question = quiz.questions[current];
    const isCorrect = selected === question.correct_answer;
    const newAnswers = [...answers, { selected, correct: question.correct_answer, isCorrect }];
    setAnswers(newAnswers);

    if (current + 1 >= quiz.questions.length) {
      // Quiz finished
      setFinished(true);
      const score = newAnswers.filter(a => a.isCorrect).length;
      if (user) {
        submitQuizScore({ quiz: parseInt(id), score, total: quiz.questions.length }).catch(() => {});
      }
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setTimer(30);
    }
  }, [quiz, current, selected, answers, id, user]);

  // Countdown timer
  useEffect(() => {
    if (finished || !quiz) return;
    if (timer === 0) { handleNext(); return; }
    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, finished, quiz, handleNext]);

  if (loading) return <div className="loading-wrap"><div className="spinner"/></div>;
  if (!quiz)   return <div className="container" style={{padding:40}}>Quiz not found.</div>;

  const score = answers.filter(a => a.isCorrect).length;
  const pct   = Math.round((score / quiz.questions.length) * 100);

  // ── Result Screen ──
  if (finished) {
    return (
      <div className="container" style={{padding:'40px 20px', maxWidth:600, textAlign:'center'}}>
        <div className="card" style={{padding:40}}>
          <div style={{fontSize:64, marginBottom:16}}>{pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '💪'}</div>
          <h2 style={{fontSize:28, marginBottom:8}}>Quiz Complete!</h2>
          <p style={{color:'var(--text-muted)', marginBottom:24}}>{quiz.title}</p>
          <div style={{fontSize:48, fontWeight:800, color: pct>=70?'#10B981':pct>=40?'#F59E0B':'#EF4444', marginBottom:8}}>
            {score}/{quiz.questions.length}
          </div>
          <div style={{fontSize:20, color:'var(--text-muted)', marginBottom:32}}>{pct}%</div>

          {/* Per-question review */}
          <div style={{textAlign:'left', marginBottom:28}}>
            {quiz.questions.map((q, i) => (
              <div key={i} style={{...styles.reviewItem, borderColor: answers[i]?.isCorrect ? '#10B981' : '#EF4444'}}>
                <div style={{display:'flex', gap:8, alignItems:'flex-start'}}>
                  {answers[i]?.isCorrect
                    ? <FiCheckCircle color="#10B981" size={18} style={{flexShrink:0, marginTop:2}}/>
                    : <FiXCircle    color="#EF4444" size={18} style={{flexShrink:0, marginTop:2}}/>
                  }
                  <div>
                    <p style={{fontWeight:600, marginBottom:4, fontSize:14}}>{q.question_text}</p>
                    {!answers[i]?.isCorrect && (
                      <p style={{fontSize:12, color:'#10B981'}}>✓ Correct: Option {q.correct_answer}</p>
                    )}
                    {q.explanation && (
                      <p style={{fontSize:12, color:'var(--text-muted)', marginTop:4}}>{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{display:'flex', gap:12, justifyContent:'center'}}>
            <button className="btn btn-primary" onClick={() => { setCurrent(0); setAnswers([]); setSelected(null); setTimer(30); setFinished(false); }}>
              Retry Quiz
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>Home</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Question Screen ──
  const question = quiz.questions[current];
  const options  = [
    { key:'A', text: question.option_a },
    { key:'B', text: question.option_b },
    { key:'C', text: question.option_c },
    { key:'D', text: question.option_d },
  ];
  const progress = ((current) / quiz.questions.length) * 100;

  return (
    <div className="container" style={{padding:'32px 20px', maxWidth:680}}>
      <div className="card" style={{padding:32}}>
        {/* Header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
          <div>
            <h2 style={{fontSize:18, fontWeight:700}}>{quiz.title}</h2>
            <p style={{color:'var(--text-muted)', fontSize:13}}>Question {current+1} of {quiz.questions.length}</p>
          </div>
          <div style={{...styles.timerBadge, background: timer<=10 ? '#EF444420':'#3B82F620', color: timer<=10?'#EF4444':'#3B82F6'}}>
            <FiClock size={14}/> {timer}s
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressBg}>
          <div style={{...styles.progressFill, width:`${progress}%`}}/>
        </div>

        {/* Question */}
        <h3 style={{margin:'24px 0 20px', lineHeight:1.5}}>{question.question_text}</h3>

        {/* Options */}
        <div style={{display:'flex', flexDirection:'column', gap:12, marginBottom:28}}>
          {options.map(opt => (
            <button
              key={opt.key}
              onClick={() => setSelected(opt.key)}
              style={{
                ...styles.optionBtn,
                borderColor: selected === opt.key ? '#3B82F6' : 'var(--border)',
                background:  selected === opt.key ? '#3B82F610' : 'var(--surface)',
                color: selected === opt.key ? '#3B82F6' : 'var(--text)',
              }}
            >
              <span style={styles.optionKey}>{opt.key}</span>
              {opt.text}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!selected}
          style={{width:'100%', justifyContent:'center', opacity: selected ? 1 : 0.5}}
        >
          {current + 1 === quiz.questions.length ? 'Finish Quiz' : 'Next Question →'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  timerBadge:  { display:'flex', gap:6, alignItems:'center', padding:'8px 14px', borderRadius:20, fontWeight:700, fontSize:15 },
  progressBg:  { height:6, background:'var(--border)', borderRadius:10, overflow:'hidden' },
  progressFill:{ height:'100%', background:'linear-gradient(90deg,#3B82F6,#8B5CF6)', borderRadius:10, transition:'width 0.3s' },
  optionBtn:   {
    display:'flex', alignItems:'center', gap:14,
    padding:'14px 16px', borderRadius:10, border:'2px solid',
    cursor:'pointer', textAlign:'left', fontSize:15, fontWeight:500,
    transition:'all 0.15s', background:'var(--surface)',
  },
  optionKey:   {
    width:30, height:30, borderRadius:8, background:'var(--bg)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontWeight:700, flexShrink:0, fontSize:14,
  },
  reviewItem:  { padding:12, borderLeft:'3px solid', marginBottom:12, borderRadius:'0 8px 8px 0', background:'var(--bg)' },
};

export default QuizPage;