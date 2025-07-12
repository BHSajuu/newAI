"use client";

import React, { useState } from "react";
import { MailIcon, UserIcon, MessageSquareIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import ClickSpark from "@/components/Animations/ClickSpark/ClickSpark";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactFormValues = z.infer<typeof contactFormSchema>;

function Contact() {
  const [isSending, setIsSending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSending(true);
    const loadingToast = toast.loading("Sending your message…");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("message", data.message);
      formData.append("access_key", "aa75e5cf-7f08-4620-8475-b9912e092f4e");
      formData.append("subject", "Query from FitFlow Website");

      const payload = JSON.stringify(Object.fromEntries(formData));
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: payload,
      }).then((r) => r.json());

      if (res.success) {
        toast.success("🎉 Message sent! I’ll be in touch soon.", { id: loadingToast });
        reset();
      } else {
        throw new Error(res.message || "Submission failed");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Oops! Something went wrong.",
        { id: loadingToast }
      );
    } finally {
      setIsSending(false);
    }
  };

  return (

    <ClickSpark
      sparkColor='#fff'
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <section id="contact" className="pt-12 pb-32 bg-muted/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="glass rounded-2xl p-6 mb-8 text-center">
            <h2 className="text-4xl font-extrabold mb-2">
              <span className="text-primary">Share Your Queries</span>
            </h2>
            <p className="text-muted-foreground">
              Questions, feedback, or just want to say hello? I’d love to hear from you!
            </p>
          </div>
          <div className="glass rounded-2xl p-6 shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <InputField
                id="name"
                label="Name"
                icon={<UserIcon className="w-5 h-5 text-muted-foreground" />}
                placeholder="Your name"
                error={errors.name}
                register={register("name")}
              />

              <InputField
                id="email"
                label="Email"
                icon={<MailIcon className="w-5 h-5 text-muted-foreground" />}
                placeholder="you@example.com"
                type="email"
                error={errors.email}
                register={register("email")}
              />

              <TextAreaField
                id="message"
                label="Message"
                icon={<MessageSquareIcon className="w-5 h-5 text-muted-foreground" />}
                placeholder="Write your message"
                error={errors.message}
                register={register("message")}
              />

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <MailIcon className="w-5 h-5" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </ClickSpark>



  );
}

// Reusable Input Field Component
function InputField({
  id,
  label,
  icon,
  placeholder,
  error,
  register,
  type = "text",
}: any) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          {...register}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}

// Reusable Textarea Field Component
function TextAreaField({ id, label, icon, placeholder, error, register }: any) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute top-2 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <textarea
          id={id}
          {...register}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2 border border-border rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}

export default Contact;
