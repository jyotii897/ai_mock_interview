"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    jobRole: z.string().min(2, "Job role is required"),
    techStack: z.string().min(2, "Tech stack is required"),
    yearsOfExperience: z.coerce.number().min(0, "Experience cannot be negative"),
    questionCount: z.coerce.number().min(1).max(10).default(5),
});

interface InterviewModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialJobRole?: string;
}

const InterviewModal = ({
    isOpen,
    onOpenChange,
    initialJobRole = "",
}: InterviewModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    type FormData = z.infer<typeof formSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            jobRole: initialJobRole,
            techStack: "",
            yearsOfExperience: 0,
            questionCount: 5,
        },
    });

    // Reset form when initialJobRole changes or modal opens
    useEffect(() => {
        if (isOpen) {
            form.reset({
                jobRole: initialJobRole,
                techStack: "",
                yearsOfExperience: 0,
                questionCount: 5,
            });
        }
    }, [isOpen, initialJobRole, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        console.log("Starting interview with:", values);

        try {
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            console.log("Gemini Response:", data);

            if (data.questions) {
                // Save to localStorage for the interview page
                localStorage.setItem("interviewQuestions", JSON.stringify(data.questions));
                // Close modal and navigate
                onOpenChange(false);
                router.push("/interview");
            } else {
                console.error("No questions returned", data);
                alert(`Error: ${data.error || "No questions returned from AI"}`);
            }

        } catch (error) {
            console.error("Failed to generate interview:", error);
            alert("Failed to connect to the server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">
                        Interview Settings
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Customize your mock interview session.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="jobRole"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-200">Job Role</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Full-Stack Developer"
                                            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="techStack"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-200">Tech Stack</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. React, Node.js, Next.js"
                                            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-slate-500 text-xs">
                                        Separate technologies with commas.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="yearsOfExperience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">Experience (Years)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                className="bg-slate-950 border-slate-800 text-white"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="questionCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">Questions</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="10"
                                                className="bg-slate-950 border-slate-800 text-white"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Preparing...
                                    </>
                                ) : (
                                    "Start Interview"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default InterviewModal;
