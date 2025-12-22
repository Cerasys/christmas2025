import confetti from "canvas-confetti";
import React, { useState, useEffect, useRef } from "react";
import CodewordChallenge from "./CodeWord";

import { STAGES, FINAL_VIDEO_ID } from "./Stages";

export default function ScavengerHunt() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("scavengerHuntProgress");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [currentInput, setCurrentInput] = useState("");
  const [error, setError] = useState(false);
  const [revealedHints, setRevealedHints] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("scavengerHuntProgress", progress);

    if (progress > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [progress]);

  const handleCheckCode = (e) => {
    e.preventDefault();
    if (progress >= STAGES.length) return;

    const currentStageData = STAGES[progress];
    const normalizedInput = currentInput.trim().toLowerCase();

    if (normalizedInput === currentStageData.code) {
      if (progress === STAGES.length - 1) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff0000", "#00ff00", "#ffffff", "#ffd700"],
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
        <header className="text-center mb-8 relative">
          <h1 className="text-2xl font-bold text-red-700">
            🎄 A Very Fiance Christmas 🎄
          </h1>
          <p className="text-sm text-green-700 mt-2">
            Hello Yukino. Watch the video below 🫵😵
          </p>
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
          const isActive = index === progress;

          return (
            <div
              key={stage.id}
              className={`bg-white p-4 rounded-xl shadow-lg border-2 ${
                isCompleted ? "border-green-500" : "border-red-500"
              }`}
            >
              <h2
                className={`font-bold text-lg mb-2 text-red-600 ${
                  isCompleted ? "opacity-60" : ""
                }`}
              >
                {isCompleted
                  ? `Clue #${stage.id} Completed ✅`
                  : `Clue #${stage.id}`}
              </h2>

              {/* Main Video */}
              <div className="relative w-full aspect-video mb-4 bg-black rounded-lg overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${stage.videoId}${
                    isActive ? "?autoplay=1" : ""
                  }`}
                  title={`Stage ${stage.id} Video`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Hint Section */}
              {stage.hint && (
                <div className="text-center mb-4">
                  {!revealedHints.includes(stage.id) ? (
                    <button
                      onClick={() =>
                        setRevealedHints((prev) => [...prev, stage.id])
                      }
                      className="text-xs text-blue-600 underline hover:text-blue-800"
                    >
                      Need a hint? 💡
                    </button>
                  ) : (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-xs font-bold text-blue-800 mb-1">
                        HINT:
                      </p>
                      {stage.hint.type === "text" ? (
                        <p className="text-sm text-blue-900 italic">
                          "{stage.hint.content}"
                        </p>
                      ) : (
                        <div className="relative aspect-video rounded overflow-hidden">
                          <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${stage.hint.videoId}`}
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Active Stage Controls */}
              {isActive && (
                <div className="space-y-4">
                  <form onSubmit={handleCheckCode} className="space-y-3">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => {
                        setCurrentInput(e.target.value);
                        setError(false);
                      }}
                      placeholder="Enter code here..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
                    />
                    {error && (
                      <p className="text-red-600 text-sm font-semibold animate-pulse text-center">
                        Lol you're wrong that's not the right clue
                      </p>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                    >
                      😲 Get the Next Clue 🎁
                    </button>
                  </form>
                </div>
              )}

              {isCompleted && (
                <div className="text-green-700 text-sm font-medium opacity-60">
                  Clue found:{" "}
                  <span className="font-bold uppercase">{stage.code}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Final Celebration Section */}
        {progress === STAGES.length && (
          <div className="bg-white p-6 rounded-xl shadow-2xl border-4 border-yellow-400 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              🎉 Congratulations! 🎉
            </h2>
            <div className="relative w-full aspect-video mb-6 bg-black rounded-lg overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${FINAL_VIDEO_ID}?autoplay=1`}
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
