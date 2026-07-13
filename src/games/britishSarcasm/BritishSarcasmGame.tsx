import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './BritishSarcasmGame.css';

interface QuizQuestion {
  id: number;
  phrase: string;
  literalMeaningJa: string;
  literalMeaningEn: string;
  situationJa: string;
  situationEn: string;
  characterRoleJa: string;
  characterRoleEn: string;
  optionsJa: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationJa: string;
  explanationEn: string;
  sarcasmLevel: number; // 1 to 5 stars
  sarcasmLabelJa: string;
  sarcasmLabelEn: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    phrase: "With all due respect...",
    literalMeaningJa: "すべての敬意を払って申し上げますが…",
    literalMeaningEn: "With all the respect that is owed to you...",
    situationJa: "重要なプロジェクト会議で、自信満々の部長が論理的に破綻した非現実的な計画を発表した時、英国人ベテラン社員が紅茶を一口飲んで穏やかに口を開いた。",
    situationEn: "In a high-stakes strategy meeting, an overly confident boss proposes an illogical plan. A senior British colleague sips tea and smoothly begins to speak.",
    characterRoleJa: "英国人ベテラン社員 (エドワード)",
    characterRoleEn: "Senior British Colleague (Edward)",
    optionsJa: [
      "あなたの素晴らしい意見を深く尊敬し、全面的に賛同します！",
      "あなたは完全に間違えているし、そのアイデアは救いようがないバカげた案です。",
      "もう少しだけ検討する時間をいただければ、最高のプランになりそうです。",
      "尊敬するあなたの代わりに、私がリーダーをやりますよ。"
    ],
    optionsEn: [
      "I deeply respect your vision and agree 100%!",
      "You are completely wrong, and your idea is an absolute disaster without hope.",
      "If we take just a bit more time, this will become an incredible plan.",
      "Out of respect for you, I volunteer to lead this project instead."
    ],
    correctIndex: 1,
    explanationJa: "イギリス人が \"With all due respect...\"（すべての敬意を払って言いますが）と言い出した時は、相手への『敬意ゼロ』です。相手の意見がいかに的外れで愚かであるかを、礼儀のベールに包んで完全に論破・全否定する開始の合図です。",
    explanationEn: "When a British person begins with 'With all due respect...', the actual respect level is zero. It is the formal declaration of diplomatic war, about to completely dismantle and reject your idea while maintaining a polite smile.",
    sarcasmLevel: 5,
    sarcasmLabelJa: "致死量の礼儀正しい毒 (100% Lethal)",
    sarcasmLabelEn: "100% Lethal Polite Poison"
  },
  {
    id: 2,
    phrase: "That's a very brave decision.",
    literalMeaningJa: "それはとても勇敢な決断ですね。",
    literalMeaningEn: "That is a very courageous choice.",
    situationJa: "金曜日の夕方17時30分。新人エンジニアが「テストがまだ終わってませんが、今から本番データベースの大規模アップデートを実行します！」と宣言した時、テックリードが眉をひそめて言った。",
    situationEn: "Friday at 5:30 PM. A junior developer announces: 'I haven't finished testing, but I'm deploying the major database migration right now!' The tech lead raises one eyebrow and comments.",
    characterRoleJa: "英国人テックリード (アーサー)",
    characterRoleEn: "British Tech Lead (Arthur)",
    optionsJa: [
      "君の果敢なチャレンジ精神は本当に素晴らしい！将来有望だ！",
      "金曜夕方にそんなリスクを取るなんて、前例のない革新的なイノベーションだ！",
      "正気ですか？あなたは自ら破滅へ向かう愚行を犯そうとしていて、私は一切責任を持ちませんよ。",
      "勇敢な君の度胸を讃えて、今夜はパブでビールをおごろう！"
    ],
    optionsEn: [
      "Your adventurous spirit is inspiring! You have a great future here!",
      "Taking such risks on a Friday evening is a ground-breaking innovation!",
      "Are you insane? You are about to commit self-destruction, and I am washing my hands of all responsibility.",
      "To celebrate your bravery, pints at the pub tonight are on me!"
    ],
    correctIndex: 2,
    explanationJa: "イギリス英語における \"Brave\"（勇敢な）は、ビジネスや外交において「常識を疑うほどの愚行」「自ら破滅に向かう信じられないバカげた行動」を指す最高峰の皮肉です。絶賛されていると勘違いしてはいけません。",
    explanationEn: "In British corporate and political doublespeak, 'Brave' means completely insane, reckless, and destined for disaster. Calling your decision 'brave' is their way of standing back while you drive into a cliff.",
    sarcasmLevel: 5,
    sarcasmLabelJa: "自業自得・破滅への警鐘 (Self-Destruction Alert)",
    sarcasmLabelEn: "Insanity & Self-Destruction Alert"
  },
  {
    id: 3,
    phrase: "Mmm, quite good.",
    literalMeaningJa: "うーん、なかなか良いですね。",
    literalMeaningEn: "Mmm, quite good.",
    situationJa: "フランスの3つ星レストランにて。シェフが最高級の食材を使い、何時間もかけて作り上げた究極のフルコース料理。それを口に運んだ英国人紳士が、落ち着いた声でポツリと言った。",
    situationEn: "At a 3-star Michelin restaurant in Paris. The chef serves an exquisite masterpiece prepared over several hours. The British gentleman tastes a forkful and remarks quietly.",
    characterRoleJa: "英国人美食家紳士 (ウィリアム)",
    characterRoleEn: "British Gourmand (William)",
    optionsJa: [
      "少しがっかりした。期待外れで平均以下、あるいは平凡極まりない。",
      "人生で食べた中でダントツで一番美味しい、伝説級の絶品料理だ！",
      "料理自体は良いが、合わせるワインのセレクションに少し不満がある。",
      "『かなり良い』という意味なので、100点満点中95点以上の大絶賛！"
    ],
    optionsEn: [
      "I am somewhat disappointed. It's below average or utterly uninspiring.",
      "This is the most extraordinary culinary miracle I have tasted in my entire life!",
      "The food is good, but the wine pairing leaves something to be desired.",
      "Since 'quite' means 'very', this is a glowing 95/100 five-star review!"
    ],
    correctIndex: 0,
    explanationJa: "アメリカ人が \"Quite good\" と言えば本当に良い意味ですが、イギリス人が言う \"Quite good\" は「期待外れ・悪くないが失望感がある」という意味です。逆にイギリス人が本当に感動した時は \"Not bad at all\"（全然悪くないね）や \"Lovely\" と表現します。",
    explanationEn: "To an American, 'quite good' means impressive. To a Brit, 'quite good' means a polite disappointment or mediocre at best. If a Brit is genuinely blown away by something, they will typically say 'Not bad at all!'",
    sarcasmLevel: 4,
    sarcasmLabelJa: "上品な失望感 (Polite Disappointment)",
    sarcasmLabelEn: "Polite Disappointment & Mediocrity"
  },
  {
    id: 4,
    phrase: "I almost agree with you.",
    literalMeaningJa: "あなたとほぼ意見が一致しています。",
    literalMeaningEn: "I almost agree with you.",
    situationJa: "ブレインストーミングの会議中。同僚が20分間熱弁を振るい、独自のマーケティング戦略をプレゼンした。それを聞いた英国人マネージャーが優しい笑顔を浮かべて答えた。",
    situationEn: "During a long strategy workshop, a colleague spends 20 minutes passionately presenting their new marketing framework. The British manager smiles gently and replies.",
    characterRoleJa: "英国人マネージャー (チャールズ)",
    characterRoleEn: "British Manager (Charles)",
    optionsJa: [
      "99%賛成！あと1%だけ細かい語尾や数字を修正すれば完璧なプランだ！",
      "あなたの意見には1ミリも賛同しません。そもそも前提から全く話になりません。",
      "あなたの熱意と気迫に負けました。あなたの提案通りに進めましょう！",
      "すみません、ぼーっとしていて前半の15分間は話を聞いていませんでした。"
    ],
    optionsEn: [
      "I agree 99%! We just need to tweak one tiny detail and it's ready to go!",
      "I do not agree with a single word you just said. Your entire premise is absurd.",
      "Your passion won me over. Let's do it exactly the way you proposed!",
      "I drifted off to sleep and didn't hear the first 15 minutes of your talk."
    ],
    correctIndex: 1,
    explanationJa: " \"I almost agree\" や \"I hear what you say\"（おっしゃることは分かります）は、「あなたの言葉は耳に入りましたが、100%反対です・完全に無視します」という社交辞令の極致です。「ほぼ賛成」と受け取ると大惨事になります。",
    explanationEn: "'I almost agree' is polite British translation for 'I completely disagree with everything you stand for.' It allows the speaker to shut down the idea without engaging in a direct shouting match.",
    sarcasmLevel: 5,
    sarcasmLabelJa: "100%完全論破・全否定 (Absolute Disagreement)",
    sarcasmLabelEn: "100% Absolute Disagreement"
  },
  {
    id: 5,
    phrase: "You must come for dinner sometime.",
    literalMeaningJa: "いつかぜひ夕食にいらしてくださいね。",
    literalMeaningEn: "You must come for dinner sometime.",
    situationJa: "ロンドン市内のパーティーで知り合った知人。帰り際に玄関先で楽しく雑談を交わした後、知人が笑顔で握手を求めながらこう言った。",
    situationEn: "At a gathering in London, you chat with an acquaintance near the exit. As they put on their coat to leave, they shake your hand warmly and say.",
    characterRoleJa: "英国人の知人 (エレノア)",
    characterRoleEn: "British Acquaintance (Eleanor)",
    optionsJa: [
      "来週金曜の夜19時に我が家でお待ちしております！ローストビーフを焼きますね。",
      "今すぐ我が家に行って、朝まで一緒にワインを飲み明かしましょう！",
      "じゃあまたいつか（※具体的な日程を決める気は一切なく、二度と招待することはない社交辞令）。",
      "もしよければ、私が今度あなたの家に夕食を食べに行ってもいいですか？"
    ],
    optionsEn: [
      "Please come to my house next Friday at 7 PM sharp! I will prepare roast beef.",
      "Let's head over to my flat right now and open three bottles of wine!",
      "Goodbye forever (this is pure social etiquette; no dinner will ever be scheduled or cooked).",
      "Would it be acceptable if I invited myself over to your dining room next week?"
    ],
    correctIndex: 2,
    explanationJa: "これは京都人の「ぶぶ漬けどうどす？」と全く同じハイコンテクスト文化です。もし真に受けて「じゃあ来週の土曜日はどう？」と日程を詰めようとすると、相手は非常に恐怖と困惑を覚えることになります。",
    explanationEn: "This is the exact British equivalent of the famous Kyoto tea offer ('Would you like some bubuzuke?'). It is purely conversational polite filler. If you try to pull out your calendar and pick a date, the Brit will panic.",
    sarcasmLevel: 4,
    sarcasmLabelJa: "京都人レベルの社交辞令 (Kyoto-Level Diplomacy)",
    sarcasmLabelEn: "Kyoto-Level Social Diplomacy"
  },
  {
    id: 6,
    phrase: "Oh, not to worry at all!",
    literalMeaningJa: "あア、全く気にしないでくださいね！",
    literalMeaningEn: "Oh, not to worry at all!",
    situationJa: "お隣さんの庭でBBQ中、誤って英国人隣人が大切にしていたアンティークの庭の置物（ガーデングノーム）を割ってしまった！隣人は穏やかに微笑んで答えた。",
    situationEn: "During a garden BBQ, you accidentally bump into and shatter your British neighbor's beloved antique garden gnome. The neighbor smiles serenely and says.",
    characterRoleJa: "英国人のお隣さん (オリバー)",
    characterRoleEn: "British Neighbor (Oliver)",
    optionsJa: [
      "本当に気にしていない。むしろあの置物は古くて邪魔だったから感謝している！",
      "一生絶対に許さないし、これから永遠にあなたのことを『置物破壊犯』として記憶し続ける。",
      "弁償しなくて大丈夫ですが、代わりに美味しいスコーンを焼いてきてくださいね。",
      "全く問題ないので、隣にあるもう一つの置物も自由に壊していいですよ！"
    ],
    optionsEn: [
      "I truly do not care. In fact, I hated that gnome and you did me a huge favor!",
      "I will never forgive you for as long as I live, and I will silently hold a grudge against you forever.",
      "You don't need to pay for it, just bake some nice scones for us as an apology.",
      "No problem at all! Feel free to smash the other statue next to it as well!"
    ],
    correctIndex: 1,
    explanationJa: "イギリス人が平静を装って \"Not to worry\"（気にしないで）と言った時、心の中では激しい憤りと怒りのマグマが煮えたぎっています。直接口論にはなりませんが、今後10年間は静かな復讐心を持たれます。",
    explanationEn: "When a Brit says 'Not to worry' after you break something precious, they are boiling with internal rage. They consider it vulgar to express anger directly, but they will remember this betrayal for the next 20 years.",
    sarcasmLevel: 5,
    sarcasmLabelJa: "静かに煮えたぎる激怒 (Silent Volcano Rage)",
    sarcasmLabelEn: "Silent Volcano of Eternal Rage"
  },
  {
    id: 7,
    phrase: "That is certainly one way of looking at it.",
    literalMeaningJa: "確かに、それも一つの見方ではありますね。",
    literalMeaningEn: "That is certainly one way of looking at it.",
    situationJa: "ランチタイムの雑談中。同僚が「電車が5分遅れたのは、政府の秘密機関と宇宙人の陰謀だ！」と奇想天外な自説を語り始めた。英国人同僚は静かに頷いて口を開いた。",
    situationEn: "During a lunch chat, a colleague starts explaining that the train delay was caused by a secret government conspiracy and UFO interference. The British colleague nods calmly.",
    characterRoleJa: "英国人同僚 (ヘンリー)",
    characterRoleEn: "British Colleague (Henry)",
    optionsJa: [
      "あなたの鋭い洞察力に感服しました！素晴らしい目からウロコの視点ですね。",
      "君が何を言っているのかさっぱり分からないし、完全に狂っていると思うからこれ以上関わりたくない。",
      "君の見方も正しいし、私の見方も正しいという多様性と多角の尊重。",
      "もう一つの見方もぜひ教えてほしいという強い知的探究心の表れ。"
    ],
    optionsEn: [
      "I am amazed by your keen insight! What a fascinating and eye-opening perspective!",
      "You are utter gibberish and sound completely unhinged, and I want to end this conversation immediately.",
      "I respect diversity of thought; your view is just as valid as mine.",
      "I am deeply intrigued and would love to hear three more alternative perspectives!"
    ],
    correctIndex: 1,
    explanationJa: " 「それも一つの見方ですね」と言われた場合、「その見方は論理的に完全に破綻している・あるいはバカバカしすぎて議論する価値すらない」という意味になります。直接「バカか君は」と言わないための最高の防具です。",
    explanationEn: "'That is certainly one way of looking at it' translates to: 'That is the stupidest, most absurd theory I have ever heard, and I am stepping away from this conversation now.'",
    sarcasmLevel: 5,
    sarcasmLabelJa: "呆れ果てた完全拒絶 (Polite Dismissal of Insanity)",
    sarcasmLabelEn: "Polite Dismissal of Pure Insanity"
  },
  {
    id: 8,
    phrase: "I would suggest moving this logic...",
    literalMeaningJa: "私としては、このロジックを移動することを提案したいのですが…",
    literalMeaningEn: "I would suggest moving this logic when you have a moment...",
    situationJa: "あなたが提出したコードのプルリクエスト(PR)に対する、英国人テックリードのコードレビューコメント。「I would suggest moving this logic into a separate function when you have a moment.」",
    situationEn: "On your pull request, a British tech lead leaves a comment: 'I would suggest moving this logic into a separate utility function when you have a moment.'",
    characterRoleJa: "英国人テックリード (ジェームズ)",
    characterRoleEn: "British Tech Lead (James)",
    optionsJa: [
      "もし時間が余って暇なら、検討してみてねという軽い任意のアドバイス。",
      "やってもやらなくてもどちらでもいい自由選択のナイスアイデア。",
      "これは『いますぐ絶対に直せ』という絶対命令（強制）だ。直さない限りPRは承認しない。",
      "あなたが忙しいなら、私が代わりに直してあげますよという優しさ。"
    ],
    optionsEn: [
      "An optional, lighthearted suggestion to consider only if you have extra free time.",
      "A friendly brainwave that you are completely free to ignore if you prefer.",
      "This is a non-negotiable absolute command. Fix this immediately or your PR will never be merged.",
      "A generous offer that the tech lead will happily rewrite this code for you later."
    ],
    correctIndex: 2,
    explanationJa: "イギリス人の \"I would suggest...\" や \"Perhaps you could...\"、\"When you have a moment\" は、ただの提案やお願いではなく「絶対命令」です。もし従わずに放置した場合、冷ややかな視線とともに二度と信頼されなくなります。",
    explanationEn: "In polite British engineering culture, 'I would suggest' or 'Perhaps you could' is an absolute order. If you treat it as an optional suggestion and ignore it, you will face silent, freezing consequences.",
    sarcasmLevel: 5,
    sarcasmLabelJa: "絶対服従の命令 (Non-Negotiable Absolute Order)",
    sarcasmLabelEn: "Non-Negotiable Absolute Order"
  }
];

