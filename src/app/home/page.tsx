'use client';
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Inter, Orbitron } from 'next/font/google';
import { useRouter } from 'next/navigation';
import styles from './home.module.css';
import { Link2 } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });


export default function HomePage() {
  const [inputText, setInputText] = useState('');
  const [summaries, setSummaries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSummarize = async () => {
    if (!inputText.trim()) return; // Don't summarize empty text
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      if (response.ok) {
        setSummaries((prevSummaries) => [data.summary, ...prevSummaries]); // Add new summary to the beginning
        setInputText(''); // Clear the textarea after summarizing
      } else {
        throw new Error(data.error || 'An error occurred');
      }
    } catch (error) { // Ensure error can be of any type
      const errorMessage = (error as Error)?.message || 'An error occurred while summarizing the text.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSummarize();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid newline in textarea
      handleSummarize();
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputText(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={`${styles.logo} ${orbitron.className}`}>Synops</h2>
        <button onClick={handleLogout} className={`${styles.logoutButton} ${inter.className}`}>
          Logout
        </button>
      </div>
      <div className={styles.transparentBox}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.textareaWrapper}>
            <textarea
              className={`${styles.textarea} ${inter.className}`}
              placeholder="Paste your text here to summarize..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={6}
            />
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className={styles.hiddenFileInput}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.uploadButton}
              aria-label="Upload file"
            >
              <Link2 className={styles.inkIcon} />
            </button>
          </div>
          <button type="submit" className={`${styles.button} ${inter.className}`} disabled={isLoading}>
            {isLoading ? 'Summarizing...' : 'Summarize'}
          </button>
        </form>
        {error && (
          <div className={styles.errorBox}>
            <p className={`${styles.errorText} ${inter.className}`}>{error}</p>
          </div>
        )}
        {summaries.length > 0 && (
          <div className={styles.summaryContainer}>
            {summaries.map((summary, index) => (
              <div key={index} className={styles.summaryBox}>
                <h2 className={`${styles.summaryTitle} ${orbitron.className}`}>Summary {summaries.length - index}</h2>
                <p className={`${styles.summaryText} ${inter.className}`}>{summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
