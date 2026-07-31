interface AnswerBoxProps {
  answer: string;
  sourceCount: number;
}

export function AnswerBox({ answer, sourceCount }: AnswerBoxProps) {
  return (
    <div
      className="rounded-[20px] border-l-4 p-5"
      style={{ background: "var(--color-accent-soft)", borderColor: "var(--color-accent)" }}
    >
      <p className="text-[18px] leading-relaxed font-medium" style={{ color: "var(--color-accent-soft-ink)" }}>
        {answer}
      </p>
      <p className="font-mono-meta mt-3 text-[11px] font-medium" style={{ color: "var(--color-accent-soft-ink)", opacity: 0.75 }}>
        Berdasarkan {sourceCount} sumber
      </p>
    </div>
  );
}
