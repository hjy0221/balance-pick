import { getTossShareLink, share } from "@apps-in-toss/web-framework";
import { Button, Top } from "@toss/tds-mobile";
import { useMemo, useState } from "react";
import "./App.css";

type Screen = "home" | "quiz" | "result";
type ResultKey = "spark" | "logic" | "harmony" | "curious";

type Choice = {
  emoji: string;
  label: string;
  result: ResultKey;
  votes: number;
};

type Question = {
  category: string;
  eyebrow: string;
  title: string;
  choices: [Choice, Choice];
};

const QUESTIONS: Question[] = [
  {
    category: "음식",
    eyebrow: "영원한 난제",
    title: "탕수육이 나왔다. 나는?",
    choices: [
      {
        emoji: "🥣",
        label: "소스를 과감하게 붓는다",
        result: "spark",
        votes: 6231,
      },
      {
        emoji: "🥢",
        label: "끝까지 바삭하게 찍어 먹는다",
        result: "logic",
        votes: 7349,
      },
    ],
  },
  {
    category: "일상",
    eyebrow: "갑자기 생긴 하루",
    title: "주말 약속이 취소됐다면?",
    choices: [
      {
        emoji: "⚡",
        label: "바로 다른 친구에게 연락한다",
        result: "spark",
        votes: 4812,
      },
      {
        emoji: "🛋️",
        label: "오히려 좋아, 혼자 충전한다",
        result: "curious",
        votes: 5926,
      },
    ],
  },
  {
    category: "직장",
    eyebrow: "회의가 길어질 때",
    title: "내 의견과 정반대인 이야기가 나왔다",
    choices: [
      {
        emoji: "🙋",
        label: "근거를 정리해 바로 말한다",
        result: "logic",
        votes: 7014,
      },
      {
        emoji: "🤝",
        label: "일단 끝까지 듣고 조율한다",
        result: "harmony",
        votes: 8451,
      },
    ],
  },
  {
    category: "연락",
    eyebrow: "읽씹 3시간째",
    title: "친한 친구의 답장이 없다면?",
    choices: [
      {
        emoji: "📨",
        label: "바쁜가 보다 하고 기다린다",
        result: "harmony",
        votes: 9028,
      },
      {
        emoji: "👀",
        label: "재밌는 짤을 하나 더 보낸다",
        result: "spark",
        votes: 6142,
      },
    ],
  },
  {
    category: "여행",
    eyebrow: "출발 하루 전",
    title: "여행 계획은 어느 정도가 좋을까?",
    choices: [
      {
        emoji: "🗺️",
        label: "동선과 맛집까지 완벽하게",
        result: "logic",
        votes: 5380,
      },
      {
        emoji: "🎒",
        label: "숙소만 잡고 발길 가는 대로",
        result: "curious",
        votes: 5872,
      },
    ],
  },
  {
    category: "관계",
    eyebrow: "친구가 고민을 털어놨다",
    title: "내가 먼저 하는 말은?",
    choices: [
      {
        emoji: "💛",
        label: "그랬구나, 진짜 힘들었겠다",
        result: "harmony",
        votes: 10031,
      },
      {
        emoji: "🧩",
        label: "그럼 이렇게 해보는 건 어때?",
        result: "logic",
        votes: 7744,
      },
    ],
  },
  {
    category: "취향",
    eyebrow: "새로운 카페 발견",
    title: "메뉴를 고르는 나의 방식은?",
    choices: [
      {
        emoji: "☕",
        label: "검증된 시그니처 메뉴",
        result: "logic",
        votes: 6670,
      },
      {
        emoji: "🧪",
        label: "처음 보는 독특한 메뉴",
        result: "curious",
        votes: 5889,
      },
    ],
  },
  {
    category: "선택",
    eyebrow: "인생 버튼 하나",
    title: "둘 중 하나를 가질 수 있다면?",
    choices: [
      {
        emoji: "⏪",
        label: "딱 한 번, 과거로 돌아가기",
        result: "harmony",
        votes: 8055,
      },
      {
        emoji: "🔮",
        label: "딱 한 번, 미래 미리 보기",
        result: "curious",
        votes: 9238,
      },
    ],
  },
];

const RESULTS: Record<
  ResultKey,
  {
    emoji: string;
    name: string;
    title: string;
    description: string;
    keywords: string[];
    color: string;
  }
