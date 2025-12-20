import confetti from "canvas-confetti";
import React, { useState, useEffect, useRef } from "react";
import CodewordChallenge from "./CodeWord";

// Configuration for the 8 stages
// REPLACE 'VIDEO_ID_HERE' with the actual YouTube ID (the part after v= in the URL)
const STAGES = [
  { id: 1, code: "friends", videoId: "VIDEO_ID_1" },
  { id: 2, code: "stomach", videoId: "VIDEO_ID_2" },
  { id: 3, code: "professionalchef", videoId: "VIDEO_ID_3" },
  { id: 4, code: "bulldogs", videoId: "VIDEO_ID_4" },
  { id: 5, code: "genki", videoId: "VIDEO_ID_5" },
  { id: 6, code: "girl", videoId: "VIDEO_ID_6" },
  { id: 7, code: "engaged", videoId: "VIDEO_ID_7" },
  { id: 8, code: "done", videoId: "VIDEO_ID_8" },
];

const FINAL_VIDEO_ID = "FINAL_VIDEO_ID";

export default function ScavengerHunt() {
  // Initialize state from LocalStorage if available, otherwise default to 0
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("scavengerHuntProgress");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [currentInput, setCurrentInput] = useState("");
  const [error, setError] = useState(false);
  const bottomRef = useRef(null);

  // SAVE PROGRESS: Whenever 'progress' changes, save it to LocalStorage
  useEffect(() => {
    localStorage.setItem("scavengerHuntProgress", progress);

    // Auto-scroll to bottom when new level unlocks
    if (progress > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [progress]);

  const handleCheckCode = (e) => {
    e.preventDefault();
    const currentStageData = STAGES[progress];
    const normalizedInput = currentInput.trim().toLowerCase();

    if (normalizedInput === currentStageData.code) {
      // If this was the last code ("done")
      if (progress === STAGES.length - 1) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff0000", "#00ff00", "#ffffff", "#ffd700"], // Christmas colors!
        });
      }

      setProgress((prev) => prev + 1);
      setCurrentInput("");
      setError(false);
    } else {
      setError(true);
    }
  };

  // Optional: Reset button for testing (you can remove this before giving it to her)
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      setProgress(0);
      localStorage.removeItem("scavengerHuntProgress");
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 py-10 px-4 font-sans text-slate-800">
      <div className="max-w-md mx-auto space-y-12">
        {/* Header */}
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold text-red-700">
            🎄 A Fiance Christmas 🎄
          </h1>
          <p className="text-sm text-green-700 mt-2">
            Hello Yukino. Watch the video below 🫵😵
          </p>
          <br />
          {/* Hidden Reset Button for you to test */}
          <button
            onClick={handleReset}
            className="absolute top-12 right-0 text-xs text-gray-400 hover:text-red-500"
          >
            Reset Progress
          </button>
        </header>

        {STAGES.map((stage, index) => {
          if (index > progress) return null;
          const isCompleted = index < progress;

          return (
            <div
              key={stage.id}
              className={`bg-white p-4 rounded-xl shadow-lg border-2 ${
                isCompleted ? "border-green-500 opacity-80" : "border-red-500"
              }`}
            >
              <h2 className="font-bold text-lg mb-2 text-red-600">
                {isCompleted
                  ? `Clue #${stage.id} Completed ✅`
                  : `Clue #${stage.id}`}
              </h2>

              <div className="relative w-full aspect-video mb-4 bg-black rounded-lg overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${stage.videoId}`}
                  title={`Stage ${stage.id} Video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {!isCompleted && (
                <form onSubmit={handleCheckCode} className="space-y-3">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => {
                      setCurrentInput(e.target.value);
                      setError(false);
                    }}
                    placeholder="Enter code here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  {error && (
                    <p className="text-red-600 text-sm font-semibold animate-pulse">
                      Lol you're wrong, that's not the right code.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    😲 Get the Next Clue 🎁
                  </button>
                </form>
              )}

              {isCompleted && (
                <div className="text-green-700 text-sm font-medium">
                  Clue found:{" "}
                  <span className="font-bold uppercase">{stage.code}</span>
                </div>
              )}
            </div>
          );
        })}

        {progress === 8 && (
          <div className="bg-white p-6 rounded-xl shadow-2xl border-4 border-gold-500 ring-4 ring-yellow-200">
            <h2 className="text-2xl font-bold text-center mb-4 text-red-600">
              🎉 Congratulations! 🎉
            </h2>
            <div className="relative w-full aspect-video mb-6 bg-black rounded-lg overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${FINAL_VIDEO_ID}`}
                title="Final Video"
                allowFullScreen
              ></iframe>
            </div>
            <CodewordChallenge />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
