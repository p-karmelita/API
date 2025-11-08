import Card from '../components/Card';
import ChatBox from '../components/ChatBox';
import { sendChatMessage } from '../api/api';

export default function Chat() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-600 mt-1">
          Use natural language to schedule payments and manage transactions
        </p>
      </div>

      <Card className="flex-1 flex flex-col min-h-[600px]">
        <ChatBox onSendMessage={async (msg) => {
          try {
            const res = await sendChatMessage(msg);
            return res.reply || 'Error: No response from AI';
          } catch (error) {
            return 'Error: Could not connect to AI assistant';
          }
        }} />
      </Card>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="font-medium text-blue-900 mb-2">Example Commands</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• "Pay rent on the 1st of every month"</li>
            <li>• "Transfer 600 USDC after contract is signed"</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="font-medium text-green-900 mb-2">Query Balance</p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• "What's my current balance?"</li>
            <li>• "Show me pending transactions"</li>
          </ul>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="font-medium text-purple-900 mb-2">Smart Automation</p>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• "Schedule insurance payment monthly"</li>
            <li>• "Set up automatic deposit transfers"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
