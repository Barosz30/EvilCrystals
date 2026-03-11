export function AmbientDust() {
  return (
    <div className="ambient-dust" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <span key={i} />
      ))}
    </div>
  )
}
