import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Your actual website content goes here */}
      <p className="text-gray-400 text-sm">Your website content here</p>

      {/* Floating Chatbot Widget */}
      <ChatWidget />
    </div>
  );
}
