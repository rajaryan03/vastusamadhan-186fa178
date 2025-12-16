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
import { Label } from "@/components/ui/label";
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
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Form submitted:", data);
    
    toast({
      title: "✨ Form Submitted Successfully",
      description: "Thank you for your submission. We'll be in touch soon!",
    });
    
    form.reset();
    setSelectedFile(null);
    setIsSubmitting(false);
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
                <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    className="bg-card border-border/50 focus:border-primary/50 transition-all duration-300 h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
                  <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                    <Phone className="w-4 h-4 text-primary" />
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+91 98765 43210"
                      type="tel"
                      className="bg-card border-border/50 focus:border-primary/50 transition-all duration-300 h-12"
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
                  <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                    <Mail className="w-4 h-4 text-primary" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      type="email"
                      className="bg-card border-border/50 focus:border-primary/50 transition-all duration-300 h-12"
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
                <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                  <Upload className="w-4 h-4 text-primary" />
                  Floor Plan
                </FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-300 text-center",
                        "hover:border-primary/50 hover:bg-secondary/30",
                        selectedFile ? "border-primary/50 bg-secondary/20" : "border-border/50 bg-card"
                      )}
                    >
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
                        <div className="flex items-center justify-center gap-3">
                          <FileImage className="w-8 h-8 text-primary" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-2 hover:bg-destructive/10 hover:text-destructive"
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
                        <div className="space-y-2">
                          <FileImage className="w-10 h-10 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload your floor plan
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            JPG, PNG, WEBP or PDF (max 10MB)
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
                <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  Date of Birth
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal bg-card border-border/50 hover:bg-secondary/50",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : "Select your birth date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="pointer-events-auto"
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
                <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                  <Clock className="w-4 h-4 text-primary" />
                  Time of Birth
                  <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="bg-card border-border/50 focus:border-primary/50 transition-all duration-300 h-12"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-muted-foreground text-sm">
                  If known, this helps with precise calculations
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
                <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  Place of Birth
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-card border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select your birth state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border max-h-[300px]">
                    {indianStates.map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className="hover:bg-secondary focus:bg-secondary cursor-pointer"
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

          {/* Submit Button */}
          <div className="pt-4 animate-fade-in" style={{ animationDelay: "0.45s" }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated hover:shadow-glow transition-all duration-300 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Submitting...
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
