type Answer = {
  text: string;
  color: string;
  colorWord: string;
};

type InterviewBubblesProps = {
  question: string;
  answers: string;
};

function highlight(text: string, word: string, color: string) {
  const parts = text.split(new RegExp(`(${word})`, "i"));
  return parts.map((part, i) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <span key={i} style={{ color }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function InterviewBubbles({
  question,
  answers,
}: InterviewBubblesProps) {
  const parsed: Answer[] = JSON.parse(answers);

  return (
    <div className="not-prose mt-12 mb-16 flex flex-col items-center gap-0">
      <p className="font-display italic text-center text-2xl md:text-4xl text-white/85 leading-none mb-6">
        “{question}”
      </p>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {parsed.map((a, i) => (
          <div
            key={i}
            className="rounded-full border border-white/15 px-6 py-3 text-center text-base md:text-lg text-white/85"
          >
            “{highlight(a.text, a.colorWord, a.color)}”
          </div>
        ))}
      </div>
    </div>
  );
}
