'use client';

type Stage = {
  id: string;
  label: string;
};

const STAGES: Stage[] = [
  { id: 'registration', label: 'Registration' },
  { id: 'teams', label: 'Teams Ready' },
  { id: 'matches', label: 'Matches Live' },
  { id: 'winner', label: 'Winner' },
];

export default function ProgressTrack({
  started,
  finished,
  playerCount,
}: {
  started: boolean;
  finished: boolean;
  playerCount: number;
}) {
  const currentStage = finished
    ? 3
    : started
      ? 2
      : playerCount >= 2
        ? 1
        : 0;

  return (
    <div className="rounded-lg border p-3 hover-lift-glow">
      <p className="text-xs text-muted-foreground mb-2">Tournament Journey</p>
      <div className="flex items-center gap-2 flex-wrap">
        {STAGES.map((stage, idx) => (
          <div key={stage.id} className="flex items-center gap-2">
            <span
              className={`stage-chip ${idx === currentStage ? 'stage-chip-active' : ''} ${
                idx < currentStage ? 'border-green-500/60 text-green-300' : ''
              }`}
            >
              {stage.label}
            </span>
            {idx < STAGES.length - 1 && <span className="text-cyan-300/70">▶</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
