-- Create table for page analytics
CREATE TABLE public.page_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    page_url TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    event_type TEXT NOT NULL, -- 'page_view', 'form_submit', 'bounce'
    time_on_page INTEGER, -- seconds spent on page
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics (public tracking)
CREATE POLICY "Anyone can insert analytics" 
ON public.page_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_page_analytics_event_type ON public.page_analytics(event_type);
CREATE INDEX idx_page_analytics_created_at ON public.page_analytics(created_at);