export const BritishSarcasmGame: React.FC = () => {
  const { language } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = quizQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedIdx !== null) return; // already answered
    setSelectedIdx(idx);
    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setScore(0);
    setIsFinished(false);
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < count ? 'star-filled' : 'star-empty'}>★</span>
    ));
  };

  return (
    <div className="container british-game animate-fade-in">
      {/* Game Header */}
      <div className="british-header">
        <h1 className="british-title">
          {language === 'ja' ? 'それってイギリス人の皮肉？あてゲーム' : 'Is That British Sarcasm?'}
        </h1>
      </div>

      {!isFinished ? (
        <div className="british-quiz-area">
          {/* Progress Bar */}
          <div className="quiz-progress-top">
            <span className="quiz-q-num">
              Question {currentIdx + 1} / {quizQuestions.length}
            </span>
            <div className="quiz-progress-track">
              <div
                className="quiz-progress-bar"
                style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
            <span className="quiz-score-live">
              Score: {score}
            </span>
          </div>

          {/* Question Card with dynamic situation background */}
          <div
            className="question-card"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.96) 100%), url(/british/q${currentQ.id}.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Situation Header Panel */}
            <div className="situation-panel">
              <div className="situation-role">
                <strong>{language === 'ja' ? currentQ.characterRoleJa : currentQ.characterRoleEn}</strong>
              </div>
              <div className="situation-desc">
                <span className="sit-tag">{language === 'ja' ? '【シチュエーション】' : '[Situation]'}</span>
                <p>{language === 'ja' ? currentQ.situationJa : currentQ.situationEn}</p>
              </div>
            </div>

            {/* British Quote Banner */}
            <div className="british-quote-box">
              <div className="quote-badge">BRITISH SPEAK</div>
              <blockquote className="quote-phrase">
                "{currentQ.phrase}"
              </blockquote>
              <div className="quote-literal">
                {language === 'ja' ? '文字通りの直訳：' : 'Literal translation: '}
                <em>{language === 'ja' ? currentQ.literalMeaningJa : currentQ.literalMeaningEn}</em>
              </div>
            </div>

            {/* Question prompt */}
            <div className="question-prompt">
              {language === 'ja' ? 'この言葉の「本当の真意（ホンネ）」はどれ？' : 'What is the speaker\'s REAL meaning?'}
            </div>

            {/* Options Grid */}
            <div className="options-grid">
              {(language === 'ja' ? currentQ.optionsJa : currentQ.optionsEn).map((opt, idx) => {
                const isSelected = selectedIdx === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let optionClass = 'option-card';
                if (selectedIdx !== null) {
                  if (isCorrect) optionClass += ' option-correct';
                  else if (isSelected && !isCorrect) optionClass += ' option-wrong';
                  else optionClass += ' option-disabled';
                }

                return (
                  <button
                    key={idx}
                    className={optionClass}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedIdx !== null}
                  >
                    <span className="option-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                    <span className="option-text">{opt}</span>
                    {selectedIdx !== null && isCorrect && (
                      <span className="option-result-icon">{language === 'ja' ? '正解！' : 'CORRECT!'}</span>
                    )}
                    {selectedIdx !== null && isSelected && !isCorrect && (
                      <span className="option-result-icon">{language === 'ja' ? '不正解…' : 'WRONG'}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Reveal Box after answering */}
            {selectedIdx !== null && (
              <div className={`reveal-box ${selectedIdx === currentQ.correctIndex ? 'reveal-success' : 'reveal-fail'} animate-fade-in`}>
                <div className="reveal-header">
                  <span className="reveal-title">
                    {selectedIdx === currentQ.correctIndex
                      ? (language === 'ja' ? '見事に真意を見破りました！' : 'Brilliant! You decoded the truth!')
                      : (language === 'ja' ? '社交辞令を真に受けてしまいました！' : 'Trapped by polite diplomacy!')}
                  </span>
                </div>

                <div className="sarcasm-meter">
                  <span className="meter-title">{language === 'ja' ? '皮肉＆本音レベル：' : 'Sarcasm Level: '}</span>
                  <span className="meter-stars">{renderStars(currentQ.sarcasmLevel)}</span>
                  <span className="meter-label">
                    ({language === 'ja' ? currentQ.sarcasmLabelJa : currentQ.sarcasmLabelEn})
                  </span>
                </div>

                <div className="reveal-explanation">
                  <h4>{language === 'ja' ? '英国人の真意解説' : 'Cultural Commentary'}</h4>
                  <p>{language === 'ja' ? currentQ.explanationJa : currentQ.explanationEn}</p>
                </div>

                <div className="next-btn-wrapper">
                  <button className="next-question-btn" onClick={handleNext}>
                    {currentIdx < quizQuestions.length - 1
                      ? (language === 'ja' ? '次の問題へ進む' : 'Next Question')
                      : (language === 'ja' ? '最終結果を見る' : 'See Final Results')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Final Result Screen */
        <div className="result-screen animate-fade-in">
          <div className="result-card">
            <h2 className="result-heading">
              {language === 'ja' ? '検定終了！あなたの最終結果' : 'Quiz Complete! Your Final Score'}
            </h2>
            <div className="result-score-big">
              {score} / {quizQuestions.length}
            </div>

            <div className="result-rank-box">
              <h3>{language === 'ja' ? '称号：' : 'Rank: '}</h3>
              {score === 8 ? (
                <div className="rank-title rank-master">
                  {language === 'ja' ? '「生粋の英国外交官＆京都人マスター」' : 'Master British Diplomat'}
                  <p>
                    {language === 'ja'
                      ? '素晴らしい！どんなに丁寧な言葉の裏に隠された毒や皮肉も完璧に見破ります。あなたはロンドンでも京都でも無敵です。'
                      : 'Flawless! You can perceive every drop of hidden sarcasm behind polite British smiles. You are invincible in London and Kyoto!'}
                  </p>
                </div>
              ) : score >= 5 ? (
                <div className="rank-title rank-advanced">
                  {language === 'ja' ? '「紅茶と皮肉を解する上級紳士」' : 'Advanced Tea & Sarcasm Connoisseur'}
                  <p>
                    {language === 'ja'
                      ? 'かなりの腕前です！大半の社交辞令を見破り、英国ビジネス界や社交界でも上手に生き抜くことができるでしょう。'
                      : 'Impressive! You can navigate most British doublespeak with grace and avoid disastrous misunderstandings.'}
                  </p>
                </div>
              ) : score >= 3 ? (
                <div className="rank-title rank-middle">
                  {language === 'ja' ? '「標準的な旅行者・時々惑わされる」' : 'Polite Tourist (Sometimes Misled)'}
                  <p>
                    {language === 'ja'
                      ? '半分ほどは言葉通りに受け取ってしまい、少し痛い目を見るかもしれません。もう少し額面通りではなく裏を読みましょう！'
                      : 'You often take polite words literally. Be careful when a British boss or neighbor smiles too warmly at you!'}
                  </p>
                </div>
              ) : (
                <div className="rank-title rank-rookie">
                  {language === 'ja' ? '「純真無垢なピュアハート」' : 'Pure Innocent Soul'}
                  <p>
                    {language === 'ja'
                      ? 'あなたはすべての言葉をそのまま信じる純粋な心の持ち主です。英国人の恐ろしい皮肉と本音の世界ではカモにされてしまいます！'
                      : 'You believe every polite compliment at face value! In the British corporate and social world, you will be eaten alive by politeness!'}
                  </p>
                </div>
              )}
            </div>

            <button className="restart-game-btn" onClick={handleRestart}>
              {language === 'ja' ? 'もう一度挑戦する' : 'Play Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
