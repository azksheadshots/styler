'use client';

import { useState } from 'react';
import { StyleForm } from '@/components/style-form';
import { StyleSuggestions } from '@/components/style-suggestions';
import { Logo } from '@/components/logo';
import type { SuggestClothingStylesOutput, SuggestClothingStylesInput } from '@/ai/flows/suggest-clothing-styles';
import { handleStyleSuggestion } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [suggestion, setSuggestion] = useState<SuggestClothingStylesOutput | null>(null);
  const [formInput, setFormInput] = useState<SuggestClothingStylesInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFormSubmit = async (data: SuggestClothingStylesInput) => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    setFormInput(data);

    try {
      const result = await handleStyleSuggestion(data);
      if (result) {
        setSuggestion(result);
      } else {
        setError('Failed to get suggestions. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-4">
          <Logo />
          <h1 className="text-2xl font-headline font-bold text-primary">KS Headshot Styler</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <StyleForm onSubmit={onFormSubmit} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8">
            {isLoading && (
              <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Generating your style... this may take a moment.</p>
                </div>
              </div>
            )}
            {error && <div className="flex items-center justify-center h-full min-h-[50vh] text-destructive bg-destructive/10 rounded-lg p-4">{error}</div>}
            {suggestion && formInput && (
              <div id="printable-area">
                <StyleSuggestions suggestion={suggestion} input={formInput} />
              </div>
            )}
            {!isLoading && !suggestion && !error && (
                <div className="flex flex-col items-center justify-center h-full min-h-[50vh] rounded-lg border-2 border-dashed border-border p-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-muted-foreground/50 mx-auto"><path d="M12 2a10 10 0 1 0 10 10c0-2.34-1.1-4.6-2-6"/><path d="m16 8-1.9-2.6-1.1 1.3-1.4-1.8-1.6 1.1"/><path d="M7.5 12.5c0-1.5 2-2.5 4.5-2.5s4.5 1 4.5 2.5"/><path d="M14.5 13c-2 2-7 2-7 0"/></svg>
                    <h3 className="mt-4 text-xl font-semibold font-headline">Your AI-powered style guide awaits</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Fill out the form to get personalized clothing recommendations for your professional headshot.</p>
                </div>
            )}
          </div>
        </div>
      </main>
      <footer className="p-4 border-t text-center text-sm text-muted-foreground">
        <p>Powered by Firebase and Google AI</p>
      </footer>
    </div>
  );
}
