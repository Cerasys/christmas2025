import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";

const CodewordChallenge = () => {
  const targetWord = "LUGGAGE";
  // Initialize state with an array of empty strings, one for each letter
  const [userInput, setUserInput] = useState(Array(targetWord.length).fill(""));
  const inputRefs = useRef([]);
  /*
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
  */

  const clues = [
    "The twelfth letter of Clue #3", // L
    "The second letter of Clue #4", // U
    "The first letter of Clue #5", // G
    "The fifth letter of Clue #7", // G
    "The fifth letter of Clue #2", // A
    "The first letter of Clue #6", // G
    "The fourth letter of Clue #1", // E
  ];

  const handleChange = (index, value) => {
    const newInputs = [...userInput];
    const char = value.slice(-1).toUpperCase();
    // Take only the last character entered and make it uppercase
    newInputs[index] = char;
    setUserInput(newInputs);

    // If a character was entered and there is a next input, focus it
    if (char && index < targetWord.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const isSolved = userInput.join("") === targetWord;

  useEffect(() => {
    if (isSolved) {
      confetti({
        particleCount: 550,
        spread: 200,
        origin: { y: 0.6 },
        colors: [
          "#ff0000",
          "#00ff00",
          "#ffffff",
          "#ffd700",
          "#ff69b4",
          "#00ced1",
        ], // Christmas colors!
      });
      confetti({
        particleCount: 350,
        spread: 300,
        origin: { y: 0.5 },
        colors: [
          "#ff0000",
          "#00ff00",
          "#ffffff",
          "#ffd700",
          "#ff69b4",
          "#00ced1",
        ], // Christmas colors!
      });
    }
  }, [isSolved]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Your Christmas Gift is in the...
      </h2>

      <div className="space-y-4">
        {clues.map((clue, index) => (
          <div key={index} className="flex items-center space-x-4">
            {/* Input Box */}
            <input
              key={index}
              type="text"
              maxLength="1"
              // Assign the ref to the array
              ref={(el) => (inputRefs.current[index] = el)}
              value={userInput[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg ...`}
              // Optional: move back on backspace
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !userInput[index] && index > 0) {
                  inputRefs.current[index - 1].focus();
                }
              }}
            />

            {/* Clue Text */}
            <span className="text-sm font-medium text-gray-600 italic">
              {clue}
            </span>
          </div>
        ))}
      </div>

      {/* Conditional Success Message */}

      {isSolved && (
        <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center font-bold animate-bounce">
          ✨ "LUGGAGE" - Woah! ✨ {<br />}Time to check if it's actually there
          {<br />}
          👀
        </div>
      )}
    </div>
  );
};

export default CodewordChallenge;
