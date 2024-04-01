import { useEffect } from 'react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API = 'https://emojihub.yurace.pro/api/all';

interface Emoji {
  unicode: string[];
  name: string;
  htmlCode: string;
}

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [emojis, setEmojis] = useState<Emoji[] | null>(null);
  const [filteredEmojis, setFilteredEmojis] = useState<Emoji[] | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [copiedEmoji, setCopiedEmoji] = useState<Emoji | null>(null);

  function handleCopyClipboard(emoji: Emoji) {
    navigator.clipboard.writeText(
      String.fromCodePoint(parseInt(emoji.unicode[0].replace('U+', ''), 16))
    );
    setCopiedEmoji(emoji);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  }


  function AlertScreen(emoji: Emoji | null) {
    if (!emoji) return null;

    return (
      <Alert className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 w-1/3'>
        <AlertTitle>Emoji Copied</AlertTitle>
        <AlertDescription>
          Copied {String.fromCodePoint(parseInt(emoji.unicode[0].replace('U+', ''), 16))} to clipboard
        </AlertDescription>
      </Alert>
    )
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(API);
      const data = await response.json();
      setEmojis(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (emojis) {
      const filtered = emojis.filter((emoji) =>
        emoji.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEmojis(filtered);
    }
  }, [query, emojis]);

  return (
    <>
      {showAlert && AlertScreen(copiedEmoji)}
      <div className='flex flex-col place-items-center px-40'>
        <h1 className='mt-20 text-center text-3xl font-bold'>
          😸 Emoji Arama Motoru 😺
        </h1>
        <input
          type='text'
          className='mt-5 mx-auto w-300px border-2 border-gray-800 rounded-md p-4'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div
        id='results'
        className='flex flex-col mt-4 gap-4 w-1/2 align-center mx-auto'
      >
        {filteredEmojis?.map((emoji) => (
          <div
            key={emoji.htmlCode[0] + emoji.name}
            onClick={() => handleCopyClipboard(emoji)}
            className='flex place-items-center justify-start gap-4 p-4 border-2 border-gray-800 rounded-md'
          >
            {/* display emojis */}
            <span className='text-2xl'>
              {String.fromCodePoint(
                parseInt(emoji.unicode[0].replace('U+', ''), 16)
              )}
            </span>
            <span>{emoji.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}
