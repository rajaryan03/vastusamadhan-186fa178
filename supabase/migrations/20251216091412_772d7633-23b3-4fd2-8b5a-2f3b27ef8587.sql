-- Create table for business registrations
CREATE TABLE public.business_registrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    time_of_birth TIME,
    place_of_birth TEXT NOT NULL,
    floor_plan_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.business_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit registration" 
ON public.business_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create storage bucket for floor plans
INSERT INTO storage.buckets (id, name, public) 
VALUES ('floor-plans', 'floor-plans', true);

-- Allow anyone to upload floor plans
CREATE POLICY "Anyone can upload floor plans"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'floor-plans');

-- Allow public read access to floor plans
CREATE POLICY "Anyone can view floor plans"
ON storage.objects
FOR SELECT
USING (bucket_id = 'floor-plans');