> = {
  spark: {
    emoji: "⚡",
    name: "번개형 직진러",
    title: "재미의 신호가 오면 바로 움직여요",
    description:
      "눈치만 보다가 기회를 놓치는 법이 없어요. 빠른 실행력과 솔직한 표현으로 모임의 온도를 올리는 사람이에요.",
    keywords: ["#추진력", "#솔직함", "#분위기메이커"],
    color: "#ff8a3d",
  },
  logic: {
    emoji: "🧭",
    name: "계획형 해결사",
    title: "복잡한 상황도 기준을 세워 풀어가요",
    description:
      "선택 앞에서 휩쓸리기보다 내 기준을 믿어요. 함께 있으면 왠지 일이 잘 풀리는 든든한 사람이에요.",
    keywords: ["#판단력", "#계획적", "#든든함"],
    color: "#3182f6",
  },
  harmony: {
    emoji: "💛",
    name: "공감형 평화주의자",
    title: "사람의 마음을 먼저 살피는 편이에요",
    description:
      "말보다 분위기와 표정을 먼저 읽어요. 편안하게 이야기를 꺼낼 수 있어 주변 사람들이 자주 기대는 사람이에요.",
    keywords: ["#공감력", "#배려", "#따뜻함"],
    color: "#f5b700",
  },
  curious: {
    emoji: "🔮",
    name: "호기심형 탐험가",
    title: "익숙한 답보다 새로운 가능성이 좋아요",
    description:
      "남들이 정한 정답보다 직접 경험한 답을 믿어요. 혼자서도 잘 놀고 새로운 취향을 발견하는 데 능숙해요.",
    keywords: ["#호기심", "#독립적", "#새로움"],
    color: "#6c5ce7",
  },
};

