export default function Loader() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div
        className="rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"
        style={{ borderTopColor: "#3498db" }}
      ></div>
      <p className="text-gray-500 pb-3 text-xl ml-3">Loading...</p>
    </div>
  );
}
