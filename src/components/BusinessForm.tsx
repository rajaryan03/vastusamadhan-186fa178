import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Send, Sparkles, User, Phone, Mail, Upload, MapPin, Clock, FileImage, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { indianStates } from "@/data/indianStates";
import { supabase } from "@/integrations/supabase/client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Please enter a valid phone number").max(15),
  email: z.string().email("Please enter a valid email address"),
  floorPlan: z
    .instanceof(File, { message: "Please upload your floor plan" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 10MB")
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), "Please upload an image (JPG, PNG, WEBP) or PDF"),
  dateOfBirth: z.date({ required_error: "Please select your date of birth" }),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().min(1, "Please select your place of birth"),
});

type FormData = z.infer<typeof formSchema>;

export function BusinessForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      timeOfBirth: "",
      placeOfBirth: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    
    try {
      // Upload floor plan to storage
      const fileExt = data.floorPlan.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('floor-plans')
        .upload(fileName, data.floorPlan);

      if (uploadError) {
        throw new Error(`Failed to upload floor plan: ${uploadError.message}`);
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('floor-plans')
        .getPublicUrl(fileName);

      // Save form data to database
      const { error: insertError } = await supabase
        .from('business_registrations')
        .insert({
          name: data.name,
          phone_number: data.phone,
          email: data.email,
          date_of_birth: format(data.dateOfBirth, 'yyyy-MM-dd'),
          time_of_birth: data.timeOfBirth || null,
          place_of_birth: data.placeOfBirth,
          floor_plan_url: publicUrl,
        });

      if (insertError) {
        throw new Error(`Failed to save registration: ${insertError.message}`);
      }

      // Track successful form submission for analytics
      const sessionId = sessionStorage.getItem("analytics_session_id") || `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      await supabase.from("page_analytics").insert({
        session_id: sessionId,
        page_url: window.location.href,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        event_type: "form_submit",
        time_on_page: null,
      });

      toast({
        title: "✨ Form Submitted Successfully",
        description: "Thank you for your submission. We'll be in touch soon!",
      });
      
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <FormLabel className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    className="bg-background/50 border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-300 h-12 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
                  <FormLabel className="flex items-center gap-2 text-foreground font-medium text-sm">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+91 98765 43210"
                      type="tel"
                      className="bg-background/50 border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-300 h-12 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <FormLabel className="flex items-center gap-2 text-foreground font-medium text-sm">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      type="email"
                      className="bg-background/50 border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-300 h-12 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Floor Plan Upload */}
          <FormField
            control={form.control}
            name="floorPlan"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
                <FormLabel className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  Floor Plan
                </FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 text-center relative overflow-hidden group",
                        "hover:border-primary/50 hover:bg-primary/5",
                        selectedFile ? "border-primary/50 bg-primary/5" : "border-border/60 bg-background/30"
                      )}
                    >
                      {/* Decorative corners */}
                      <div className="absolute top-2 left-2 text-primary/20 text-xs">✦</div>
                      <div className="absolute top-2 right-2 text-primary/20 text-xs">✦</div>
                      <div className="absolute bottom-2 left-2 text-primary/20 text-xs">✦</div>
                      <div className="absolute bottom-2 right-2 text-primary/20 text-xs">✦</div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            onChange(file);
                          }
                        }}
                        {...field}
                      />
                      {selectedFile ? (
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <FileImage className="w-7 h-7 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-foreground">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-2 hover:bg-destructive/10 hover:text-destructive rounded-xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              onChange(undefined);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FileImage className="w-8 h-8 text-primary/70" />
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            Drop your floor plan here
                          </p>
                          <p className="text-xs text-muted-foreground">
                            or click to browse (PNG, JPG, PDF)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <FormLabel className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                  </div>
                  Date of Birth
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal bg-background/50 border-border/60 hover:bg-primary/5 hover:border-primary/40 rounded-xl",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4 text-primary/70" />
                        {field.value ? format(field.value, "PPP") : "Select your birth date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border rounded-xl shadow-elevated" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="pointer-events-auto rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time of Birth (Optional) */}
          <FormField
            control={form.control}
            name="timeOfBirth"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "0.35s" }}>
                <FormLabel className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  Time of Birth
                  <span className="text-muted-foreground text-xs font-normal ml-1">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="bg-background/50 border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-300 h-12 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-muted-foreground text-xs mt-2">
                  If known, this helps with precise Kundli calculations
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Place of Birth - Indian States Dropdown */}
          <FormField
            control={form.control}
            name="placeOfBirth"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <FormLabel className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  Place of Birth
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-background/50 border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-xl">
                      <SelectValue placeholder="Select your birth state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border max-h-[300px] rounded-xl shadow-elevated">
                    {indianStates.map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer rounded-lg"
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ornate Divider */}
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <span className="text-primary/40 text-xs">✦</span>
            <span className="text-primary/60">❁</span>
            <span className="text-primary/40 text-xs">✦</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          {/* Submit Button */}
          <div className="animate-fade-in" style={{ animationDelay: "0.45s" }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300 group rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-3" />
                  Analyzing Cosmic Energies...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Submit Your Details
                  <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}