function getResult(answers: ResultKey[]): ResultKey {
  const scores: Record<ResultKey, number> = {
    spark: 0,
    logic: 0,
    harmony: 0,
    curious: 0,
  };

  answers.forEach((answer) => {
    scores[answer] += 1;
  });

  return (Object.entries(scores) as [ResultKey, number][]).reduce(
    (best, current) => (current[1] > best[1] ? current : best),
  )[0];
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<ResultKey[]>([]);
  const [shareNotice, setShareNotice] = useState("");

  const resultKey = useMemo(() => getResult(answers), [answers]);
  const result = RESULTS[resultKey];
  const question = QUESTIONS[questionIndex];
  const progress = ((questionIndex + 1) / QUESTIONS.length) * 100;

  const startQuiz = () => {
    setQuestionIndex(0);
    setSelectedChoice(null);
    setAnswers([]);
    setShareNotice("");
    setScreen("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (choiceIndex: number) => {
    if (selectedChoice != null || question == null) {
      return;
    }

    setSelectedChoice(choiceIndex);
    setAnswers((current) => [...current, question.choices[choiceIndex].result]);
  };

  const advance = () => {
    if (questionIndex === QUESTIONS.length - 1) {
      setScreen("result");
    } else {
      setQuestionIndex((current) => current + 1);
      setSelectedChoice(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    if (selectedChoice == null) {
      return;
    }

    advance();
  };

  const shareResult = async () => {
    const messagePrefix = `나는 ${result.name}! ${result.title}\n밸런스픽에서 너의 선택도 확인해 봐.`;

    try {
      const isTossApp = "ReactNativeWebView" in window;
      if (isTossApp) {
        const tossLink = await getTossShareLink("intoss://balance-pick");
        await share({ message: `${messagePrefix}\n${tossLink}` });
      } else if (navigator.share != null) {
        await navigator.share({
          title: "밸런스픽 결과",
          text: messagePrefix,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `${messagePrefix}\n${window.location.href}`,
        );
        setShareNotice("결과 링크를 복사했어요");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setShareNotice("공유하지 못했어요. 잠시 후 다시 시도해 주세요");
    }
  };

  if (screen === "home") {
    return (
      <main className="app-shell home-screen">
        <div className="home-topline">
          <span className="brand-mark" aria-hidden="true">
            B
          </span>
          <strong>밸런스픽</strong>
          <span className="today-chip">오늘의 8문제</span>
        </div>

        <section className="hero-section">
          <p className="eyebrow">3초 안에 골라보세요</p>
          <h1>
            선택만 했는데
            <br />
            <span>내 성향이 보인다고?</span>
          </h1>
          <p className="hero-description">
            고민할수록 어려워져요.
            <br />첫 느낌대로 가볍게 골라보세요.
          </p>

          <div className="hero-balance-card" aria-hidden="true">
            <div className="mini-choice left-choice">
              <span>🥣</span>
              <strong>부먹</strong>
            </div>
            <div className="versus-badge">VS</div>
            <div className="mini-choice right-choice">
              <span>🥢</span>
              <strong>찍먹</strong>
            </div>
          </div>
        </section>

        <section className="start-panel">
          <div className="start-meta">
            <div>
              <strong>약 1분</strong>
              <span>소요 시간</span>
            </div>
            <div className="meta-divider" />
            <div>
              <strong>12,842명</strong>
              <span>오늘 참여</span>
            </div>
            <div className="meta-divider" />
            <div>
              <strong>8개</strong>
              <span>밸런스 질문</span>
            </div>
          </div>
          <Button display="full" size="xlarge" onClick={startQuiz}>
            지금 시작하기
          </Button>
          <p className="privacy-note">로그인 없이 바로 참여할 수 있어요</p>
        </section>
      </main>
    );
  }

  if (screen === "result") {
    return (
      <main className="app-shell result-screen">
        <div className="result-topline">
          <button
            className="text-button"
            type="button"
            onClick={() => setScreen("home")}
          >
            처음으로
          </button>
          <span>밸런스픽 결과</span>
          <span className="topline-spacer" />
        </div>

        <section
          className="result-hero"
          style={{ "--result-color": result.color } as React.CSSProperties}
        >
          <p className="eyebrow">나의 선택 성향은</p>
          <div className="result-emoji" aria-hidden="true">
            {result.emoji}
          </div>
          <h1>{result.name}</h1>
          <h2>{result.title}</h2>
        </section>

        <section className="result-card">
          <p>{result.description}</p>
          <div className="keyword-list">
            {result.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </section>

        <section className="result-actions">
          <Button display="full" size="xlarge" onClick={shareResult}>
            친구에게 결과 공유하기
          </Button>
          <Button
            display="full"
            size="large"
            variant="weak"
            color="dark"
            onClick={startQuiz}
          >
            다시 해보기
          </Button>
          {shareNotice ? (
            <p className="share-notice" role="status">
              {shareNotice}
            </p>
          ) : null}
        </section>
      </main>
    );
  }

  if (question == null) {
    return null;
  }

  const totalVotes =
    question.choices[0].votes +
    question.choices[1].votes +
    (selectedChoice == null ? 0 : 1);
  const leftVotes = question.choices[0].votes + (selectedChoice === 0 ? 1 : 0);
  const leftPercent = Math.round((leftVotes / totalVotes) * 100);
  const percentages = [leftPercent, 100 - leftPercent];

  return (
    <main className="app-shell quiz-screen">
      <header className="quiz-header">
        <button
          className="close-button"
          type="button"
          onClick={() => setScreen("home")}
          aria-label="퀴즈 닫기"
        >
          ×
        </button>
        <div className="progress-wrap">
          <div className="progress-label">
            <span>{questionIndex + 1}</span>
            <span>/{QUESTIONS.length}</span>
          </div>
          <div
            className="progress-track"
            aria-label={`${Math.round(progress)}% 완료`}
          >
            <div className="progress-value" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <Top
        upperGap={8}
        lowerGap={8}
        subtitleTop={
          <Top.SubtitleParagraph>
            {question.category} · {question.eyebrow}
          </Top.SubtitleParagraph>
        }
        title={
          <Top.TitleParagraph size={28}>{question.title}</Top.TitleParagraph>
        }
      />

      <section className="choice-area" aria-label="답변 선택">
        {question.choices.map((choice, choiceIndex) => {
          const isSelected = selectedChoice === choiceIndex;
          const isDimmed = selectedChoice != null && !isSelected;

          return (
            <button
              key={choice.label}
              className={`choice-card ${isSelected ? "selected" : ""} ${isDimmed ? "dimmed" : ""}`}
              type="button"
              onClick={() => choose(choiceIndex)}
              aria-pressed={isSelected}
            >
              <span className="choice-emoji" aria-hidden="true">
                {choice.emoji}
              </span>
              <strong>{choice.label}</strong>
              {selectedChoice != null ? (
                <div className="vote-result">
                  <div className="vote-row">
                    <span>{isSelected ? "내 선택" : "참여 결과"}</span>
                    <b>{percentages[choiceIndex]}%</b>
                  </div>
                  <div className="vote-track">
                    <div
                      className="vote-value"
                      style={{ width: `${percentages[choiceIndex]}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span className="tap-hint">이쪽을 선택할래요</span>
              )}
            </button>
          );
        })}
        <div className="choice-versus" aria-hidden="true">
          VS
        </div>
      </section>

      {selectedChoice != null ? (
        <section className="next-action">
          <p>
            <strong>{totalVotes.toLocaleString("ko-KR")}명</strong>의 선택을
            반영했어요
          </p>
          <Button display="full" size="xlarge" onClick={goNext}>
            {questionIndex === QUESTIONS.length - 1
              ? "결과 확인하기"
              : "다음 문제"}
          </Button>
        </section>
      ) : (
        <p className="choice-guide">
          정답은 없어요. 더 끌리는 쪽을 선택해 주세요.
        </p>
      )}
    </main>
  );
}

export default App;
