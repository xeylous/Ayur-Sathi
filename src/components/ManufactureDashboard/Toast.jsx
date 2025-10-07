export default function Toast({ message, type }) {
  if (!message) return null;
  const bg =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-gray-800";
  return (
    <div
      className={`${bg} fixed bottom-4 right-4 text-white p-4 rounded-lg shadow-2xl transition-opacity duration-300`}
    >
      {message}
    </div>
  );
}
