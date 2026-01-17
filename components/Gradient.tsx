export default function GradientBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl"></div>
    </div>
  );
}
