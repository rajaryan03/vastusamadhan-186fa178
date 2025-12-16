-- Allow reading business registrations (for admin viewing)
CREATE POLICY "Allow reading registrations"
ON public.business_registrations
FOR SELECT
USING (true);