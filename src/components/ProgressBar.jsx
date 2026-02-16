export default function ProgressBar({ completed, total }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span>{completed} of {total} tasks completed</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
