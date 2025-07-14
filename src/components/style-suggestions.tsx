"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown, Printer, Send, Loader2 } from 'lucide-react';
import type { SuggestClothingStylesOutput, SuggestClothingStylesInput } from '@/ai/flows/suggest-clothing-styles';
import { handleFeedback, handleImageGeneration } from '@/app/actions';
import { Skeleton } from './ui/skeleton';

interface StyleSuggestionsProps {
  suggestion: SuggestClothingStylesOutput;
  input: SuggestClothingStylesInput;
}

const ClothingImage = ({ item }: { item: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function generateImage() {
      setIsLoading(true);
      try {
        const result = await handleImageGeneration({ clothingDescription: item });
        setImageUrl(result.imageUrl);
      } catch (error) {
        console.error("Failed to generate image for", item, error);
        // Fallback to a placeholder if generation fails
        setImageUrl(`https://placehold.co/400x400.png`);
      } finally {
        setIsLoading(false);
      }
    }
    generateImage();
  }, [item]);

  return (
    <Card>
      <CardContent className="flex flex-col aspect-square items-center justify-center p-2">
        {isLoading || !imageUrl ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : (
          <Image
            src={imageUrl}
            alt={item}
            width={400}
            height={400}
            className="rounded-lg object-cover"
            data-ai-hint="clothing item"
          />
        )}
        <p className="mt-4 text-center font-medium text-sm">{item}</p>
      </CardContent>
    </Card>
  );
};

export function StyleSuggestions({ suggestion, input }: StyleSuggestionsProps) {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const onFeedbackSubmit = async () => {
    if (rating === null) {
      toast({
        title: "Rating required",
        description: "Please rate the suggestion before submitting feedback.",
        variant: "destructive",
      });
      return;
    }
    setIsFeedbackLoading(true);
    try {
      await handleFeedback({
        suggestion: suggestion.clothingSuggestions,
        feedback,
        role: input.role,
        stylePreferences: input.stylePreferences,
        rating,
      });
      setFeedbackSubmitted(true);
      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping us improve!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const suggestedItems = useMemo(() => {
    return suggestion.clothingSuggestions
      .split('\n')
      .map(item => item.replace(/^(-|\d+\.?)\s*/, '').trim())
      .filter(item => item.length > 0);
  }, [suggestion.clothingSuggestions]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline text-3xl">Your Style Board</CardTitle>
            <CardDescription>Based on your profile, here are our AI's top picks.</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={handlePrint} aria-label="Export Suggestions" className="no-print">
            <Printer className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="p-2">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {suggestedItems.map((item, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <ClothingImage item={item} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="no-print" />
              <CarouselNext className="no-print" />
            </Carousel>
          </div>
          <Card className="mt-6 bg-secondary/50 border-none shadow-none">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Stylist's Notes</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{suggestion.reasoning}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      
      <div className="no-print">
      {!feedbackSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Help Us Improve</CardTitle>
            <CardDescription>Did you find these suggestions helpful? Your feedback is valuable.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <p className="font-medium text-sm">Your rating:</p>
              <Button 
                variant={rating === 5 ? "default" : "outline"} 
                size="icon" 
                onClick={() => setRating(5)}
                aria-pressed={rating === 5}
                className="rounded-full"
              >
                <ThumbsUp />
              </Button>
              <Button 
                variant={rating === 1 ? "destructive" : "outline"} 
                size="icon" 
                onClick={() => setRating(1)}
                aria-pressed={rating === 1}
                className="rounded-full"
              >
                <ThumbsDown />
              </Button>
            </div>
            <Textarea 
              placeholder="Tell us what you liked or what could be better..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button onClick={onFeedbackSubmit} disabled={isFeedbackLoading}>
              {isFeedbackLoading ? <Loader2 className="animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-accent/20 border-accent">
            <CardContent className="p-6 text-center">
                <p className="font-medium text-accent-foreground">Thank you for your feedback!</p>
            </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
