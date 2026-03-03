export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-accent-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">M</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">MyCampus</h1>
        <p className="text-text-secondary">Navigate. Connect. Stay Safe.</p>
        <p className="text-sm text-text-tertiary mt-4">
          Slice 0 Complete ✓
        </p>
      </div>
    </div>
  )
}
